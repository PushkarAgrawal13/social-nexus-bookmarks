
import React from 'react';
import { LoginForm } from '@/components/ui/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary/90 to-purple-600/90">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center gradient-text">Social Bookmarks</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
