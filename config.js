// 폼 접수 설정
// - endpoint: 폼 제출 주소. 기본값은 Vercel 함수(api/submit.js)입니다.
// - contactEmail: endpoint가 비어 있을 때, 작성 내용을 이 주소로 보내는 메일 작성 창을 엽니다.
window.MB_CONFIG = {
  endpoint: "/api/submit",
  contactEmail: "",
};
