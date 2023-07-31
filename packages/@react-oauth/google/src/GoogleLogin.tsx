import React from 'react';
import GoogleLoginComponent, { GoogleLoginProps } from './GoogleLoginComponent';
import ErrorBoundary from './ErrorBoundary';

export default function GoogleLogin(props: GoogleLoginProps) {
  return (
    <ErrorBoundary>
      <GoogleLoginComponent {...props} />
    </ErrorBoundary>
  );
}
