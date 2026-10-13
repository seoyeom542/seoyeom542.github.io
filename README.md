# seoyeom542.github.io

한 페이지 포트폴리오. 빌드 도구 없이 정적 파일만 사용합니다.

- 배포 주소: https://seoyeom542.github.io/
- 배포 방식: GitHub Pages (`main` 브랜치 / 루트)

```
├─ index.html            # 메인: 소개 · 경력 · 대표 작업 · 전체 프로젝트 · 연락
├─ projects/             # 대표 작업 케이스 스터디 상세 페이지
│  ├─ consult-inflow.html
│  ├─ legacy-rewrite.html
│  └─ guest-consult.html
├─ collaboration.html    # 협업 안내: 진행 과정 · 작업 형태 · FAQ
├─ style.css             # 공통 스타일 (색상은 :root 변수에서 변경)
├─ script.js             # 공통 스크립트 (메뉴 표시, 필터, 시계, PDF 저장)
└─ assets/               # 이미지, 아이콘
```

TODO 주석이 달린 곳과 화면에 "작성 중"으로 보이는 곳을 실제 내용으로 바꿔 주세요.
`grep -rn "TODO" --include=*.html .`

## 공개 전 체크리스트
- [ ] Pages 주소로 접속이 된다
- [ ] 모바일과 PC에서 레이아웃이 깨지지 않는다
- [ ] 모든 링크와 연락처가 작동한다
- [ ] 오탈자가 없다
- [ ] 이전 로펌과 현재 회사의 고객 정보, 화면, 코드가 들어 있지 않다
- [ ] `grep -rn "TODO" --include=*.html .` 결과가 비어 있다
