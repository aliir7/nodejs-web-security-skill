# Browser / Web Security Boundaries

## CSRF
CSRF abuses automatic cookie attachment.

Double-submit conceptual flow:
```text
random CSRF token
→ readable CSRF cookie
→ frontend copies value into custom header
→ server compares cookie/header
→ mismatch = 403
```

Protect state-changing operations: POST/PUT/PATCH/DELETE.

GET should not mutate state.

## CORS
CORS is browser policy, not authentication.
It does not stop curl/Postman/direct server-to-server calls.

Use explicit origin allow-list:
```ts
cors({
  origin: allowedOrigins,
  credentials: true,
})
```

Do not use wildcard origin with credentialed cookies.

## HTTP Hardening
Source baseline:
```ts
app.use(helmet());
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
```

## Secrets
Validate required ENV at startup:
```ts
const envSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
});
```

Never put signing secrets, DB passwords, private API keys or encryption keys in browser-exposed variables.
