import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrentUser, useUpdateProfileMutation } from '../hooks/useEmployeeData';
import { Button } from '../../shared/Button';
import { Card } from '../../shared/Card';
import { FormField, Input } from '../../shared/FormField';
import { Badge } from '../../shared/Badge';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Lock,
  Edit,
  CheckCircle,
  FileText,
  ShieldCheck,
  Award,
  Plus,
  Sparkles,
  Heart,
  Compass,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser: authUser } = useAuth();
  const { data: profileUser, isLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfileMutation();

  const currentUser = profileUser || authUser;

  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'security'>('resume');
  const [savedSuccess, setSavedSuccess] = useState('');

  // Skills & Certifications interactive state
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [showCertInput, setShowCertInput] = useState(false);

  if (isLoading && !currentUser) {
    return <div className="p-8 text-center text-[#5d6c7b]">Loading employee profile...</div>;
  }

  if (!currentUser) return null;

  const currentSkills = currentUser.skills || [];
  const currentCerts = currentUser.certifications || [];

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !currentSkills.includes(newSkill.trim())) {
      const updatedSkills = [...currentSkills, newSkill.trim()];
      try {
        await updateProfileMutation.mutateAsync({ skills: updatedSkills });
        setNewSkill('');
        setShowSkillInput(false);
        setSavedSuccess('Skill added successfully');
        setTimeout(() => setSavedSuccess(''), 3000);
      } catch (err: any) {
        alert(err.message || 'Failed to save skill');
      }
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCert.trim() && !currentCerts.includes(newCert.trim())) {
      const updatedCerts = [...currentCerts, newCert.trim()];
      try {
        await updateProfileMutation.mutateAsync({ certifications: updatedCerts });
        setNewCert('');
        setShowCertInput(false);
        setSavedSuccess('Certification added successfully');
        setTimeout(() => setSavedSuccess(''), 3000);
      } catch (err: any) {
        alert(err.message || 'Failed to save certification');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto font-sans">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0a1317] tracking-tight leading-tight">
            My Profile
          </h1>
          <p className="text-[14px] text-[#5d6c7b] mt-1 font-normal">
            Personal profile, resume details, and account security
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f4ea] text-[13px] font-semibold text-[#1a7f3c]">
              <CheckCircle className="w-4 h-4 text-[#31a24c]" />
              <span>{savedSuccess}</span>
            </div>
          )}
          <a href="/profile/edit">
            <Button variant="primary" size="md">
              <Edit className="w-4 h-4 mr-1.5" />
              <span>Edit Profile</span>
            </Button>
          </a>
        </div>
      </div>

      {/* ── Identity Summary Card ───────────────────────────────────── */}
      <Card variant="feature" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#dee3e9] shadow-2xs"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#31a24c] border-2 border-white flex items-center justify-center">
                <span className="sr-only">Active</span>
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-[22px] font-semibold text-[#0a1317] tracking-tight">
                {currentUser.name}
              </h2>
              <p className="text-[14px] text-[#5d6c7b]">
                {currentUser.jobTitle || 'Associate Engineer'} &bull; {currentUser.department || 'Engineering'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Badge status={currentUser.workStatus} />
                <span className="text-[12px] font-mono font-semibold text-[#0a1317] bg-[#f1f4f7] px-2.5 py-0.5 rounded-full border border-[#dee3e9]">
                  ID: {currentUser.loginId}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 text-[13px] text-[#5d6c7b]">
            <p><strong className="text-[#0a1317] font-semibold">Company:</strong> {currentUser.company || 'Odoo Inc'}</p>
            <p><strong className="text-[#0a1317] font-semibold">Manager:</strong> {currentUser.manager || 'Admin User'}</p>
            <p><strong className="text-[#0a1317] font-semibold">Email:</strong> {currentUser.email}</p>
          </div>
        </div>
      </Card>

      {/* ── Navigation Pill Tabs ───────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-[#dee3e9] pb-3">
        {[
          { key: 'resume', label: 'Resume', icon: FileText },
          { key: 'private', label: 'Private Info', icon: User },
          { key: 'security', label: 'Account Security', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={[
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer outline-none',
                'focus-visible:ring-2 focus-visible:ring-[#1876f2]',
                isActive
                  ? 'bg-[#0a1317] text-white shadow-xs'
                  : 'bg-white text-[#1c1e21] border border-[#ced0d4] hover:bg-[#f1f4f7]',
              ].join(' ')}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: RESUME ───────────────────────────────────────────── */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="feature" className="p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#0a1317]">
                <Sparkles className="w-4 h-4 text-[#0064e0]" />
                <h3 className="text-[15px] font-semibold">About Me</h3>
              </div>
              <p className="text-[13px] leading-[1.6] text-[#5d6c7b]">
                {currentUser.about || 'Dedicated software engineer building high-impact enterprise applications.'}
              </p>
            </Card>

            <Card variant="feature" className="p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#0a1317]">
                <Heart className="w-4 h-4 text-[#e41e3f]" />
                <h3 className="text-[15px] font-semibold">What I Love About My Job</h3>
              </div>
              <p className="text-[13px] leading-[1.6] text-[#5d6c7b]">
                {currentUser.whatILoveAboutJob || 'Collaborating with exceptional colleagues and delivering robust features.'}
              </p>
            </Card>

            <Card variant="feature" className="p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#0a1317]">
                <Compass className="w-4 h-4 text-[#31a24c]" />
                <h3 className="text-[15px] font-semibold">Interests &amp; Hobbies</h3>
              </div>
              <p className="text-[13px] leading-[1.6] text-[#5d6c7b]">
                {currentUser.interests?.join(', ') || 'System Design, Open Source, Problem Solving'}
              </p>
            </Card>
          </div>

          {/* Skills Section */}
          <Card variant="feature" className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#dee3e9] pb-3">
              <h3 className="text-[16px] font-semibold text-[#0a1317]">
                Skills &amp; Competencies
              </h3>
              {!showSkillInput && (
                <Button variant="secondary" size="sm" onClick={() => setShowSkillInput(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Add Skill</span>
                </Button>
              )}
            </div>

            {showSkillInput && (
              <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
                <Input
                  type="text"
                  placeholder="Enter skill (e.g. React, Node.js)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  autoFocus
                />
                <Button variant="primary" size="sm" type="submit" loading={updateProfileMutation.isPending}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowSkillInput(false)}>
                  Cancel
                </Button>
              </form>
            )}

            <div className="flex flex-wrap gap-2">
              {currentSkills.length > 0 ? (
                currentSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-1.5 rounded-full bg-[#f1f4f7] border border-[#dee3e9] text-[13px] font-semibold text-[#0a1317]"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-[13px] text-[#8595a4]">No skills added yet.</p>
              )}
            </div>
          </Card>

          {/* Certifications Section */}
          <Card variant="feature" className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#dee3e9] pb-3">
              <h3 className="text-[16px] font-semibold text-[#0a1317]">
                Certifications &amp; Accreditations
              </h3>
              {!showCertInput && (
                <Button variant="secondary" size="sm" onClick={() => setShowCertInput(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Add Certification</span>
                </Button>
              )}
            </div>

            {showCertInput && (
              <form onSubmit={handleAddCert} className="flex gap-2 max-w-md">
                <Input
                  type="text"
                  placeholder="Enter certification name..."
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  autoFocus
                />
                <Button variant="primary" size="sm" type="submit" loading={updateProfileMutation.isPending}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowCertInput(false)}>
                  Cancel
                </Button>
              </form>
            )}

            <div className="space-y-2.5">
              {currentCerts.length > 0 ? (
                currentCerts.map((cert) => (
                  <div key={cert} className="flex items-center gap-3 p-3 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
                    <Award className="w-4 h-4 text-[#0064e0] flex-shrink-0" />
                    <span className="text-[13px] font-semibold text-[#0a1317]">{cert}</span>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-[#8595a4]">No certifications added yet.</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 2: PRIVATE INFO ─────────────────────────────────────── */}
      {activeTab === 'private' && (
        <div className="space-y-6">
          <Card variant="feature" className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#dee3e9] pb-3">
              <div>
                <h3 className="text-[16px] font-semibold text-[#0a1317]">
                  Personal Background
                </h3>
                <p className="text-[13px] text-[#5d6c7b]">Confidential personal employee data</p>
              </div>
              <a href="/profile/edit">
                <Button variant="secondary" size="sm">
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  <span>Edit Info</span>
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[13px]">
              <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
                <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">Date of Birth</span>
                <span className="font-mono font-semibold text-[#0a1317] mt-0.5 block">{currentUser.dob || '—'}</span>
              </div>
              <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
                <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">Nationality</span>
                <span className="font-semibold text-[#0a1317] mt-0.5 block">{currentUser.nationality || '—'}</span>
              </div>
              <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
                <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">Gender / Marital</span>
                <span className="font-semibold text-[#0a1317] mt-0.5 block">{currentUser.gender || '—'} &bull; {currentUser.maritalStatus || '—'}</span>
              </div>
              <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">Residential Address</span>
                <span className="font-medium text-[#0a1317] mt-0.5 block">{currentUser.residingAddress || '—'}</span>
              </div>
              <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
                <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">Phone Contact</span>
                <span className="font-medium text-[#0a1317] mt-0.5 block">{currentUser.phone || '—'}</span>
              </div>
            </div>
          </Card>

          {currentUser.bankDetails && (
            <Card variant="feature" className="p-6 space-y-5">
              <div className="border-b border-[#dee3e9] pb-3">
                <h3 className="text-[16px] font-semibold text-[#0a1317]">
                  Bank &amp; Tax Information
                </h3>
                <p className="text-[13px] text-[#5d6c7b]">Salary disbursement and statutory tax records</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[13px]">
                <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
                  <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">Bank Name</span>
                  <span className="font-semibold text-[#0a1317] mt-0.5 block">{currentUser.bankDetails.bankName || '—'}</span>
                </div>
                <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
                  <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">Account Number</span>
                  <span className="font-mono font-semibold text-[#0a1317] mt-0.5 block">{currentUser.bankDetails.accountNumber || '—'}</span>
                </div>
                <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
                  <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">IFSC Code</span>
                  <span className="font-mono font-semibold text-[#0a1317] mt-0.5 block">{currentUser.bankDetails.ifscCode || '—'}</span>
                </div>
                {currentUser.bankDetails.panNo && (
                  <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
                    <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">PAN Number</span>
                    <span className="font-mono font-semibold text-[#0a1317] mt-0.5 block">{currentUser.bankDetails.panNo}</span>
                  </div>
                )}
                {currentUser.bankDetails.uanNo && (
                  <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
                    <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">UAN Number</span>
                    <span className="font-mono font-semibold text-[#0a1317] mt-0.5 block">{currentUser.bankDetails.uanNo}</span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── TAB 3: SECURITY & PASSWORD ──────────────────────────────── */}
      {activeTab === 'security' && (
        <Card variant="feature" className="p-6 space-y-5 max-w-xl">
          <div className="border-b border-[#dee3e9] pb-3">
            <h3 className="text-[16px] font-semibold text-[#0a1317]">
              Account Authentication Credentials
            </h3>
            <p className="text-[13px] text-[#5d6c7b]">System identification details</p>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
              <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">Login ID</span>
              <span className="font-mono font-bold text-[#0a1317] mt-0.5 block">{currentUser.loginId}</span>
            </div>

            <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
              <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">Registered Work Email</span>
              <span className="font-semibold text-[#0a1317] mt-0.5 block">{currentUser.email}</span>
            </div>

            <div className="p-3.5 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9]">
              <span className="text-[11px] font-semibold uppercase text-[#8595a4] block">Role &amp; Permissions</span>
              <span className="font-semibold text-[#0a1317] mt-0.5 block capitalize">{currentUser.role || 'Employee'}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
