
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import { LogIn, Lock, Mail, KeyRound } from 'lucide-react';

// Use a mock Supabase for now - REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
const supabaseUrl = "https://your-project-url.supabase.co";
const supabaseKey = "your-anonymous-key";
const supabase = createClient(supabaseUrl, supabaseKey);

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      // Redirect to bookmarks page or home
      window.location.href = '/';
    }

    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Password Reset",
        description: "Check your email for reset instructions",
      });
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            id="email"
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            id="password"
            type="password" 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required 
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Logging In..." : "Log In"}
          <LogIn className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="text-center">
        <Button 
          type="button" 
          variant="link" 
          onClick={handleResetPassword}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Reset Password
        </Button>
      </div>
    </form>
  );
};
