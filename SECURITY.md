# Security & Hardening Log

This file tracks security reviews and hardening measures applied to the SIARSIP repository.

## Applied Measures

### 1. Security Headers Middleware (`App\Http\Middleware\SecurityHeaders`)
- **Threat Mitigated:** Cross-Site Scripting (XSS), Clickjacking, MIME-type sniffing.
- **Action:** Added strict HTTP security headers including `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Strict-Transport-Security`, and a `Content-Security-Policy` tailored for Laravel + Vite.

### 2. Strict Input Validation at Boundaries (`ArchiveFileController`)
- **Threat Mitigated:** Path traversal, logic bypassing, unhandled exceptions on invalid input.
- **Action:** Added strict `in_array` validation for the `$type` parameter (only allowing 'masuk' or 'keluar'). Previously, any string other than 'masuk' would default to 'keluar', which is an insecure design pattern. Now it safely aborts with a 404.

### 3. Rate Limiting Verification
- **Status:** Verified that Laravel Breeze's `LoginRequest` correctly enforces a rate limit (maximum 5 attempts) to prevent brute-force attacks on the authentication endpoint.
