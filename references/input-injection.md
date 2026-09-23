# Input & Injection Reference

## Validation
Source architecture uses:
- Zod
- NestJS DTOs
- class-validator

Validate:
- type
- length
- format
- allowed values
- structure

## Mass Assignment
Never:
```ts
User.create(req.body)
```

Use explicit schemas/DTOs.

Source patterns:
- Mongoose `strict: true`
- NestJS `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`

## SQL Injection
Never:
```ts
where(`email = '${email}'`)
```

Prefer:
```ts
where("email = :email", { email })
```

Parameterization is the primary defense.

## NoSQL Injection
Never:
```ts
User.findOne(req.body)
```

Prefer:
```ts
User.findOne({ email: validatedEmail })
```

Source defense-in-depth:
```ts
mongoose.set("strictQuery", true)
```
and:
```ts
.setOptions({ sanitizeFilter: true })
```
