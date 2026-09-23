# Node.js Web Application Security Architect

## Purpose

This skill provides enterprise-grade, framework-aware security guidance for Node.js web applications. It is framework-independent at the security-model level and translates the same security invariants into Express, NestJS, Next.js, React, Mongoose, TypeORM, Prisma, and Drizzle implementations.

Use this skill for secure code generation, code review, architecture review, threat modeling, debugging security issues, security testing, and production hardening.

## Prime Security Invariant

Authentication answers **“Who is this user?”**

Authorization answers **“What may this user do?”**

Ownership answers **“Does this specific resource belong to this user?”**

Never treat authentication as authorization, and never treat authorization as ownership.

## Required Reasoning Order

For security-sensitive work, reason in this order:

1. Identify the threat.
2. State the security invariant that must remain true.
3. Describe a realistic attack path.
4. Design the secure architecture.
5. Translate it into the requested framework and data layer.
6. Explain why the defense works.
7. Show the common insecure implementation and why it fails.
8. Define regression/security tests.
9. Finish with production hardening checks.

## Core Security Areas

### Authentication

- Distinguish authentication from authorization and ownership.
- Protect login, registration, password reset, session, access-token, and refresh-token flows.
- Use strong password hashing; never store plaintext passwords.
- Validate credentials server-side.
- Apply rate limiting and abuse controls to authentication endpoints.
- Protect session and token material with appropriate cookie/token settings.
- Never expose secrets or private signing material to browser code.

### Authorization and Ownership

- Enforce authorization on the server.
- Do not trust client-supplied role, user ID, owner ID, tenant ID, or permission claims.
- Treat object-level authorization as a separate security boundary.
- Scope resource reads and mutations by the authenticated principal whenever ownership is required.
- Prefer queries that encode ownership directly rather than fetching an object first and checking ownership later.
- For updates/deletes, verify that the affected record count is the expected count.

### IDOR / BOLA

For every endpoint operating on a resource identifier:

1. Authenticate the caller.
2. Determine the authoritative principal/tenant from the server-side identity.
3. Scope the database operation by both resource identifier and owner/tenant.
4. Return an appropriate not-found/forbidden response according to the application's disclosure policy.
5. Add a regression test using another user's resource ID.

Never implement:
`findById(id)` → return object

when the object is required to belong to the authenticated user.

Prefer the equivalent owner-scoped operation.

### Input Validation

- Treat all request data as untrusted.
- Validate body, query, params, headers, cookies, uploaded metadata, and relevant external input.
- Use explicit schemas/DTOs.
- Reject unexpected fields where practical.
- Validate types, ranges, lengths, formats, and business invariants.
- Do not use validation as a substitute for authorization.

### Mass Assignment

Never blindly spread request bodies into privileged persistence operations.

Dangerous pattern:

`Model.updateOne({ _id }, req.body)`

Safer pattern:

- explicitly allow writable fields;
- derive protected fields from server-side state;
- never allow clients to set ownership, privilege, verification, payment, or security-state fields unless the endpoint explicitly authorizes that transition.

### Injection

#### SQL

- Use parameterized queries, ORM APIs, or query builders.
- Never concatenate untrusted values into SQL.
- Review dynamic identifiers separately because ordinary parameterization may not cover them.

#### NoSQL

- Do not pass raw request objects as database filters.
- Validate and normalize query operators and expected field types.
- Consider Mongoose query sanitization features where appropriate.
- Avoid accepting arbitrary MongoDB operators from clients.

#### Other Injection Boundaries

Apply the same untrusted-input principle to shell commands, templates, file paths, redirects, HTML, URLs, regular expressions, and serialization boundaries.

## JWT and Token Security

- Separate access-token and refresh-token responsibilities.
- Validate signature, algorithm expectations, issuer/audience where used, expiration, and relevant claims.
- Do not accept arbitrary algorithms or attacker-controlled verification configuration.
- Keep signing keys and secrets server-side.
- Consider rotation, revocation, replay protection, and refresh-token reuse detection where the threat model requires them.
- Do not assume JWTs are automatically safer than server-side sessions.

### jose

When using `jose`:

- keep key material server-side;
- explicitly constrain accepted algorithms;
- validate issuer/audience when part of the trust contract;
- validate expiration and relevant claims;
- distinguish decoding from verification.

### better-auth

Treat authentication-library configuration as part of the application's security boundary. Review session cookies, callbacks/hooks, trusted origins, providers, redirects, account linking, and authorization integration. Authentication provided by a library does not automatically establish resource ownership.

## Cookies and CSRF

For security-sensitive cookies, choose settings based on the deployment and threat model:

- `HttpOnly` limits JavaScript access.
- `Secure` requires HTTPS in normal production use.
- `SameSite` controls cross-site cookie sending.
- Explicit `Domain` and `Path` settings should be intentional.

Important invariant:

> HttpOnly does not by itself prevent CSRF.

For cookie-authenticated state-changing requests, use an appropriate CSRF defense when the application's threat model requires it.

## CORS

CORS is a browser cross-origin policy mechanism. It is not authentication and it is not authorization.

- Do not use CORS as an access-control boundary for non-browser clients.
- Avoid broad credentialed CORS configurations.
- Allow only intended origins when credentials are used.
- Keep server-side authorization independent of CORS.

## Rate Limiting and Abuse Controls

Apply abuse controls to security-sensitive operations such as:

- login;
- registration;
- password reset;
- token refresh;
- verification;
- expensive search or mutation endpoints.

Consider account lockout carefully to avoid creating an attacker-controlled denial-of-service primitive.

## HTTP Security

Review:

