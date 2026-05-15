/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BN System PM Workspace — 데이터 파일
   index.html 은 건드리지 않고 이 파일만 편집합니다.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── 담당자 ──────────────────────────────────────────────
   id:    영문, 공백 없이 (프로젝트 manager 필드와 일치시킬 것)
   name:  표시 이름
   role:  직책
   color: 카드 포인트 색상 (hex)
─────────────────────────────────────────────────────── */
const MANAGERS = [
  {
    id:    'JuHan',
    name:  '신주한',
    role:  'PM팀장',
    color: '#4f7fff',
  },
  {
    id:    'EunAh',
    name:  '배은아',
    role:  'PM',
    color: '#e24f14',
  },
  /* 담당자 추가 예시
  {
    id:    'GilDong',
    name:  '홍길동',
    role:  'PM',
    color: '#2ecc8a',
  },
  */
];

/* ── 프로젝트 ─────────────────────────────────────────────
   manager:    MANAGERS[].id 와 일치시킬 것
   status:     'planning' | 'design' | 'dev' | 'complete' | 'hold'
               복수 상태: ['planning', 'design']
   type:       '리뉴얼' | '신규개발' | '고도화' | '신규'
   updated:    'YYYY-MM-DD'
   prototypes: [{ name: '화면명', path: 'projects/폴더/파일.html' }]
   docs:       [{ name: '문서명', url: 'https://...' }]   ← 없으면 생략
   devUrl:     개발서버 URL                               ← 없으면 생략
   liveUrl:    운영서버 URL                               ← 없으면 생략
─────────────────────────────────────────────────────── */
const PROJECTS = [
  /* 프로젝트 추가 예시
  {
    manager:    'EunAh',
    id:         'project_id',
    client:     '고객사명',
    title:      '프로젝트명',
    type:       '신규개발',
    status:     ['planning'],
    updated:    '2026-04-23',
    prototypes: [
      { name: '사용자', path: 'projects/project_id/outputs/index.html' },
    ],
    docs: [
      { name: '기획서', url: 'https://...' },
    ],
  },
  */
 {
    manager:    'EunAh',
    id:         '-',
    client:     '-',
    title:      '멘사코리아_NEW전자투표시스템',
    type:       '링크연결',
    status:     ['planning'],
    updated:    '2026-05-15',
    prototypes: [],
    docs: [
      { name: '링크', url: 'https://bn-sys.github.io/bn-project-hub/workspace/EunAh/mensa_e_vote/new_vote/기획서_전자투표시스템_v1.4.html' },
    ],
  },
  {
    manager:    'EunAh',
    id:         '-',
    client:     '-',
    title:      '기존 프로젝트 경로',
    type:       '링크연결',
    status:     ['complete'],
    updated:    '2026-04-23',
    prototypes: [],
    docs: [
      { name: '링크', url: 'https://bn-sys.github.io/pm-workspace/?token=bn2026' },
    ],
  },
];
