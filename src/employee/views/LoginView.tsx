import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../shared/Button';
import { FormField, Input } from '../../shared/FormField';
import { Eye, EyeOff, AlertCircle, User, ShieldCheck } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'employee' | 'admin'>('employee');
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!loginId.trim()) {
        setError(`Please enter your ${selectedRole === 'employee' ? 'Employee ID or Email' : 'Admin Email'}.`);
        return;
      }
      if (!password.trim()) {
        setError('Please enter a password.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    } else {
      if (!loginId.trim() || !password.trim()) {
        setError(`Please enter your ${selectedRole === 'employee' ? 'Employee ID' : 'Admin Email'} and password.`);
        return;
      }
    }

    setLoading(true);
    try {
      if (selectedRole === 'employee') {
        if (mode === 'signup') {
          signup({
            name: name.trim(),
            email: loginId.trim(),
            department: department.trim() || 'Engineering',
            password,
          });
        } else {
          login(loginId.trim(), password);
        }
        window.location.href = '/dashboard';
      } else {
        localStorage.setItem(
          'dayflow_admin_user',
          JSON.stringify({
            id: 'emp-admin-1',
            loginId: 'OIADMN20260001',
            name: name.trim() || 'Admin User',
            email: loginId.trim(),
            company: 'Odoo India',
            department: department.trim() || 'Human Resources',
            jobTitle: 'HR Director / Admin',
            role: 'admin',
            workStatus: 'present',
          })
        );
        window.location.href = '/admin/dashboard';
      }
    } catch {
      setError('Authentication failed. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen bg-[#ffffff] flex flex-col font-sans text-[#1c1e21] overflow-hidden">
      {/* Sleek Minimal Header Bar (56px) */}
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

      {/* Centered Auth Card Container — Fits strictly inside viewport */}
      <main className="flex-1 flex items-center justify-center px-4 py-3 sm:py-6 overflow-y-auto">
        <div className="w-full max-w-[400px] space-y-4 my-auto">
          
          {/* Headline */}
          <div className="text-center space-y-1">
            <h1 className="text-[28px] sm:text-[32px] font-[500] leading-[1.2] text-[#0a1317] tracking-[0]">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-[13px] font-normal leading-[1.4] text-[#5d6c7b]">
              {mode === 'signin'
                ? 'Select your role to access your Dayflow portal'
                : 'Register a new employee or admin account'}
            </p>
          </div>

          {/* Role Selection Pill Tabs */}
          <div className="p-1 rounded-full bg-[#f1f4f7] border border-[#dee3e9] grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('employee');
                setError('');
              }}
              className={[
                'flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-[12px] font-bold transition-all duration-150',
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
                'flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-[12px] font-bold transition-all duration-150',
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
            
            {/* Mode Switcher Tabs (Sign In / Sign Up) */}
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

            {error && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-[8px] bg-[#fde8ec] border border-[#f0284a]/20">
                <AlertCircle className="w-4 h-4 text-[#e41e3f] flex-shrink-0 mt-0.5" />
                <p className="text-[12px] font-normal leading-[1.4] text-[#c0122e]">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              
              {/* Sign Up Name Field */}
              {mode === 'signup' && (
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
              )}

              {/* ID / Email Field */}
              <FormField
                label={
                  mode === 'signup'
                    ? selectedRole === 'employee' ? 'Employee ID or Email' : 'Admin Work Email'
                    : selectedRole === 'employee' ? 'Employee ID' : 'Admin Email'
                }
                required
              >
                <Input
                  id="login-id"
                  type={selectedRole === 'employee' ? 'text' : 'email'}
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                    setError('');
                  }}
                  placeholder={
                    selectedRole === 'employee' ? 'e.g. EMP-0042' : 'admin@company.com'
                  }
                  autoComplete="username"
                  autoFocus={mode === 'signin'}
                />
              </FormField>

              {/* Sign Up Department Field */}
              {mode === 'signup' && (
                <FormField label="Department / Company">
                  <Input
                    id="signup-dept"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Engineering, Human Resources"
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

              {mode === 'signin' && (
                <div className="flex items-center justify-between text-[12px]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 rounded-[2px] border-[#ced0d4] accent-[#0a1317] cursor-pointer"
                    />
                    <span className="text-[#5d6c7b]">Remember me</span>
                  </label>
                  <a href="#" className="font-bold text-[#0a1317] hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button type="submit" variant="primary" size="md" loading={loading} className="w-full mt-1">
                {mode === 'signin'
                  ? selectedRole === 'employee' ? 'Sign In to Employee Portal' : 'Sign In as Administrator'
                  : selectedRole === 'employee' ? 'Create Employee Account' : 'Create Admin Account'}
              </Button>
            </form>

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

      {/* Clean Compact Footer */}
      <footer className="w-full h-10 border-t border-[#dee3e9] bg-[#ffffff] flex items-center justify-center flex-shrink-0 text-[11px] text-[#8595a4] px-4">
        <span>&copy; 2026 Dayflow HRMS. All rights reserved.</span>
      </footer>
    </div>
  );
};
