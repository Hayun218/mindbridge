// 파일럿 신청 · 피드백 폼 접수 (Vercel Serverless Function)
// 접수 내용은 Vercel 대시보드 > 프로젝트 > Logs 에서 "[MindBridge]" 로 검색해 확인할 수 있습니다.
// 환경변수 GOOGLE_SCRIPT_URL 을 설정하면 구글 시트로도 함께 전달합니다 (docs/google-apps-script.gs 참고).
const FIELDS = {
  pilot: ["name", "type", "email", "phone", "age", "message"],
  feedback: ["name", "type", "rating", "best", "good", "improve"],
};

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const body = req.body || {};
  const fields = FIELDS[body.kind];
  if (!fields) return res.status(400).json({ ok: false });

  const entry = { kind: body.kind };
  for (const key of fields) entry[key] = String(body[key] || "").slice(0, 2000);
  console.log("[MindBridge]", JSON.stringify({ submittedAt: new Date().toISOString(), ...entry }));

  if (process.env.GOOGLE_SCRIPT_URL) {
    try {
      await fetch(process.env.GOOGLE_SCRIPT_URL, { method: "POST", body: new URLSearchParams(entry) });
    } catch (err) {
      console.error("[MindBridge] sheet forward failed", err);
    }
  }

  res.status(200).json({ ok: true });
};
