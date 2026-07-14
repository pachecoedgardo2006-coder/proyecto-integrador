### `authService.js`

Handles all authentication-related API calls using async/await and the
centralized Axios instance from `api.js`. Also manages persisting and
retrieving the session (token and user) in `localStorage`.

| Function | Description | Returns |
|---|---|---|
| `login({ email, password })` | Sends credentials to `/auth/login`, stores the returned token and user in `localStorage`. | `Promise<{ token: string, user: object }>` |
| `register({ name, email, password, role })` | Sends registration data to `/auth/register`, stores the returned token and user in `localStorage`. | `Promise<{ token: string, user: object }>` |
| `logout()` | Removes the stored token and user from `localStorage`, ending the session. | `void` |
| `getCurrentUser()` | Reads and parses the stored user from `localStorage`. Returns `null` if there is no session. | `object \| null` |

**Example:**
```javascript
import { login, logout, getCurrentUser } from './authService';

try {
  const { token, user } = await login({ email, password });
  // redirect to the corresponding dashboard based on user.role
} catch (error) {
  // handle invalid credentials or network error
}

const current = getCurrentUser(); // null if not logged in
logout(); // clears the session
```

**Notes:**
- `login` and `register` both persist the session the same way, so any UI
  code that runs after a successful call can immediately use
  `getCurrentUser()` to access the logged-in user.
- Error handling (invalid credentials, network errors, etc.) is left to
  the caller — these functions do not catch or transform Axios errors.