/*
  QEditor — Quill 기반 표준 에디터 컴포넌트 v1.0
  ================================================
  의존성: Quill v2.0.3 (qeditor.js보다 먼저 로드)
  사용법:

    // 기본 초기화
    QEditor.init('editor');

    // 옵션 지정
    QEditor.init('editor', {
      uploadUrl : '/board/upload',   // 이미지 업로드 API URL
      mockUpload: false,             // 실서버 연동 시 false
      minHeight : '300px',
      maxLength : 5000,
      features  : { video: false, codeBlock: false },
    });

    QEditor.getValue('editor');        // HTML 수집 (저장 시)
    QEditor.setValue('editor', html);  // 내용 주입 (수정 페이지)
    QEditor.isEmpty('editor');         // 빈 값 여부 확인


  이미지 업로드 API
    Method  : POST
    Request : multipart/form-data { image: File }
    Response: { "url": "https://..." }
    제한    : 최대 5MB / jpg, png, gif, webp

    mockUpload: true  — Base64 직접 삽입 (개발·시연용, 실서버 금지)
    mockUpload: false — 서버 POST 후 응답 URL 삽입


  서버 연동 전환 체크리스트
    [ ] mockUpload: true → false
    [ ] uploadUrl를 실제 업로드 API 경로로 교체
    [ ] 저장 API 경로 교체
    [ ] DB 컬럼: TEXT 또는 LONGTEXT / utf8mb4 인코딩
    [ ] 서버에서 HTMLPurifier로 Sanitize 처리 필수


  PHP XSS 처리 (HTMLPurifier)
    composer require ezyang/htmlpurifier

    $config = HTMLPurifier_Config::createDefault();
    $config->set('HTML.Allowed',
        'p,br,strong,em,u,s,span[style|class],a[href|target|rel],' .
        'ul,ol,li,blockquote,pre,img[src|alt|style],h1,h2,h3,h4,h5,h6'
    );
    $config->set('CSS.AllowedProperties', 'font-size,color,background-color,text-align');
    $purifier = new HTMLPurifier($config);
    $clean    = $purifier->purify($_POST['content']);


  폰트 추가 시 수정 위치 3곳
    [ ] qeditor.css: .ql-font-xxx 클래스 + 드롭다운 라벨 ::before
    [ ] qeditor.js : FontAttributor.whitelist 배열
*/

'use strict';

