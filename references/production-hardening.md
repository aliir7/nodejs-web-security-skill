# Production Hardening

## Authentication
- short-lived access
- separately protected refresh
- verified tokens
- hashed passwords
- generic auth errors

## Cookies
- HttpOnly
- Secure in production
- appropriate SameSite
- correct Path
- correct Max-Age

## CSRF
- state-changing requests protected
- token validated
- GET non-mutating

## CORS
- explicit allow-list
- credentials only when needed
- no wildcard with credentials

## Authorization
- server-side
- RBAC/policies
- ownership at data layer

## Injection
- parameterized SQL
- safe ORM APIs
- explicit Mongo filters

## Abuse
- rate limiting
- failed-login controls
- account lock where appropriate
- body-size limits

## HTTP
- security headers
- reduce fingerprinting where applicable
- CSP/security headers considered

## Secrets
- no weak defaults
- startup validation
- no browser exposure
- `.env` ignored

## Database
- migrations in production
- no accidental schema synchronization
- sensitive fields excluded from responses

## Next.js
- middleware is not final authz
- Server Actions self-authorize
- database operation enforces ownership

## Frontend
- credentials configured
- CSRF header
- bounded refresh retry
- concurrent refresh coordination
