# Secure Authentication Lab - Security Note

## Overview

This project is a small local authentication service demonstrating
defensive authentication controls.

## Security Controls Implemented

### 1. Password Hashing

Passwords are never stored as plain text.

The application uses bcrypt to hash passwords before storing them.

Example verification:

- Original password: `MyPassword123`
- Password hash: bcrypt hash
- Password verification: `true`

### 2. Server-Side Validation

The server validates authentication input.

Invalid email formats are rejected by server-side validation.

### 3. Generic Authentication Errors

Failed login attempts return:

`Invalid email or password`

The application does not reveal whether an email address exists.

This helps reduce account enumeration.

### 4. Secure Session Cookie

Sessions use `express-session`.

The session cookie is configured with:

- `httpOnly: true`
- `sameSite: "lax"`
- `secure: false` for local HTTP development
- 15-minute session lifetime

For HTTPS production deployment, `secure` should be changed to `true`.

### 5. Logout

The logout endpoint destroys the server-side session and clears
the session cookie.

### 6. Rate Limiting

The login endpoint uses `express-rate-limit`.

Configuration:

- 15-minute window
- Maximum 5 login requests per window

After the limit is exceeded, the server returns:

`Too many login attempts. Please try again later.`

### 7. Automated Tests

Jest and Supertest are used to test the authentication service.

Current test results:

- Registration: PASS
- Successful login: PASS
- Incorrect password/generic error: PASS
- Invalid email validation: PASS
- Logout: PASS

Result:

`5 tests passed`

## Testing Evidence

Manual testing also demonstrated:

- bcrypt password verification
- successful registration
- successful login
- generic authentication errors
- rate limiting
- logout/session destruction

## Local Development Note

This project is intended as a small defensive authentication lab.

The current user storage is in memory, so registered users disappear
when the server restarts.

A production system should use a persistent database, a strong secret
stored in an environment variable, HTTPS, and an appropriate
production session store.