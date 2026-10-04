import React from 'react';
import { Container } from '../components/common/Container';
import { LoginForm } from '../components/auth/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="py-16 bg-[var(--bg-main)] min-h-[calc(100vh-160px)] flex items-center justify-center transition-colors">
      <Container size="sm">
        <LoginForm />
      </Container>
    </div>
  );
};

export default Login;
