// ─── 아이디 중복 확인 ─────────────────────────────────────
const usernameInput = document.getElementById('username');
const usernameMsg   = document.getElementById('username_msg');
let usernameChecked = false;

document.getElementById('btn_check_username').addEventListener('click', function () {
    const val = usernameInput.value.trim();
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(val)) {
        usernameMsg.textContent = '아이디는 영문·숫자·밑줄(_)로 4~20자 입력해 주세요.';
        usernameMsg.className = 'form-text text-danger';
        usernameChecked = false;
        return;
    }
    usernameMsg.textContent = '확인 중...';
    usernameMsg.className = 'form-text text-muted';

    fetch(BASE_PATH + '/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: '_token=' + encodeURIComponent(CSRF_TOKEN) + '&username=' + encodeURIComponent(val),
    })
    .then(r => {
        if (!r.ok) throw new Error('서버 오류 (' + r.status + ')');
        return r.json();
    })
    .then(data => {
        usernameMsg.textContent = data.message;
        usernameMsg.className = 'form-text ' + (data.available ? 'text-success' : 'text-danger');
        usernameChecked = data.available;
    })
    .catch(err => {
        usernameMsg.textContent = '확인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
        usernameMsg.className = 'form-text text-danger';
        usernameChecked = false;
        console.error('[중복확인]', err);
    });
});

usernameInput.addEventListener('input', function () {
    usernameChecked = false;
    usernameMsg.textContent = '';
    usernameMsg.className = 'form-text';
});

// ─── 비밀번호 확인 ────────────────────────────────────────
document.getElementById('password_confirm').addEventListener('input', function () {
    const pw = document.getElementById('password').value;
    this.setCustomValidity(this.value && pw !== this.value ? 'mismatch' : '');
});
document.getElementById('password').addEventListener('input', function () {
    const confirm = document.getElementById('password_confirm');
    if (confirm.value) {
        confirm.setCustomValidity(this.value !== confirm.value ? 'mismatch' : '');
    }
});

// ─── 주소 검색 (Daum 우편번호 API) ───────────────────────
document.getElementById('btn_addr_search').addEventListener('click', function () {
    new daum.Postcode({
        oncomplete: function (data) {
            document.getElementById('address_zip').value = data.zonecode;
            document.getElementById('address1').value    = data.roadAddress || data.jibunAddress;
            document.getElementById('address2').focus();
        }
    }).open();
});

// ─── 핸드폰 자동 하이픈 ──────────────────────────────────
document.getElementById('phone').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length <= 3)      this.value = v;
    else if (v.length <= 7) this.value = v.slice(0, 3) + '-' + v.slice(3);
    else                    this.value = v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7, 11);
});

// ─── 폼 제출 최종 검사 ────────────────────────────────────
document.getElementById('register_form').addEventListener('submit', function (e) {
    if (!usernameChecked) {
        e.preventDefault();
        e.stopPropagation();
        alert('아이디 중복 확인을 해 주세요.');
        usernameInput.focus();
        return;
    }
    if (!this.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
    }
    this.classList.add('was-validated');
});
