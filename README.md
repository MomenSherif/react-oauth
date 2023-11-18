# React OAuth2 | Google

Google OAuth2 using the new [**Google Identity Services SDK**](https://developers.google.com/identity/gsi/web) for React [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)🚀

## Install

```sh
$ npm install @react-oauth/google@latest

# or

$ yarn add @react-oauth/google@latest
```

## Demo & How to use to fetch user details

https://react-oauth.vercel.app/

## Seamless sign-in and sign-up flows

### Sign In With Google

Add a personalized and customizable sign-up or sign-in button to your website.

![personalized button](https://developers.google.com/identity/gsi/web/images/personalized-button-single_480.png)

### One-tap sign-up

Sign up new users with just one tap, without interrupting them with a sign-up screen. Users get a secure, token-based, passwordless account on your site, protected by their Google Account.

![One-tap sign-up](https://developers.google.com/identity/gsi/web/images/one-tap-sign-in_480.png)

### Automatic sign-in

Sign users in automatically when they return to your site on any device or browser, even after their session expires.

![Automatic sign-in](https://developers.google.com/identity/gsi/web/images/auto-sign-in_480.png)

## User authorization for Google APIs (with custom button)

OAuth 2.0 implicit and authorization code flows for web apps

> The Google Identity Services JavaScript library helps you to quickly and safely obtain access tokens necessary to call Google APIs. Your web application, complete either the OAuth 2.0 implicit flow, or to initiate the authorization code flow which then finishes on your backend platform.

## How to use

1. Get your [**Google API client ID**](https://console.cloud.google.com/apis/dashboard)

> Key Point: Add both `http://localhost` and `http://localhost:<port_number>` to the Authorized JavaScript origins box for local tests or development.

2. Configure your OAuth [**Consent Screen**](https://console.cloud.google.com/apis/credentials/consent)

3. Wrap your application with `GoogleOAuthProvider`

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId="<your_client_id>">...</GoogleOAuthProvider>;
```

### Sign In With Google

```jsx
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>;
```

### One-tap

```jsx
import { useGoogleOneTapLogin } from '@react-oauth/google';

useGoogleOneTapLogin({
  onSuccess: credentialResponse => {
    console.log(credentialResponse);
  },
  onError: () => {
    console.log('Login Failed');
  },
});
```

or

```jsx
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
  useOneTap
/>;
```

> If you are using one tap login, when logging user out consider [this issue](https://developers.google.com/identity/gsi/web/guides/automatic-sign-in-sign-out#sign-out) may happen, to prevent it call `googleLogout` when logging user out from your application.

```jsx
import { googleLogout } from '@react-oauth/google';

googleLogout();
```

### Automatic sign-in

> `auto_select` prop `true`

```jsx

<GoogleLogin
    ...
    auto_select
/>

useGoogleOneTapLogin({
    ...
    auto_select
});
```

### Custom login button (implicit & authorization code flow)

#### Implicit flow

```jsx
import { useGoogleLogin } from '@react-oauth/google';

const login = useGoogleLogin({
  onSuccess: tokenResponse => console.log(tokenResponse),
});

<MyCustomButton onClick={() => login()}>Sign in with Google 🚀</MyCustomButton>;
```

#### Authorization code flow

> Requires backend to exchange code with access and refresh token.

```jsx
import { useGoogleLogin } from '@react-oauth/google';

const login = useGoogleLogin({
  onSuccess: codeResponse => console.log(codeResponse),
  flow: 'auth-code',
});

<MyCustomButton onClick={() => login()}>Sign in with Google 🚀</MyCustomButton>;
```

#### Checks if the user granted all the specified scope or scopes

```jsx
import { hasGrantedAllScopesGoogle } from '@react-oauth/google';

const hasAccess = hasGrantedAllScopesGoogle(
  tokenResponse,
  'google-scope-1',
  'google-scope-2',
);
```

#### Checks if the user granted any of the specified scope or scopes

```jsx
import { hasGrantedAnyScopeGoogle } from '@react-oauth/google';

const hasAccess = hasGrantedAnyScopeGoogle(
  tokenResponse,
  'google-scope-1',
  'google-scope-2',
);
```

#### [Content Security Policy (if needed)](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#content_security_policy)

## API

### GoogleOAuthProvider

| Required | Prop                | Type       | Description                                                                 |
| :------: | ------------------- | ---------- | --------------------------------------------------------------------------- |
|    ✓     | clientId            | `string`   | [**Google API client ID**](https://console.cloud.google.com/apis/dashboard) |
|          | nonce               | `string`   | Nonce applied to GSI script tag. Propagates to GSI's inline style tag       |
|          | onScriptLoadSuccess | `function` | Callback fires on load gsi script success                                   |
|          | onScriptLoadError   | `function` | Callback fires on load gsi script failure                                   |

### GoogleLogin

| Required | Prop                               | Type                                                          | Description                                                                                                                                                                                                                                                                       |
| :------: | ---------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    ✓     | onSuccess                          | `(response: CredentialResponse) => void`                      | Callback fires with credential response after successfully login                                                                                                                                                                                                                  |
|          | onError                            | `function`                                                    | Callback fires after login failure                                                                                                                                                                                                                                                |
|          | type                               | `standard` \| `icon`                                          | Button type [type](https://developers.google.com/identity/gsi/web/reference/js-reference#type)                                                                                                                                                                                    |
|          | theme                              | `outline` \| `filled_blue` \| `filled_black`                  | Button [theme](https://developers.google.com/identity/gsi/web/reference/js-reference#theme)                                                                                                                                                                                       |
|          | size                               | `large` \| `medium` \| `small`                                | Button [size](https://developers.google.com/identity/gsi/web/reference/js-reference#size)                                                                                                                                                                                         |
|          | text                               | `signin_with` \| `signup_with` \| `continue_with` \| `signin` | Button [text](https://developers.google.com/identity/gsi/web/reference/js-reference#text). For example, "Sign in with Google", "Sign up with Google" or "Sign in"                                                                                                                 |
|          | shape                              | `rectangular` \| `pill` \| `circle` \| `square`               | Button [shape](https://developers.google.com/identity/gsi/web/reference/js-reference#shape)                                                                                                                                                                                       |
|          | logo_alignment                     | `left` \| `center`                                            | Google [logo alignment](https://developers.google.com/identity/gsi/web/reference/js-reference#logo_alignment)                                                                                                                                                                     |
|          | width                              | `string`                                                      | button [width](https://developers.google.com/identity/gsi/web/reference/js-reference#width), in pixels                                                                                                                                                                            |
|          | locale                             | `string`                                                      | If set, then the button [language](https://developers.google.com/identity/gsi/web/reference/js-reference#locale) is rendered                                                                                                                                                      |
|          | useOneTap                          | `boolean`                                                     | Activate One-tap sign-up or not                                                                                                                                                                                                                                                   |
|          | promptMomentNotification           | `(notification: PromptMomentNotification) => void`            | [PromptMomentNotification](https://developers.google.com/identity/gsi/web/reference/js-reference) methods and description                                                                                                                                                         |
|          | cancel_on_tap_outside              | `boolean`                                                     | Controls whether to cancel the prompt if the user clicks outside of the prompt                                                                                                                                                                                                    |
|          | auto_select                        | `boolean`                                                     | Enables automatic selection on Google One Tap                                                                                                                                                                                                                                     |
|          | ux_mode                            | `popup` \| `redirect`                                         | The Sign In With Google button UX flow                                                                                                                                                                                                                                            |
|          | login_uri                          | `string`                                                      | The URL of your login endpoint                                                                                                                                                                                                                                                    |
|          | native_login_uri                   | `string`                                                      | The URL of your password credential handler endpoint                                                                                                                                                                                                                              |
|          | native_callback                    | `(response: { id: string; password: string }) => void`        | The JavaScript password credential handler function name                                                                                                                                                                                                                          |
|          | prompt_parent_id                   | `string`                                                      | The DOM ID of the One Tap prompt container element                                                                                                                                                                                                                                |
|          | nonce                              | `string`                                                      | A random string for ID tokens                                                                                                                                                                                                                                                     |
|          | context                            | `signin` \| `signup` \| `use`                                 | The title and words in the One Tap prompt                                                                                                                                                                                                                                         |
|          | state_cookie_domain                | `string`                                                      | If you need to call One Tap in the parent domain and its subdomains, pass the parent domain to this attribute so that a single shared cookie is used                                                                                                                              |
|          | allowed_parent_origin              | `string` \| `string[]`                                        | The origins that are allowed to embed the intermediate iframe. One Tap will run in the intermediate iframe mode if this attribute presents                                                                                                                                        |
|          | intermediate_iframe_close_callback | `function`                                                    | Overrides the default intermediate iframe behavior when users manually close One Tap                                                                                                                                                                                              |
|          | itp_support                        | `boolean`                                                     | Enables upgraded One Tap UX on ITP browsers                                                                                                                                                                                                                                       |
|          | hosted_domain                      | `string`                                                      | If your application knows the Workspace domain the user belongs to, use this to provide a hint to Google. For more information, see the [hd](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs |
|          | use_fedcm_for_prompt               | `boolean`                                                     | Allow the browser to control user sign-in prompts and mediate the sign-in flow between your website and Google.                                                                                                                                                                   |

### useGoogleLogin (Both implicit & authorization code flow)

| Required | Prop                  | Type                                                                                      | Description                                                                                                                                                                                                                                                                                                                                     |
| :------: | --------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          | flow                  | `implicit` \| `auth-code`                                                                 | [Two flows](https://developers.google.com/identity/oauth2/web/guides/how-user-authz-works), implicit and authorization code are discussed. Both return an access token suitable for use with Google APIs                                                                                                                                        |
|          | onSuccess             | `(response: TokenResponse\|CodeResponse) => void`                                         | Callback fires with response ([token](https://developers.google.com/identity/oauth2/web/reference/js-reference#TokenResponse) \| [code](https://developers.google.com/identity/oauth2/web/reference/js-reference#CodeResponse)) based on flow selected after successfully login                                                                 |
|          | onError               | `(errorResponse: {error: string; error_description?: string,error_uri?: string}) => void` | Callback fires after login failure                                                                                                                                                                                                                                                                                                              |
|          | onNonOAuthError       | `(nonOAuthError: NonOAuthError) => void`                                                  | Some non-OAuth errors, such as the popup window is failed to open or closed before an OAuth response is returned. `popup_failed_to_open` \| `popup_closed` \| `unknown`                                                                                                                                                                         |
|          | scope                 | `string`                                                                                  | A space-delimited list of scopes that are approved by the user                                                                                                                                                                                                                                                                                  |
|          | enable_serial_consent | `boolean`                                                                                 | defaults to true. If set to false, [more granular Google Account permissions](https://developers.googleblog.com/2018/10/more-granular-google-account.html) will be disabled for clients created before 2019. No effect for newer clients, since more granular permissions is always enabled for them.                                           |
|          | hint                  | `string`                                                                                  | If your application knows which user should authorize the request, it can use this property to provide a hint to Google. The email address for the target user. For more information, see the [login_hint](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs |
|          | hosted_domain         | `string`                                                                                  | If your application knows the Workspace domain the user belongs to, use this to provide a hint to Google. For more information, see the [hd](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs                                                               |

### useGoogleLogin (Extra implicit flow props)

| Required | Prop   | Type                                            | Description                                                                                                                                                         |
| :------: | ------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          | prompt | `''` \| `none` \| `consent` \| `select_account` | defaults to 'select_account'. A space-delimited, case-sensitive list of prompts to present the user                                                                 |
|          | state  | `string`                                        | Not recommended. Specifies any string value that your application uses to maintain state between your authorization request and the authorization server's response |

### useGoogleLogin (Extra authorization code flow props)

| Required | Prop           | Type                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :------: | -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          | ux_mode        | `popup` \| `redirect` | The UX mode to use for the authorization flow. By default, it will open the consent flow in a popup. Valid values are popup and redirect                                                                                                                                                                                                                                                                                                                |
|          | redirect_uri   | `string`              | Required for redirect UX. Determines where the API server redirects the user after the user completes the authorization flow The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client which you configured in the API Console and must conform to our [Redirect URI validation](https://developers.google.com/identity/protocols/oauth2/web-server#uri-validation) rules. The property will be ignored by the popup UX |
|          | state          | `string`              | Recommended for redirect UX. Specifies any string value that your application uses to maintain state between your authorization request and the authorization server's response                                                                                                                                                                                                                                                                         |
|          | select_account | `boolean`             | defaults to 'false'. Boolean value to prompt the user to select an account                                                                                                                                                                                                                                                                                                                                                                              |

### useGoogleOneTapLogin

| Required | Prop                     | Type                                               | Description                                                                                                                                                                                                                                                                       |
| :------: | ------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    ✓     | onSuccess                | `(response: CredentialResponse) => void`           | Callback fires with credential response after successfully login                                                                                                                                                                                                                  |
|          | onError                  | `function`                                         | Callback fires after login failure                                                                                                                                                                                                                                                |
|          | promptMomentNotification | `(notification: PromptMomentNotification) => void` | [PromptMomentNotification](https://developers.google.com/identity/gsi/web/reference/js-reference) methods and description                                                                                                                                                         |
|          | cancel_on_tap_outside    | `boolean`                                          | Controls whether to cancel the prompt if the user clicks outside of the prompt                                                                                                                                                                                                    |
|          | hosted_domain            | `string`                                           | If your application knows the Workspace domain the user belongs to, use this to provide a hint to Google. For more information, see the [hd](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs |
|          | disabled                 | `boolean`                                          | Controls whether to cancel the popup in cases such as when the user is already logged in                                                                                                                                                                                          |
|          | use_fedcm_for_prompt     | `boolean`                                          | Allow the browser to control user sign-in prompts and mediate the sign-in flow between your website and Google.                                                                                                                                                                   |
