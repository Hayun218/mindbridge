// MindBridge 랜딩페이지 폼 → 구글 시트 저장용 Apps Script
// 1) 구글 시트 생성 → 확장 프로그램 > Apps Script → 이 코드 전체 붙여넣기 → 저장
// 2) 배포 > 새 배포 > 유형 선택(톱니바퀴): 웹 앱
//    - 다음 사용자 인증 정보로 실행: 나
//    - 액세스 권한이 있는 사용자: 모든 사용자
// 3) 배포 → 권한 승인 → 발급된 웹 앱 URL(https://script.google.com/macros/s/.../exec)을
//    config.js 의 endpoint 에 입력
// ※ 코드를 수정한 경우 배포 관리 > 편집 > 새 버전으로 다시 배포해야 반영됩니다.

const SHEETS = {
  pilot: {
    name: "파일럿신청",
    fields: [["submittedAt", "제출일시"], ["name", "이름/기관명"], ["type", "참여 구분"], ["email", "이메일"], ["phone", "연락처"], ["age", "연령대"], ["message", "신청 동기"]],
  },
  feedback: {
    name: "피드백",
    fields: [["submittedAt", "제출일시"], ["name", "이름"], ["type", "사용 대상"], ["rating", "만족도"], ["best", "좋았던 구성품"], ["good", "좋았던 점"], ["improve", "개선할 점"]],
  },
};

function doPost(e) {
  const p = e.parameter;
  const conf = SHEETS[p.kind];
  if (!conf) return ContentService.createTextOutput("unknown kind");

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(conf.name) || ss.insertSheet(conf.name);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(conf.fields.map(([, label]) => label));
      sheet.setFrozenRows(1);
    }
    p.submittedAt = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
    sheet.appendRow(conf.fields.map(([key]) => p[key] || ""));
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput("ok");
}
