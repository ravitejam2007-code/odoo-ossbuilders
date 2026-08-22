import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../shared/Button';
import { FormField, Input } from '../../shared/FormField';
import { Eye, EyeOff, AlertCircle, User, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';
import type { SignupResponse } from '../types/api';

export const LoginView: React.FC = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'employee' | 'admin'>('employee');
  
  // Sign up fields
  const [companyName, setCompanyName] = useState('Odoo Inc');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98765 12345');
  const [signupSuccessData, setSignupSuccessData] = useState<SignupResponse | null>(null);

  // Common & Sign in fields
  const [loginIdOrEmail, setLoginIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLoginId = () => {
    if (signupSuccessData?.loginId) {
      navigator.clipboard.writeText(signupSuccessData.loginId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      if (!password.trim()) {
        setError('Please enter a password.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        const res = await signup({
          companyName: companyName.trim() || 'Dayflow Inc',
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || '+91 98765 12345',
          password,
          role: selectedRole === 'admin' ? 'admin' : 'employee',
        });
        setSignupSuccessData(res);
        setLoginIdOrEmail(res.loginId || email);
      } catch (err: any) {
        setError(err.message || 'Signup failed. Please check your information and try again.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!loginIdOrEmail.trim() || !password.trim()) {
        setError('Please enter your Login ID / Email and password.');
        return;
      }

      setLoading(true);
      try {
        const session = await login(loginIdOrEmail.trim(), password);
        if (session.user.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } catch (err: any) {
        if (err.code === 'EMAIL_NOT_VERIFIED') {
          setError('Your email has not been verified yet. Please check your inbox for the verification link or proceed to sign in once confirmed.');
        } else if (err.code === 'INVALID_CREDENTIALS') {
          setError('Invalid Login ID / Email or password. Please verify your credentials.');
        } else {
          setError(err.message || 'Authentication failed. Please verify your credentials and try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen max-h-screen bg-[#ffffff] flex flex-col font-sans text-[#1c1e21] overflow-hidden">
      {/* Header Bar */}
      <header className="w-full h-14 border-b border-[#dee3e9] px-6 bg-[#ffffff] flex items-center justify-between flex-shrink-0">
        <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.jpg"
              alt="Dayflow Logo"
              className="w-7 h-7 rounded-[6px] object-cover border border-[#dee3e9] shadow-2xs flex-shrink-0"
            />
            <span className="text-[15px] font-bold text-[#0a1317] tracking-[-0.16px]">
              Dayflow HRMS
            </span>
          </a>
          <a
            href="/"
            className="text-[13px] font-bold text-[#5d6c7b] hover:text-[#0a1317] transition-colors flex items-center gap-1"
          >
            <span>&larr;</span>
            <span>Back to Home</span>
          </a>
        </div>
      </header>

      {/* Centered Auth Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-3 sm:py-6 overflow-y-auto">
        <div className="w-full max-w-[420px] space-y-4 my-auto">
          
          {/* Headline */}
          <div className="text-center space-y-1">
            <h1 className="text-[28px] sm:text-[32px] font-[500] leading-[1.2] text-[#0a1317] tracking-[0]">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-[13px] font-normal leading-[1.4] text-[#5d6c7b]">
              {mode === 'signin'
                ? 'Sign in with your Login ID or Email to access Dayflow'
                : 'Register a new verified employee account'}
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="p-1 rounded-full bg-[#f1f4f7] border border-[#dee3e9] grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('employee');
                setError('');
              }}
              className={[
                'flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-[12px] font-bold transition-all duration-150 cursor-pointer',
                selectedRole === 'employee'
                  ? 'bg-[#0a1317] text-white shadow-xs'
                  : 'text-[#5d6c7b] hover:text-[#0a1317]',
              ].join(' ')}
            >
              <User className="w-3.5 h-3.5" />
              <span>Employee Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setError('');
              }}
              className={[
                'flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-[12px] font-bold transition-all duration-150 cursor-pointer',
                selectedRole === 'admin'
                  ? 'bg-[#0a1317] text-white shadow-xs'
                  : 'text-[#5d6c7b] hover:text-[#0a1317]',
              ].join(' ')}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin / HR</span>
            </button>
          </div>

          {/* Auth Form Panel */}
          <div className="bg-[#ffffff] rounded-[20px] border border-[#dee3e9] shadow-[rgba(20,22,26,0.15)_0px_2px_8px_0px] p-5 sm:p-6 space-y-4">
            
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-[#dee3e9] pb-2 justify-center gap-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                }}
                className={[
                  'text-[13px] font-bold pb-1 transition-all border-b-2 cursor-pointer',
                  mode === 'signin'
                    ? 'border-[#0a1317] text-[#0a1317]'
                    : 'border-transparent text-[#8595a4] hover:text-[#0a1317]',
                ].join(' ')}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className={[
                  'text-[13px] font-bold pb-1 transition-all border-b-2 cursor-pointer',
                  mode === 'signup'
                    ? 'border-[#0a1317] text-[#0a1317]'
                    : 'border-transparent text-[#8595a4] hover:text-[#0a1317]',
                ].join(' ')}
              >
                Sign Up
              </button>
            </div>

            {/* Signup Success Notice Modal/Card */}
            {signupSuccessData && mode === 'signup' && (
              <div className="p-4 rounded-[14px] bg-[#e6f4ea] border border-[#31a24c]/30 space-y-2.5">
                <div className="flex items-center gap-2 text-[#1a7f3c]">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="font-bold text-[14px]">Account Created Successfully!</span>
                </div>
                <div className="bg-white p-3 rounded-[10px] border border-[#31a24c]/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-[#5d6c7b]">Your Backend Login ID:</span>
                    <button
                      type="button"
                      onClick={handleCopyLoginId}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0064e0] hover:underline"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                    </button>
                  </div>
                  <p className="font-mono font-bold text-[16px] text-[#0a1317]">{signupSuccessData.loginId}</p>
                </div>
                <p className="text-[12px] text-[#1a7f3c] leading-[1.4]">
                  {signupSuccessData.message || 'Please check your email for the verification link before logging in.'}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setMode('signin');
                    setSignupSuccessData(null);
                  }}
                >
                  Proceed to Sign In &rarr;
                </Button>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-[8px] bg-[#fde8ec] border border-[#f0284a]/20">
                <AlertCircle className="w-4 h-4 text-[#e41e3f] flex-shrink-0 mt-0.5" />
                <p className="text-[12px] font-normal leading-[1.4] text-[#c0122e]">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              
              {/* Sign Up Fields */}
              {mode === 'signup' && (
                <>
                  <FormField label="Company Name">
                    <Input
                      id="signup-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Odoo Inc"
                    />
                  </FormField>

                  <FormField label="Full Name" required>
                    <Input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g. Alex Morgan"
                      autoFocus
                    />
                  </FormField>

                  <FormField label="Work Email Address" required>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="alex.morgan@company.com"
                    />
                  </FormField>

                  <FormField label="Phone Number">
                    <Input
                      id="signup-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 12345"
                    />
                  </FormField>
                </>
              )}

              {/* Sign In ID / Email Field */}
              {mode === 'signin' && (
                <FormField label="Login ID or Email" required>
                  <Input
                    id="login-id"
                    type="text"
                    value={loginIdOrEmail}
                    onChange={(e) => {
                      setLoginIdOrEmail(e.target.value);
                      setError('');
                    }}
                    placeholder={
                      selectedRole === 'employee'
                        ? 'e.g. OIJODO20220001 or john.doe@company.com'
                        : 'admin@dayflow.internal or OIADMI20220001'
                    }
                    autoComplete="username"
                    autoFocus
                  />
                </FormField>
              )}

              {/* Password Field */}
              <FormField label="Password" required>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your password"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-[#8595a4] hover:text-[#1c1e21] hover:bg-[#f1f4f7] transition-colors outline-none"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </FormField>

              {/* Confirm Password Field for Sign Up */}
              {mode === 'signup' && (
                <FormField label="Confirm Password" required>
                  <Input
                    id="signup-confirm-password"
                    type={showPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                </FormField>
              )}

              <Button type="submit" variant="primary" size="md" loading={loading} className="w-full mt-1">
                {mode === 'signin'
                  ? selectedRole === 'employee' ? 'Sign In to Employee Portal' : 'Sign In as Administrator'
                  : 'Create Verified Account'}
              </Button>
            </form>

            {/* Pre-seeded credentials helper */}
            {mode === 'signin' && (
              <div className="p-3 rounded-[10px] bg-[#f1f4f7] border border-[#dee3e9] text-[11px] space-y-1 text-[#5d6c7b]">
                <p className="font-bold text-[#0a1317]">Pre-Seeded Test Credentials:</p>
                {selectedRole === 'employee' ? (
                  <p>
                    <strong>ID:</strong> <code className="font-mono text-[#0a1317]">OIJODO20220001</code> &bull;{' '}
                    <strong>Pass:</strong> <code className="font-mono text-[#0a1317]">Password@1234</code>
                  </p>
                ) : (
                  <p>
                    <strong>Email:</strong> <code className="font-mono text-[#0a1317]">admin@dayflow.internal</code> &bull;{' '}
                    <strong>Pass:</strong> <code className="font-mono text-[#0a1317]">Admin@1234</code>
                  </p>
                )}
              </div>
            )}

            {/* Toggle link at bottom */}
            <div className="pt-2 border-t border-[#dee3e9] text-center text-[12px] text-[#5d6c7b]">
              {mode === 'signin' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                    }}
                    className="font-bold text-[#0a1317] hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError('');
                    }}
                    className="font-bold text-[#0a1317] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>

          </div>

          <p className="text-center text-[11px] text-[#8595a4]">
            Dayflow HRMS &bull; Enterprise Workforce Platform &bull; Secured System
          </p>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full h-10 border-t border-[#dee3e9] bg-[#ffffff] flex items-center justify-center flex-shrink-0 text-[11px] text-[#8595a4] px-4">
        <span>&copy; 2026 Dayflow HRMS. All rights reserved.</span>
      </footer>
    </div>
  );
};
