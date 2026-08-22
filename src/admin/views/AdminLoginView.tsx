import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Button } from '../../shared/Button';
import { FormField, Input } from '../../shared/FormField';
import { Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

export const AdminLoginView: React.FC = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your admin credentials.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Contact your system administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f4f7] flex flex-col">
      {/* Minimal header */}
      <header className="w-full border-b border-[#dee3e9] bg-[#ffffff] px-6 py-4">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2.5">
          <img
            src="/logo.jpg"
            alt="Dayflow Logo"
            className="w-8 h-8 rounded-[8px] object-cover border border-[#dee3e9] shadow-2xs flex-shrink-0"
          />
          <span className="text-[16px] font-bold text-[#0a1317] tracking-[-0.16px]">Dayflow</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8595a4] ml-1">Admin</span>
        </div>
      </header>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center space-y-3">
            {/* DESIGN-meta: ShieldCheck icon in surface-soft circular container */}
            <div className="w-16 h-16 rounded-full bg-[#0a1317] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-[32px] font-[500] leading-[1.28] text-[#0a1317] tracking-[0]">
              Admin Sign In
            </h1>
            <p className="text-[16px] font-normal leading-[1.50] tracking-[-0.16px] text-[#5d6c7b]">
              HR / Administrator access only
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#ffffff] rounded-[24px] border border-[#dee3e9] shadow-[rgba(20,22,26,0.3)_0px_1px_4px_0px] p-7 space-y-5">
            {error && (
              <div className="flex items-start gap-3 p-3 rounded-[8px] bg-[#fde8ec] border border-[#f0284a]/20">
                <AlertCircle className="w-4 h-4 text-[#e41e3f] flex-shrink-0 mt-0.5" />
                <p className="text-[14px] font-normal leading-[1.43] text-[#c0122e]">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <FormField label="Admin Email" required>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="admin@company.com"
                  autoComplete="username"
                  autoFocus
                />
              </FormField>

              <FormField label="Password" required>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[#8595a4] hover:text-[#1c1e21] hover:bg-[#f1f4f7] transition-colors outline-none"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Sign In to Admin Portal
              </Button>
            </form>
          </div>

          <p className="text-center text-[12px] font-normal text-[#8595a4]">
            Employee portal?{' '}
            <a href="/login" className="text-[#5d6c7b] font-bold hover:text-[#0a1317] transition-colors">
              Sign in here →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
