# Security Invariants

## A — Authentication
A protected operation requires a valid authenticated identity.

## B — Authorization
The identity must have permission for the operation.

## C — Ownership
The identity can access only resources allowed by ownership/policy.

Preferred:
```ts
findOne({ id: resourceId, ownerId: authenticatedUserId })
```

Avoid:
```ts
const resource = await findById(resourceId);
if (resource.ownerId !== authenticatedUserId) deny();
```

## D — Input
Untrusted input is validated before use.

## E — Query Safety
User input never becomes executable query syntax.

## F — Cookie Safety
Authentication cookies use appropriate flags.

## G — CSRF
Cookie-authenticated state changes have appropriate CSRF protection.

## H — Rate Control
Authentication and sensitive endpoints have abuse controls.

## I — Secrets
Secrets are validated server-side and never exposed to browser bundles.

## J — Response Safety
Passwords, tokens and other sensitive fields are not accidentally returned.

## Translation Rule
Changing framework, ORM or database must not change these invariants.
