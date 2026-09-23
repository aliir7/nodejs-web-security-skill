# Threat Model

## Assets
- user accounts
- access tokens
- refresh tokens
- sessions/cookies
- private notes/resources
- database records
- signing secrets
- database credentials

## Trust Boundaries
1. Browser ↔ web application
2. Browser ↔ API
3. API ↔ database
4. Frontend bundle ↔ server-only configuration
5. Server Action/API endpoint ↔ untrusted caller

## Threats
- stolen access token
- stolen refresh token
- XSS
- CSRF
- IDOR/BOLA
- SQL injection
- NoSQL injection
- mass assignment
- brute force
- credential stuffing
- account enumeration
- oversized request bodies
- malicious origins
- leaked ENV
- unsafe raw SQL/ORM queries
- insecure cookies
- insecure CORS
- missing authorization on secondary endpoints
- client-side-only authorization
- middleware-only authorization
- secrets bundled into frontend
- unsafe production configuration

## Attacker Assumption
The attacker can bypass the intended UI and call server endpoints directly.

## Review Question
For every endpoint:
> If the attacker never uses our frontend, can they still violate an invariant?
