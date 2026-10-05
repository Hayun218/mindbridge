// 감정카드 30종 (결과보고서 순서 · 색상 그룹 기준)
const EMOTIONS = [
  ["보람찬", "joy"], ["활기찬", "joy"], ["자랑스러운", "joy"], ["신나는", "joy"], ["설레는", "joy"],
  ["느긋한", "calm"], ["만족스러운", "calm"], ["평온한", "calm"], ["다정한", "calm"], ["든든한", "calm"], ["홀가분한", "calm"], ["감사한", "calm"],
  ["서운한", "sad"], ["속상한", "sad"], ["무기력한", "sad"], ["후회되는", "sad"], ["외로운", "sad"], ["시무룩한", "sad"],
  ["답답한", "angry"], ["귀찮은", "angry"], ["분한", "angry"], ["억울한", "angry"], ["짜증나는", "angry"], ["얄미운", "angry"],
  ["불안한", "anxious"], ["부담스러운", "anxious"], ["헷갈리는", "anxious"], ["당황스러운", "anxious"], ["긴장되는", "anxious"], ["민망한", "anxious"],
];

const GROUPS = { joy: "신나는 마음", calm: "편안한 마음", sad: "울적한 마음", angry: "화나는 마음", anxious: "불안한 마음" };
// 그룹별 대표 카드 1장씩만 공개 (EMOTIONS 인덱스)
const PREVIEW = [3, 7, 12, 22, 24];

const grid = document.getElementById("emotion-grid");
PREVIEW.forEach((i) => {
  const [name, group] = EMOTIONS[i];
  const count = EMOTIONS.filter(([, g]) => g === group).length;
  const item = document.createElement("figure");
  item.innerHTML = `<button type="button" aria-label="감정카드 '${name}' 크게 보기"><img src="/assets/cards/emotion-${String(i + 1).padStart(2, "0")}.jpg" alt="감정카드 '${name}'" loading="lazy" /></button><figcaption class="g-${group}">${GROUPS[group]} · ${count}장</figcaption>`;
  grid.appendChild(item);
});
const more = document.createElement("div");
more.className = "card-more";
more.innerHTML = `<div class="stack"><span></span><span></span><span></span><strong>+${EMOTIONS.length - PREVIEW.length}</strong></div><p>나머지 감정은<br />키트에서 만나요</p>`;
grid.appendChild(more);

document.getElementById("emotion-words").innerHTML = Object.entries(GROUPS)
  .map(([g, label]) => `<div class="g-${g}"><b>${label}</b><span>${EMOTIONS.filter(([, x]) => x === g).map(([n]) => n).join(" · ")}</span></div>`)
  .join("");

// Lightbox
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
grid.addEventListener("click", (e) => {
  const img = e.target.closest("button")?.querySelector("img");
  if (!img) return;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lightbox.hidden = false;
});
lightbox.addEventListener("click", () => (lightbox.hidden = true));
document.addEventListener("keydown", (e) => e.key === "Escape" && (lightbox.hidden = true));

// Forms
const LABELS = {
  pilot: { title: "파일럿 참여 신청", name: "이름/기관명", type: "참여 구분", email: "이메일", phone: "연락처", age: "연령대", message: "신청 동기" },
  feedback: { title: "사용 후기", name: "이름", type: "사용 대상", rating: "만족도", best: "좋았던 구성품", good: "좋았던 점", improve: "개선할 점" },
};

document.querySelectorAll("form[data-kind]").forEach((form) => {
  const msg = form.querySelector(".form-msg");
  const submit = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "form-msg";
    msg.textContent = "";

    let valid = true;
    form.querySelectorAll("[required]").forEach((el) => {
      const ok = el.type === "radio" ? !!form.querySelector(`[name="${el.name}"]:checked`) : el.type === "checkbox" ? el.checked : el.checkValidity() && el.value.trim() !== "";
      el.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      msg.className = "form-msg err";
      msg.textContent = "필수 항목(*)을 확인해 주세요.";
      return;
    }

    const kind = form.dataset.kind;
    const data = Object.fromEntries(new FormData(form));
    delete data.agree;
    const { endpoint, contactEmail } = window.MB_CONFIG || {};

    if (endpoint) {
      submit.disabled = true;
      try {
        const body = new URLSearchParams({ kind, ...data });
        // 외부 주소(Google Apps Script 등)는 CORS 응답을 주지 않으므로 no-cors로 전송
        const sameOrigin = new URL(endpoint, location.href).origin === location.origin;
        const res = await fetch(endpoint, { method: "POST", mode: sameOrigin ? "same-origin" : "no-cors", body });
        if (sameOrigin && !res.ok) throw new Error(res.status);
        form.reset();
        msg.className = "form-msg ok";
        msg.textContent = kind === "pilot" ? "신청이 접수되었습니다. 감사합니다!" : "소중한 의견 감사합니다!";
      } catch {
        msg.className = "form-msg err";
        msg.textContent = "전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      } finally {
        submit.disabled = false;
      }
      return;
    }

    if (contactEmail) {
      const labels = LABELS[kind];
      const lines = Object.entries(data).map(([k, v]) => `${labels[k] || k}: ${v}`);
      const href = `mailto:${contactEmail}?subject=${encodeURIComponent(`[MindBridge] ${labels.title}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
      window.location.href = href;
      msg.className = "form-msg ok";
      msg.textContent = "메일 작성 창이 열리면 전송 버튼을 눌러 주세요.";
      return;
    }

    msg.className = "form-msg err";
    msg.textContent = "온라인 접수 창구를 준비 중입니다.";
  });

  form.addEventListener("input", (e) => e.target.classList.remove("invalid"));
  form.addEventListener("change", (e) => {
    if (e.target.type === "radio") form.querySelectorAll(`[name="${e.target.name}"]`).forEach((r) => r.classList.remove("invalid"));
  });
});
