<div align="center">

# React OAuth

**Modern OAuth2 authentication libraries for React** 🚀

[![npm version](https://img.shields.io/npm/v/@react-oauth/google.svg)](https://www.npmjs.com/package/@react-oauth/google)
[![npm version](https://img.shields.io/npm/v/@react-oauth/github.svg)](https://www.npmjs.com/package/@react-oauth/github)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Demo](https://react-oauth.vercel.app/) • [Documentation](#documentation) • [GitHub](https://github.com/MomenSherif/react-oauth)

</div>

---

## Overview

**React OAuth** is a collection of production-ready OAuth2 libraries for React applications. Each package is designed to be simple, type-safe, and easy to integrate into your projects.

### Packages

| Package                                                             | Description                                              | NPM                                                                                                               |
| ------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **[@react-oauth/google](./packages/@react-oauth/google/README.md)** | Google OAuth2 using the new Google Identity Services SDK | [![npm](https://img.shields.io/npm/v/@react-oauth/google.svg)](https://www.npmjs.com/package/@react-oauth/google) |
| **[@react-oauth/github](./packages/@react-oauth/github/README.md)** | Modern React hook for GitHub OAuth authentication        | [![npm](https://img.shields.io/npm/v/@react-oauth/github.svg)](https://www.npmjs.com/package/@react-oauth/github) |

---

## Quick Start

### Google OAuth

```bash
npm install @react-oauth/google
# or
yarn add @react-oauth/google
```

**Basic Usage:**

```jsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="<your_client_id>">
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
}
```

**Features:**

- ✅ Sign In With Google button
- ✅ One-tap sign-up
- ✅ Automatic sign-in
- ✅ Custom login buttons
- ✅ Implicit & Authorization Code flows
- ✅ Full TypeScript support

### 📖 [View Full Google Documentation →](./packages/@react-oauth/google/README.md)

---

### GitHub OAuth

```bash
npm install @react-oauth/github
# or
yarn add @react-oauth/github
```

**Basic Usage:**

```jsx
import { useGitHubLogin } from '@react-oauth/github';

function LoginButton() {
  const { initiateGitHubLogin, isLoading } = useGitHubLogin({
    clientId: 'your-github-client-id',
    redirectUri: 'http://localhost:3000/callback',
    onSuccess: response => {
      console.log('Authorization code:', response.code);
      // Exchange code for access token on your backend
    },
    onError: error => {
      console.error('Authentication failed:', error);
    },
  });

  return (
    <button onClick={initiateGitHubLogin} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Sign in with GitHub'}
    </button>
  );
}
```

**Features:**

- ✅ Production-ready React hook
- ✅ Fully typed with TypeScript
- ✅ Zero runtime dependencies
- ✅ Flexible API with complete UI control
- ✅ Comprehensive error handling
- ✅ Built-in CSRF protection

### 📖 [View Full GitHub Documentation →](./packages/@react-oauth/github/README.md)

---

## Documentation

### Google OAuth

- **[Complete API Reference 🚀](./packages/@react-oauth/google/README.md)** - Full documentation with all props, hooks, and examples
- **[Google Identity Services Docs](https://developers.google.com/identity/gsi/web)** - Official Google documentation
- **[Live Demo](https://react-oauth.vercel.app/)** - Interactive playground for Google OAuth

### GitHub OAuth

- **[Complete API Reference 🚀](./packages/@react-oauth/github/README.md)** - Full documentation with examples and error handling
- **[GitHub OAuth Docs](https://docs.github.com/en/developers/apps/building-oauth-apps)** - Official GitHub OAuth documentation

---

## Demo

Check out the live demo to see the Google OAuth package in action:

🔗 **[https://react-oauth.vercel.app/](https://react-oauth.vercel.app/)** _(Google OAuth only)_

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ for the React community

**[GitHub](https://github.com/MomenSherif/react-oauth)** • **[Issues](https://github.com/MomenSherif/react-oauth/issues)** • [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) • [@react-oauth/github](https://www.npmjs.com/package/@react-oauth/github)

</div>
