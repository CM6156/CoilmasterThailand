# GitHub 저장소 설정 방법

## 1. GitHub에서 새 저장소 생성하기

1. GitHub 계정으로 로그인합니다.
2. 오른쪽 상단의 "+" 아이콘을 클릭한 후 "New repository"를 선택합니다.
3. 저장소 이름을 "thailand-transfer-system"으로 입력합니다.
4. 설명(선택사항)을 입력합니다: "태국 이관 제품 관리 시스템"
5. 저장소를 Public 또는 Private으로 설정합니다.
6. "README 파일 추가" 옵션은 체크하지 않습니다.
7. "Create repository" 버튼을 클릭합니다.

## 2. 로컬 Git 저장소를 GitHub에 연결하기

GitHub 저장소를 생성한 후, 다음 명령어를 사용하여 로컬 저장소를 GitHub에 연결합니다:

```bash
# GitHub 저장소 URL을 원격 저장소로 추가 (YOUR_USERNAME을 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/thailand-transfer-system.git

# 로컬 저장소의 내용을 GitHub에 푸시
git push -u origin master
```

## 3. GitHub 인증

GitHub에 푸시할 때 인증이 필요합니다. 다음 방법 중 하나를 사용하세요:

### 방법 1: 사용자명과 비밀번호로 인증
```bash
# GitHub 계정의 사용자명과 비밀번호를 입력하라는 메시지가 표시됩니다.
git push -u origin master
```

### 방법 2: 개인 액세스 토큰(PAT)으로 인증
GitHub에서는 비밀번호 대신 개인 액세스 토큰을 사용하는 것을 권장합니다:

1. GitHub 계정 설정에서 "Developer settings" > "Personal access tokens" > "Tokens (classic)"으로 이동합니다.
2. "Generate new token"을 클릭하고 필요한 권한(repo, workflow 등)을 선택합니다.
3. 토큰을 생성하고 안전한 곳에 저장합니다.
4. 푸시할 때 비밀번호 대신 이 토큰을 사용합니다.

### 방법 3: SSH 키로 인증
```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSH 키를 GitHub 계정에 추가한 후 SSH URL로 원격 저장소를 설정
git remote set-url origin git@github.com:YOUR_USERNAME/thailand-transfer-system.git
git push -u origin master
```

## 4. 성공적으로 푸시 완료 후

GitHub 저장소 페이지를 새로고침하면 프로젝트 파일이 모두 표시됩니다. 이제 다른 사람들과 프로젝트를 공유하거나 협업할 수 있습니다. 