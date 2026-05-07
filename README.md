# ASG-B2

## Render 설정

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

Node Version:

```text
18 이상 권장
```

필수 환경변수:

```text
GOOGLE_CLIENT_EMAIL
GOOGLE_PRIVATE_KEY
SOOP_USERNAME
SOOP_PASSWORD
SOOP_CRAWLER_ENABLED
```

`GOOGLE_PRIVATE_KEY`는 Render 환경변수에 넣을 때 줄바꿈이 깨질 수 있으므로 `\n` 형태로 넣어도 됩니다. 서버 코드에서 `replace(/\\n/g, '\n')`로 복원합니다.