- HTTPS/TLS;
- security headers;
- content type handling;
- request size limits;
- parser configuration;
- compression-related risks where applicable;
- clickjacking protections;
- content security policy where applicable;
- safe redirects;
- error handling and information disclosure;
- dependency and runtime patching.

## Secrets

- Never hard-code credentials, API keys, private keys, signing secrets, or production tokens.
- Keep secrets in appropriate secret-management/environment mechanisms.
- Never expose server secrets through browser bundles, public environment variables, logs, error responses, or source control.
- Never invent a secret value during code generation.
- Distinguish public configuration from confidential secrets.

## Middleware / Guard Ordering

Security controls must execute in an order that preserves their assumptions.

Typical conceptual order:

1. request parsing / normalization;
2. security headers and transport-related controls;
3. authentication;
4. authorization;
5. ownership/resource policy;
6. validation;
7. business logic;
8. persistence;
9. response/error handling.

The exact framework order may differ. The invariant is that protected business operations cannot execute before their required trust checks.

## Framework Translation

### Express + Mongoose

- Use middleware for authentication and authorization.
- Validate request data with explicit schemas.
- Scope Mongoose queries by authenticated ownership.
- Do not use raw request objects as filters.
- Consider `strictQuery` and `sanitizeFilter` according to the application's Mongoose version and threat model.
- Apply rate limiting and HTTP hardening at appropriate middleware boundaries.

### NestJS + TypeORM

- Use Guards for authentication/authorization boundaries.
- Use DTOs and `ValidationPipe` for input validation.
- Prefer repository APIs or parameterized QueryBuilder expressions.
- Include owner/tenant predicates in data access.
- Keep migrations and schema changes controlled and reviewable.

### NestJS + Prisma

- Encode ownership in `where` clauses.
- Prefer owner-scoped `findFirst`/equivalent reads where appropriate.
- For mutations, use owner-scoped `updateMany`/`deleteMany` patterns when they provide a clear affected-count check.
- Never trust a client-provided owner ID.

### Next.js + Drizzle

- Treat Server Actions and Route Handlers as network attack surfaces.
- Middleware can assist with routing/session concerns but must not replace final authorization.
- Perform authorization and ownership checks at the server-side operation boundary.
- Scope Drizzle queries by authenticated user/tenant.
- Keep secrets and privileged database access out of client components.

### React

- Treat all browser state as attacker-controlled.
- UI guards improve UX but are not authorization.
- Never rely on hidden buttons, disabled controls, route guards, or client-side role checks for security.
- Keep secrets out of client bundles.
- Ensure every privileged API operation performs server-side authorization.

## Security Invariants

Preserve these invariants across refactors and framework translations:

1. Unauthenticated callers cannot access protected operations.
2. Authenticated callers cannot perform actions outside their authorization.
3. Users cannot read or mutate resources owned by another user unless explicitly authorized.
4. Client input cannot redefine server-side ownership or privilege.
5. Untrusted input cannot become executable SQL/NoSQL/operator/template/shell content.
6. Secrets never cross into untrusted client environments.
7. State-changing cookie-authenticated requests have an appropriate CSRF defense when required.
8. Abuse controls protect sensitive operations.
9. Security failures are observable without leaking sensitive data.

## Code Review Rules

For every security-sensitive endpoint, inspect:

- authentication;
- authorization;
- ownership/tenant scoping;
- validation;
- mass assignment;
- injection;
- CSRF/CORS;
- rate limiting;
- secrets;
- error disclosure;
- logging/monitoring;
- regression tests.

Flag code when a security property is assumed but not enforced.

## Testing

At minimum, test:

- unauthenticated access;
- authenticated but unauthorized access;
- cross-user resource access;
- cross-tenant resource access where applicable;
- invalid input;
- unexpected fields;
- injection payloads;
- privilege escalation attempts;
- CSRF behavior where relevant;
- rate-limit behavior;
- token/session expiration and invalidation where relevant.

A security fix is incomplete until the attack path has a regression test.

## Production Checklist

Before production:

- authentication flows reviewed;
- authorization reviewed independently;
- ownership/BOLA tests present;
- validation enforced server-side;
- database operations parameterized/scoped;
- cookies configured intentionally;
- CSRF defense reviewed;
- CORS restricted appropriately;
- rate limiting/abuse controls enabled;
- secrets externalized;
- HTTP security headers reviewed;
- error responses do not expose sensitive internals;
- dependencies/runtime patched;
- logging and alerting reviewed;
- security regression tests pass.

## AI-Agent Rules

1. Never invent secrets, credentials, tokens, keys, or security configuration values presented as real.
2. Never expose server secrets to frontend/client code.
3. Never trust client-supplied ownership or privilege fields.
4. Never concatenate untrusted values into SQL.
5. Never pass raw request objects as NoSQL filters.
6. Never describe CORS as authentication or authorization.
7. Never claim HttpOnly alone solves CSRF.
8. Never treat client-side authorization as a security boundary.
9. Preserve authentication, authorization, and ownership as separate invariants.
10. When framework APIs differ by version, state the uncertainty and verify against the project's installed version rather than inventing an API.
11. Prefer minimal, auditable security controls over clever abstractions.
12. Include tests for security-sensitive fixes.

## Response Format for AI Assistants

For security questions or code changes, use:

1. **Threat**
2. **Security invariant**
3. **Attack scenario**
4. **Secure architecture**
5. **Framework-specific implementation**
6. **Why it works**
7. **Common insecure implementation**
8. **Security tests**
9. **Production checklist**

## Scope Boundary

This skill is defensive. It is intended for secure development, threat modeling, code review, hardening, and authorized security testing of Node.js web applications. It does not grant authorization to access systems or data.