const QEditor = (function () {

  const DEFAULTS = {
    uploadUrl: '/api/upload/image',
    mockUpload: true,
    minHeight: '450px',
    placeholder: '내용을 입력하세요...',
    maxLength: 0,

    image: {
      maxSizeMB: 5,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    },

    features: {
      font: true, size: true, header: true,
      bold: true, italic: true, underline: true, strike: true,
      color: true, background: true,
      align: true, indent: true, list: true, script: true,
      link: true, image: true, video: true,
      blockquote: true, codeBlock: true, clean: true,
    },

    colorsAll: [
      '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#ffffff',
      '#ff0000', '#e53935', '#c62828', '#b71c1c', '#ff5252', '#ff8a80',
      '#e91e63', '#d81b60', '#ad1457', '#880e4f', '#ff4081', '#f48fb1',
      '#9c27b0', '#8e24aa', '#6a1b9a', '#4a148c', '#e040fb', '#ce93d8',
      '#2196f3', '#1e88e5', '#1565c0', '#0d47a1', '#448aff', '#90caf9',
      '#009688', '#00897b', '#00695c', '#004d40', '#1de9b6', '#80cbc4',
      '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#00e676', '#a5d6a7',
      '#ff9800', '#fb8c00', '#f57c00', '#e65100', '#ffcc02', '#ffe082',
    ],
  };

  const _instances = {};
  let _formatsRegistered = false;


  function _registerFormats() {
    const FontAttributor = Quill.import('attributors/class/font');
    FontAttributor.whitelist = ['malgun', 'nanum', 'noto', 'gulim', 'dotum', 'batang', 'georgia', 'arial'];
    Quill.register({ 'attributors/class/font': FontAttributor }, true);
    Quill.register({ 'formats/font': FontAttributor }, true);

    const SizeAttributor = Quill.import('attributors/style/size');
    SizeAttributor.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'];
    Quill.register({ 'attributors/style/size': SizeAttributor }, true);
    Quill.register({ 'formats/size': SizeAttributor }, true);
  }


  function _buildToolbar(f) {
    const tb = [];

    const r1 = [];
    if (f.font)      r1.push({ font: ['malgun', 'nanum', 'noto', 'gulim', 'dotum', 'batang', 'georgia', 'arial'] });
    if (f.size)      r1.push({ size: ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'] });
    if (f.header)    r1.push({ header: [1, 2, 3, 4, 5, 6, false] });
    if (f.bold)      r1.push('bold');
    if (f.italic)    r1.push('italic');
    if (f.underline) r1.push('underline');
    if (f.strike)    r1.push('strike');
    if (r1.length)   tb.push(r1);

    const r3 = [];
    if (f.color)      r3.push({ color: [] });
    if (f.background) r3.push({ background: [] });
    if (r3.length)    tb.push(r3);

    const r4 = [];
    if (f.align)  r4.push({ align: [] });
    if (f.indent) r4.push({ indent: '-1' }, { indent: '+1' });
    if (f.list)   r4.push({ list: 'ordered' }, { list: 'bullet' });
    if (f.script) r4.push({ script: 'sub' }, { script: 'super' });
    if (r4.length) tb.push(r4);

    const r5 = [];
    if (f.link)      r5.push('link');
    if (f.image)     r5.push('image');
    if (f.video)     r5.push('video');
    if (f.blockquote) r5.push('blockquote');
    if (f.codeBlock) r5.push('code-block');
    if (f.clean)     r5.push('clean');
    if (r5.length)   tb.push(r5);

    return tb;
  }


  function _buildDOM(targetId) {
    const mountEl = document.getElementById(targetId);
    if (!mountEl) {
      console.error('[QEditor] #' + targetId + ' 를 찾을 수 없습니다.');
      return null;
    }

    const wrap = document.createElement('div');
    wrap.className = 'qe-wrap';
    mountEl.parentNode.insertBefore(wrap, mountEl);

    const uploading = document.createElement('div');
    uploading.className = 'qe-uploading';
    uploading.textContent = '이미지 업로드 중...';

    const editorArea = document.createElement('div');
    editorArea.className = 'qe-editor-area';
    editorArea.appendChild(mountEl);

    const htmlTA = document.createElement('textarea');
    htmlTA.id = targetId + '_htmlTA';
    htmlTA.className = 'qe-raw-textarea';
    htmlTA.placeholder = 'HTML 코드를 직접 입력하거나 수정할 수 있습니다.';
    htmlTA.spellcheck = false;
    editorArea.appendChild(htmlTA);

    const textTA = document.createElement('textarea');
    textTA.id = targetId + '_textTA';
    textTA.className = 'qe-raw-textarea is-text-mode';
    textTA.placeholder = '순수 텍스트를 확인할 수 있습니다.';
    textTA.readOnly = true;
    editorArea.appendChild(textTA);

    const tabs = document.createElement('div');
    tabs.className = 'qe-tabs';
    ['EDITOR', 'HTML', 'TEXT'].forEach(function (label, i) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qe-tab-btn' + (i === 0 ? ' is-active' : '');
      btn.dataset.tab = label.toLowerCase();
      btn.textContent = label;
      tabs.appendChild(btn);
    });

    const statusbar = document.createElement('div');
    statusbar.className = 'qe-statusbar';

    const charCount = document.createElement('span');
    charCount.className = 'qe-char-count';
    charCount.textContent = '0자';

    const modeLabel = document.createElement('span');
    modeLabel.className = 'qe-mode-label';
    modeLabel.textContent = 'EDITOR 모드';

    statusbar.appendChild(charCount);
    statusbar.appendChild(modeLabel);

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'qe-resize-handle';
    resizeHandle.innerHTML = '<span>입력창 크기 조절</span>';

    wrap.appendChild(uploading);
    wrap.appendChild(editorArea);
    wrap.appendChild(tabs);
    wrap.appendChild(statusbar);
    wrap.appendChild(resizeHandle);

    return { wrap, uploading, editorArea, htmlTA, textTA, tabs, charCount, modeLabel, resizeHandle };
  }


  function _initTabs(inst) {
    const { tabs, htmlTA, textTA, charCount, modeLabel, editorArea } = inst.dom;
    const { quill } = inst;
    let currentTab = 'editor';

    const labelMap = { editor: 'EDITOR 모드', html: 'HTML 모드', text: 'TEXT 모드' };

    function setHeight(px) {
      const editorEl = editorArea.querySelector('.ql-editor');
      if (editorEl) {
        editorEl.style.minHeight = px + 'px';
        editorEl.style.height = px + 'px';
      }
      const container = editorArea.querySelector('.ql-container');
      if (container) {
        htmlTA.style.height = container.offsetHeight + 'px';
        textTA.style.height = container.offsetHeight + 'px';
      }
    }

    function switchTab(targetTab) {
      if (targetTab === currentTab) return;

      if (currentTab === 'html') {
        try {
          quill.clipboard.dangerouslyPasteHTML(htmlTA.value || '');
        } catch (e) {
          console.warn('[QEditor] HTML 파싱 오류:', e);
          quill.setText('');
        }
      }

      const container = editorArea.querySelector('.ql-container');
      const containerH = container ? container.offsetHeight : 450;

      if (targetTab === 'html') {
        htmlTA.value = quill.root.innerHTML;
        htmlTA.style.height = containerH + 'px';
        htmlTA.classList.add('is-visible');
        textTA.classList.remove('is-visible');
      } else if (targetTab === 'text') {
        textTA.value = quill.getText().replace(/\n$/, '');
        textTA.style.height = containerH + 'px';
        textTA.classList.add('is-visible');
        htmlTA.classList.remove('is-visible');
      } else {
        htmlTA.classList.remove('is-visible');
        textTA.classList.remove('is-visible');
      }

      tabs.querySelectorAll('.qe-tab-btn').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.dataset.tab === targetTab);
      });

      modeLabel.textContent = labelMap[targetTab] || '';

      const toolbar = editorArea.querySelector('.ql-toolbar');
      if (toolbar) {
        toolbar.style.opacity = targetTab === 'editor' ? '1' : '0.4';
        toolbar.style.pointerEvents = targetTab === 'editor' ? 'auto' : 'none';
      }

      currentTab = targetTab;
    }

    tabs.querySelectorAll('.qe-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { switchTab(btn.dataset.tab); });
    });

    inst.getCurrentTab = function () { return currentTab; };
    inst.setHeight = setHeight;

    inst.syncFromCurrentTab = function () {
      if (currentTab === 'html') {
        try {
          quill.clipboard.dangerouslyPasteHTML(htmlTA.value || '');
        } catch (e) {
          quill.setText('');
        }
      }
    };
  }


  function _initResize(inst) {
    const { resizeHandle, wrap, editorArea } = inst.dom;
    const MIN_HEIGHT = 200;
    const MAX_HEIGHT = 1200;
    let isDragging = false, startY = 0, startHeight = 0;

    function getEditorHeight() {
      const el = editorArea.querySelector('.ql-editor');
      return el ? el.offsetHeight : 450;
    }

    resizeHandle.addEventListener('mousedown', function (e) {
      isDragging = true;
      startY = e.clientY;
      startHeight = getEditorHeight();
      resizeHandle.classList.add('is-dragging');
      wrap.classList.add('is-resizing');
      document.body.style.cursor = 'ns-resize';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      inst.setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeight + (e.clientY - startY))));
    });

    document.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      resizeHandle.classList.remove('is-dragging');
      wrap.classList.remove('is-resizing');
      document.body.style.cursor = '';
    });

    resizeHandle.addEventListener('touchstart', function (e) {
      isDragging = true;
      startY = e.touches[0].clientY;
      startHeight = getEditorHeight();
      resizeHandle.classList.add('is-dragging');
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      inst.setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeight + (e.touches[0].clientY - startY))));
    }, { passive: false });

    document.addEventListener('touchend', function () {
      if (!isDragging) return;
      isDragging = false;
      resizeHandle.classList.remove('is-dragging');
      wrap.classList.remove('is-resizing');
    });
  }


  function _createColorPicker(type, toolbar, quill, colorsAll) {
    let currentColor = type === 'color' ? '#000000' : '#ffffff';

    const qlBtn = toolbar.querySelector(type === 'color' ? '.ql-color' : '.ql-background');
    if (!qlBtn) return;

    const wrapEl = document.createElement('span');
    wrapEl.style.cssText = 'position:relative;display:inline-block;vertical-align:middle;margin:0 1px;';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'cp-trigger';
    trigger.title = type === 'color' ? '글자색' : '글자 배경색';

    if (type === 'color') {
      trigger.innerHTML =
        '<span class="cp-color-icon">' +
        '<span class="cp-label">A</span>' +
        '<span class="cp-color-bar" style="background:' + currentColor + '"></span>' +
        '</span>';
    } else {
      trigger.innerHTML =
        '<span class="cp-color-icon">' +
        '<span class="cp-bg-icon-wrap">' +
        '<span class="cp-bg-color-fill" style="background:transparent"></span>' +
        '<span class="cp-bg-icon-label">A</span>' +
        '</span>' +
        '<span class="cp-color-bar" style="background:' + currentColor + '"></span>' +
        '</span>';
    }

    const panel = document.createElement('div');
    panel.className = 'cp-panel';

    const palette = document.createElement('div');
    palette.className = 'cp-palette';
    colorsAll.forEach(function (hex) {
      const sw = document.createElement('span');
      sw.className = 'cp-swatch';
      sw.style.background = hex;
      sw.title = hex;
      sw.addEventListener('click', function () { applyColor(hex); closePanel(); });
      palette.appendChild(sw);
    });

    const divider = document.createElement('hr');
    divider.className = 'cp-divider';

    const inputRow = document.createElement('div');
    inputRow.className = 'cp-input-row';

    const preview = document.createElement('label');
    preview.className = 'cp-preview';
    preview.title = '클릭하면 직접 색상 선택';

    const previewInner = document.createElement('span');
    previewInner.className = 'cp-preview-inner';
    previewInner.style.background = currentColor;

    const nativePicker = document.createElement('input');
    nativePicker.type = 'color';
    nativePicker.className = 'cp-native';
    nativePicker.value = currentColor;
    nativePicker.addEventListener('input', function (e) {
      hexInput.value = e.target.value.toUpperCase();
      previewInner.style.background = e.target.value;
    });
    nativePicker.addEventListener('change', function (e) { applyColor(e.target.value); });

    preview.appendChild(previewInner);
    preview.appendChild(nativePicker);

    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.className = 'cp-hex-input';
    hexInput.value = currentColor.toUpperCase();
    hexInput.maxLength = 7;
    hexInput.placeholder = '#000000';
    hexInput.addEventListener('input', function (e) {
      if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
        previewInner.style.background = e.target.value;
        nativePicker.value = e.target.value;
      }
    });
    hexInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); applyAndClose(); }
    });

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'cp-apply-btn';
    applyBtn.textContent = '입력';
    applyBtn.addEventListener('click', applyAndClose);

    inputRow.appendChild(preview);
    inputRow.appendChild(hexInput);
    inputRow.appendChild(applyBtn);

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'cp-clear-btn';
    clearBtn.textContent = '색상 제거';
    clearBtn.addEventListener('click', function () {
      quill.format(type === 'color' ? 'color' : 'background', false);
      updateBar(type === 'color' ? '#000000' : '#ffffff');
      closePanel();
    });

    panel.appendChild(palette);
    panel.appendChild(divider);
    panel.appendChild(inputRow);
    panel.appendChild(clearBtn);

    wrapEl.appendChild(trigger);
    wrapEl.appendChild(panel);
    qlBtn.parentNode.insertBefore(wrapEl, qlBtn);

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const isOpen = panel.classList.contains('is-open');
      document.querySelectorAll('.cp-panel.is-open').forEach(function (p) { p.classList.remove('is-open'); });
      if (!isOpen) panel.classList.add('is-open');
    });

    panel.addEventListener('click', function (e) { e.stopPropagation(); });

    function applyColor(hex) {
      quill.focus();
      quill.format(type === 'color' ? 'color' : 'background', hex);
      updateBar(hex);
    }

    function updateBar(hex) {
      currentColor = hex;
      trigger.querySelector('.cp-color-bar').style.background = hex;
      previewInner.style.background = hex;
      nativePicker.value = hex;
      hexInput.value = hex.toUpperCase();

      if (type === 'background') {
        const fill = trigger.querySelector('.cp-bg-color-fill');
        const label = trigger.querySelector('.cp-bg-icon-label');
        if (fill) fill.style.background = hex;
        if (label) label.style.color = _isDark(hex) ? '#fff' : '#222';
      }

      palette.querySelectorAll('.cp-swatch').forEach(function (sw) {
        sw.classList.toggle('is-selected', sw.style.background === _hexToRgb(hex));
      });
    }

    function applyAndClose() {
      const val = hexInput.value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        applyColor(val);
        closePanel();
      } else {
        hexInput.style.borderColor = '#e00';
        setTimeout(function () { hexInput.style.borderColor = ''; }, 1000);
      }
    }

    function closePanel() { panel.classList.remove('is-open'); }

    function _rgbStringToHex(rgb) {
      var m = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!m) return null;
      return '#' +
        ('0' + parseInt(m[1]).toString(16)).slice(-2) +
        ('0' + parseInt(m[2]).toString(16)).slice(-2) +
        ('0' + parseInt(m[3]).toString(16)).slice(-2);
    }

    quill.on('selection-change', function (range) {
      if (!range || range.length > 0) return;
      var formats = quill.getFormat(range.index);
      var val = formats[type === 'color' ? 'color' : 'background'];
      if (val && typeof val === 'string') {
        var hex = val.charAt(0) === '#' ? val : _rgbStringToHex(val);
        if (hex) { updateBar(hex); return; }
      }
      updateBar(type === 'color' ? '#000000' : '#ffffff');
    });
  }


  function _makeImageHandler(cfg, quill, wrap) {
    return function () {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = cfg.image.allowedTypes.join(',');

      input.onchange = async function () {
        const file = input.files[0];
        if (!file) return;

        if (file.size > cfg.image.maxSizeMB * 1024 * 1024) {
          alert('이미지는 ' + cfg.image.maxSizeMB + 'MB 이하만 업로드 가능합니다.');
          return;
        }

        wrap.classList.add('is-uploading');

        try {
          let imageUrl = '';
          if (cfg.mockUpload) {
            imageUrl = await _fileToBase64(file);
          } else {
            const fd = new FormData();
            fd.append('image', file);
            const res = await fetch(cfg.uploadUrl, { method: 'POST', body: fd });
            if (!res.ok) throw new Error('서버 오류 (' + res.status + ')');
            const data = await res.json();
            imageUrl = data.url;
          }

          const range = quill.getSelection() || { index: quill.getLength() };
          quill.insertEmbed(range.index, 'image', imageUrl);
          quill.setSelection(range.index + 1);

        } catch (err) {
          console.error('[QEditor] 이미지 업로드 오류:', err);
          alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
        } finally {
          wrap.classList.remove('is-uploading');
        }
      };

      input.click();
    };
  }


  function _fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function (e) { resolve(e.target.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function _hexToRgb(hex) {
    return 'rgb(' +
      parseInt(hex.slice(1, 3), 16) + ', ' +
      parseInt(hex.slice(3, 5), 16) + ', ' +
      parseInt(hex.slice(5, 7), 16) + ')';
  }

  function _isDark(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }


  return {

    init: function (targetId, options) {
      options = options || {};

      if (!_formatsRegistered) {
        _registerFormats();
        _formatsRegistered = true;
      }

      const cfg = Object.assign({}, DEFAULTS, options);
      cfg.features = Object.assign({}, DEFAULTS.features, options.features || {});
      cfg.image = Object.assign({}, DEFAULTS.image, options.image || {});
      cfg.colorsAll = options.colorsAll || DEFAULTS.colorsAll;

      const dom = _buildDOM(targetId);
      if (!dom) return null;

      const quill = new Quill('#' + targetId, {
        theme: 'snow',
        placeholder: cfg.placeholder,
        formats: [
          'font', 'size', 'header',
          'bold', 'italic', 'underline', 'strike',
          'color', 'background',
          'align', 'indent', 'list', 'script',
          'link', 'image', 'video',
          'blockquote', 'code-block',
        ],
        modules: {
          toolbar: {
            container: _buildToolbar(cfg.features),
            handlers: { image: function () {} },
          },
        },
      });

      quill.keyboard.addBinding({ key: 'Tab' }, function (range) {
        quill.formatText(range.index, range.length, 'indent', '+1');
        return false;
      });

      quill.getModule('toolbar').addHandler('image', _makeImageHandler(cfg, quill, dom.wrap));

      const editorEl = dom.editorArea.querySelector('.ql-editor');
      if (editorEl) editorEl.style.minHeight = cfg.minHeight;

      const inst = { quill, dom, cfg };
      _instances[targetId] = inst;

      _initTabs(inst);
      _initResize(inst);

      const toolbar = dom.editorArea.querySelector('.ql-toolbar');
      if (cfg.features.color)      _createColorPicker('color', toolbar, quill, cfg.colorsAll);
      if (cfg.features.background) _createColorPicker('background', toolbar, quill, cfg.colorsAll);

      document.addEventListener('click', function () {
        document.querySelectorAll('.cp-panel.is-open').forEach(function (p) { p.classList.remove('is-open'); });
      });

      quill.on('text-change', function () {
        const len = quill.getLength() - 1;
        const max = cfg.maxLength;
        dom.charCount.textContent = max
          ? len.toLocaleString() + ' / ' + max.toLocaleString() + '자'
          : len.toLocaleString() + '자';
        dom.charCount.style.color = (max && len > max) ? '#e00' : '#888';
      });

      /* Quill 2.x 버그 패치: Enter 시 인라인 포맷 새 줄 미상속 */
      var _enterFormats = null;
      var _applyingFormats = false;
      var FORMAT_KEYS = ['bold', 'italic', 'underline', 'strike', 'size', 'font', 'color', 'background', 'align'];

      quill.root.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' || e.isComposing) return;
        var sel = quill.getSelection();
        if (!sel) return;
        var fmt = quill.getFormat(sel.index > 0 ? sel.index : 0);
        _enterFormats = {};
        FORMAT_KEYS.forEach(function (k) { if (fmt[k]) _enterFormats[k] = fmt[k]; });
      });

      quill.on('text-change', function (delta, oldDelta, source) {
        if (source !== 'user' || _applyingFormats) return;

        if (quill.getLength() === 1) {
          _enterFormats = null;
          _applyingFormats = true;
          FORMAT_KEYS.forEach(function (k) { quill.format(k, false); });
          _applyingFormats = false;
          return;
        }

        var hasNewline = delta.ops.some(function (op) { return op.insert === '\n'; });
        if (!hasNewline || !_enterFormats || !Object.keys(_enterFormats).length) return;

        var toApply = Object.assign({}, _enterFormats);
        setTimeout(function () {
          _applyingFormats = true;
          Object.keys(toApply).forEach(function (k) { quill.format(k, toApply[k]); });
          _enterFormats = Object.assign({}, toApply);
          _applyingFormats = false;
        }, 0);
      });

      return quill;
    },

    getValue: function (targetId) {
      const inst = _instances[targetId];
      if (!inst) return '';
      inst.syncFromCurrentTab();
      return inst.quill.root.innerHTML;
    },

    setValue: function (targetId, html) {
      const inst = _instances[targetId];
      if (!inst) return;
      inst.quill.clipboard.dangerouslyPasteHTML(html || '');
    },

    isEmpty: function (targetId) {
      const inst = _instances[targetId];
      if (!inst) return true;
      return inst.quill.getText().trim().length === 0;
    },

    getInstance: function (targetId) {
      return _instances[targetId] ? _instances[targetId].quill : null;
    },
  };

})();
