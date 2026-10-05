# MindBridge 랜딩페이지

부모와 자녀의 감정을 연결하는 관계 회복형 정서소통 콘텐츠 키트 **MindBridge** 소개·파일럿 신청·피드백 수집용 랜딩페이지입니다.
2026 경북콘텐츠코리아랩 「콘텐츠 융합팩토리」 지원사업 결과물입니다.

빌드 과정 없는 정적 사이트(HTML/CSS/JS)입니다.

```
index.html        페이지 본문
styles.css        스타일
main.js           감정카드 갤러리 · 폼 처리
config.js         폼 접수 설정
api/submit.js     폼 접수 Vercel 함수
assets/           로고 · 카드 · 시제품 이미지
docs/google-apps-script.gs   폼 → 구글 시트 저장용 스크립트
```

## 로컬 미리보기

```bash
python3 -m http.server 4173
```

http://localhost:4173 접속

## Vercel 배포

1. 이 저장소를 GitHub에 push
2. [vercel.com/new](https://vercel.com/new) → 저장소 Import
3. Framework Preset: **Other**, Build Command / Output Directory 비워둔 채 Deploy

## 폼 접수 (파일럿 신청 · 피드백)

폼은 Vercel 함수 `api/submit.js` 로 전송되며, 별도 설정 없이 배포만 하면 동작합니다.
접수 내용은 Vercel 대시보드 → 프로젝트 → **Logs** 에서 `[MindBridge]` 로 검색해 확인합니다.

> Vercel 로그는 보관 기간이 짧으므로(Hobby 플랜 기준 약 1시간), 실제 신청을 받아 보관해야 할 때는
> `docs/google-apps-script.gs` 로 구글 시트 웹 앱을 만들고 Vercel 환경변수 `GOOGLE_SCRIPT_URL` 에 URL을 넣어 주세요.
> 사이트 코드는 수정할 필요 없습니다.

로컬(`python3 -m http.server`)에서는 함수가 실행되지 않으므로 폼 제출 시 오류 안내가 표시됩니다. `vercel dev` 로 실행하면 로컬에서도 확인할 수 있습니다.
