/**
 * _common.js — 공통 UI 컴포넌트 스펙 규칙
 * storyboard-agent가 배치당 1회만 참조.
 */
window.COMMON_SPECS = window.COMMON_SPECS || {};

window.COMMON_SPECS["목록테이블"] = {
  columns: "순번·제목·작성자·작성일·조회수 기본. 프로젝트별 override.",
  sorting: "컬럼 헤더 클릭 ASC↔DESC.",
  emptyState: "'등록된 항목이 없습니다.' 중앙 표시.",
  hover: "행 hover 배경색 변경."
};
window.COMMON_SPECS["페이지네이션"] = {
  display: "이전·다음 + 숫자 블록(10개). 첫/마지막 비활성.",
  perPage: "기본 10건. 셀렉트 10/20/50.",
  totalCount: "좌측 '전체 N건' 표시."
};
window.COMMON_SPECS["검색필터"] = {
  layout: "목록 상단 가로 배치.",
  keyword: "키워드 + 검색 버튼. Enter 지원.",
  dateRange: "시작~종료 달력. 종료<시작 시 alert.",
  reset: "초기화 → 전체 초기화 후 1페이지.",
  selectBox: "'전체' 기본 선택."
};
window.COMMON_SPECS["모달"] = {
  overlay: "딤 rgba(0,0,0,0.5). 배경 클릭 닫기.",
  close: "X 버튼 + ESC.",
  confirm: "확인/취소. 확인 시 콜백."
};
window.COMMON_SPECS["폼유효성"] = {
  required: "필수 미입력 시 빨간 안내문구.",
  maxlength: "초과 시 입력 차단 + 안내.",
  submit: "전체 유효성 → 첫 오류 포커스."
};
window.COMMON_SPECS["Alert"] = {
  deleteConfirm: "confirm('정말 삭제하시겠습니까?').",
  success: "'저장되었습니다.' alert → 목록 이동.",
  error: "'처리 중 오류가 발생했습니다.' alert."
};
window.COMMON_SPECS["엑셀다운로드"] = {
  trigger: "'엑셀 다운로드' 버튼.",
  scope: "현재 검색 조건 전체.",
  format: ".xlsx, {메뉴명}_{YYYYMMDD}.xlsx"
};
window.COMMON_SPECS["권한제어"] = {
  unauthorized: "'접근 권한이 없습니다.' 또는 메뉴 비노출.",
  roleBasedUI: "권한별 버튼 노출/비노출."
};
