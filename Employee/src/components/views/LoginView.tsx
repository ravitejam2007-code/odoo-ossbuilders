import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { FormField, Input } from '../ui/FormField';
import { Card } from '../ui/Card';
import { Lock, Mail, Building2, User, Phone, Eye, EyeOff, ShieldCheck, Info } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, signup } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginIdOrEmail, setLoginIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('Odoo India');
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [generatedIdNotice, setGeneratedIdNotice] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdOrEmail.trim()) {
      setError('Please enter your Login ID or Email.');
      return;
    }
    setError('');
    login(loginIdOrEmail, password);
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !fullName || !signupEmail) {
      setError('Please complete all required registration fields.');
      return;
    }
    setError('');
    const res = signup(companyName, fullName, signupEmail, phone);
    if (res.success && res.loginId) {
      setGeneratedIdNotice(res.loginId);
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-4 font-sans text-zinc-900">
      <div className="max-w-md w-full space-y-6">
        {/* Corporate Header / Branding */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-black text-lg mx-auto shadow-2xs">
            D
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950">Dayflow</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Human Resource Management System
          </p>
        </div>

        {/* Clean Centered White Login Card */}
        <Card className="p-8 space-y-6 bg-white border-zinc-200 shadow-2xs">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-xl font-black text-zinc-950">
              {isSignUpMode ? 'Create Employee Account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isSignUpMode
                ? 'Register your company profile to access HRMS.'
                : 'Sign in to access your employee workspace.'}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              {error}
            </div>
          )}

          {generatedIdNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1 font-bold">
              <p className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Account Created Successfully!</span>
              </p>
              <p className="font-mono text-zinc-900">Your Login ID: {generatedIdNotice}</p>
            </div>
          )}

          {!isSignUpMode ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <FormField label="Login ID or Email" required>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g. OIJODO20220001 or john.doe@odoo.com"
                    value={loginIdOrEmail}
                    onChange={(e) => setLoginIdOrEmail(e.target.value)}
                    className="pl-10"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </FormField>

              <FormField label="Password" required>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-zinc-600 font-medium cursor-pointer">
                  <input type="checkbox" className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950" />
                  <span>Remember session</span>
                </label>
                <a href="#" className="font-bold text-zinc-950 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Primary Black Button */}
              <Button variant="primary" size="lg" type="submit" className="w-full mt-2">
                Sign In
              </Button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <FormField label="Company Name" required>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g. Odoo India"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-10"
                  />
                  <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </FormField>

              <FormField label="Full Name" required>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                  />
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </FormField>

              <FormField label="Work Email" required>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="john.doe@odoo.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="pl-10"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </FormField>

              <FormField label="Phone Contact">
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </FormField>

              <Button variant="primary" size="lg" type="submit" className="w-full mt-2">
                Complete Account Registration
              </Button>
            </form>
          )}

          {/* Secondary Authentication Option */}
          <div className="text-center pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(!isSignUpMode);
                setError('');
              }}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:underline"
            >
              {!isSignUpMode
                ? "Don't have an account? Create account"
                : 'Already registered? Sign in here'}
            </button>
          </div>
        </Card>

        {/* Compact Neutral Gray Login ID Info Section */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-xs text-zinc-600 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-zinc-950">
            <Info className="w-4 h-4 text-zinc-950 flex-shrink-0" />
            <span>Login ID Auto-Generation Standard</span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-500">
            Login IDs follow the official corporate format:{' '}
            <strong className="font-mono text-zinc-900">
              [Company (2)] + [Name (4)] + [Year (4)] + [Serial (4)]
            </strong>{' '}
            (e.g., <span className="font-mono text-zinc-950 font-bold">OIJODO20220001</span>).
          </p>
        </div>
      </div>
    </div>
  );
};
