import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FormField, Input } from '../ui/FormField';
import {
  User,
  DollarSign,
  Edit,
  Lock,
  QrCode,
  Heart,
  Smile,
  Award,
  Plus,
  CheckCircle2,
  AlertCircle,
  Key,
  ShieldCheck,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'salary' | 'security'>('resume');

  // Interactive Skills & Certifications state
  const [skills, setSkills] = useState<string[]>(
    currentUser?.skills || ['React', 'TypeScript', 'Astro.js', 'Tailwind CSS', 'TanStack Query']
  );
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);

  const [certifications, setCertifications] = useState<string[]>(
    currentUser?.certifications || ['Certified Frontend Specialist 2025', 'Agile Product Lifecycle Certification']
  );
  const [newCertInput, setNewCertInput] = useState('');
  const [showAddCert, setShowAddCert] = useState(false);

  // Change Password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passNotice, setPassNotice] = useState<string | null>(null);

  if (!currentUser) return null;
  const sal = currentUser.salaryInfo;
  const bank = currentUser.bankDetails;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
      setShowAddSkill(false);
    }
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCertInput.trim() && !certifications.includes(newCertInput.trim())) {
      setCertifications([...certifications, newCertInput.trim()]);
      setNewCertInput('');
      setShowAddCert(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass) {
      setPassNotice('New passwords do not match!');
      return;
    }
    setPassNotice('Password changed successfully!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPassNotice(null), 3000);
  };

  return (
    <div className="space-y-8 font-sans text-zinc-900">
      {/* Profile Header Header */}
      <Card className="p-8 bg-white border-zinc-200 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-3xl object-cover border-2 border-zinc-200 shadow-2xs"
              />
              <a
                href="/profile/edit"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 transition-transform shadow-xs"
                title="Edit profile photo and details"
              >
                <Edit className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-black text-zinc-950 tracking-tight">{currentUser.name}</h1>
                <Badge status={currentUser.workStatus} />
              </div>
              <p className="text-xs font-semibold text-zinc-600">
                {currentUser.jobTitle} &bull; {currentUser.company} ({currentUser.department})
              </p>
              <div className="flex items-center space-x-3 pt-1 text-xs text-zinc-500">
                <span className="font-mono font-bold text-zinc-900">ID: {currentUser.loginId}</span>
                <span>&bull;</span>
                <span>Joined {currentUser.joinedYear}</span>
              </div>
            </div>
          </div>

          <a href="/profile/edit">
            <Button variant="secondary" size="md">
              <Edit className="w-4 h-4 mr-2" />
              <span>Edit Self-Service Profile</span>
            </Button>
          </a>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 space-x-8 overflow-x-auto text-xs font-bold">
        {[
          { key: 'resume', label: 'Resume & Skills', icon: User },
          { key: 'private', label: 'Private Information', icon: Lock },
          { key: 'salary', label: 'Salary Info (Admin Only)', icon: DollarSign },
          { key: 'security', label: 'Security & Verification', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 py-3 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-zinc-950 text-zinc-950 font-black'
                  : 'border-transparent text-zinc-500 hover:text-zinc-950'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: RESUME & SKILLS */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="p-6 space-y-3 bg-white border-zinc-200">
              <h3 className="text-base font-black text-zinc-950">About Employee</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {currentUser.about || 'Senior software engineer dedicated to building scalable enterprise solutions, high-performance web applications, and intuitive user experiences.'}
              </p>
            </Card>

            {/* What I Love About My Job */}
            <Card className="p-6 space-y-3 bg-white border-zinc-200">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <h3 className="text-base font-black text-zinc-950">What I Love About My Job</h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {currentUser.whatILoveAboutJob || 'Solving complex architectural problems, collaborating with cross-functional engineering teams, and shipping production software that users love.'}
              </p>
            </Card>

            {/* My Interests and Hobbies */}
            <Card className="p-6 space-y-3 bg-white border-zinc-200">
              <div className="flex items-center space-x-2">
                <Smile className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-black text-zinc-950">My Interests & Hobbies</h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {currentUser.interests || 'Open-source software contributions, technical blogging, photography, competitive chess, and exploring modern web technology stacks.'}
              </p>
            </Card>

            {/* Skills (+ Add Skill) */}
            <Card className="p-6 space-y-4 bg-white border-zinc-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-zinc-950">Technical Skills</h3>
                <button
                  type="button"
                  onClick={() => setShowAddSkill(!showAddSkill)}
                  className="text-xs font-bold text-zinc-950 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              {showAddSkill && (
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter skill name (e.g. Next.js, GraphQL)"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    className="text-xs"
                  />
                  <Button variant="primary" size="sm" type="submit">
                    Save
                  </Button>
                </form>
              )}

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-900"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Certifications (+ Add Certification) */}
            <Card className="p-6 space-y-4 bg-white border-zinc-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-base font-black text-zinc-950">Certifications</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCert(!showAddCert)}
                  className="text-xs font-bold text-zinc-950 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certification</span>
                </button>
              </div>

              {showAddCert && (
                <form onSubmit={handleAddCert} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter certification title"
                    value={newCertInput}
                    onChange={(e) => setNewCertInput(e.target.value)}
                    className="text-xs"
                  />
                  <Button variant="primary" size="sm" type="submit">
                    Save
                  </Button>
                </form>
              )}

              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div
                    key={cert}
                    className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center space-x-3 text-xs"
                  >
                    <Award className="w-4 h-4 text-zinc-950 flex-shrink-0" />
                    <span className="font-bold text-zinc-950">{cert}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 space-y-4 bg-white border-zinc-200">
              <h3 className="text-base font-black text-zinc-950">Work Details</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Reporting Manager</span>
                  <span className="font-bold text-zinc-950">{currentUser.manager}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Work Email</span>
                  <span className="font-medium text-zinc-950">{currentUser.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Phone Contact</span>
                  <span className="font-medium text-zinc-950">{currentUser.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Employee Code</span>
                  <span className="font-mono font-bold text-zinc-950">{currentUser.loginId}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRIVATE INFORMATION */}
      {activeTab === 'private' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4 bg-white border-zinc-200">
            <h3 className="text-base font-black text-zinc-950">Personal Information</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Date of Birth</span>
                <span className="font-mono font-bold text-zinc-950">{currentUser.dob || '1995-06-15'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Residential Address</span>
                <span className="font-medium text-zinc-950">{currentUser.residingAddress || '42 Silicon Avenue, Tech Park'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Nationality</span>
                <span className="font-medium text-zinc-950">{currentUser.nationality || 'Indian'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Personal Email</span>
                <span className="font-medium text-zinc-950">{currentUser.email}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Gender</span>
                <span className="font-medium text-zinc-950">Male</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Marital Status</span>
                <span className="font-medium text-zinc-950">Single</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 bg-white border-zinc-200">
            <h3 className="text-base font-black text-zinc-950">Bank Account & Tax Details</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Bank Name & Account Number</span>
                <span className="font-mono font-bold text-zinc-950">{bank?.bankName || 'HDFC Bank'} &bull; {bank?.accountNumber || '918237465012'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">IFSC Code</span>
                <span className="font-mono font-bold text-zinc-950">{bank?.ifscCode || 'HDFC0001234'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">PAN Card Number</span>
                <span className="font-mono font-bold text-zinc-950">{bank?.panNo || 'ABCDE1234F'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">UAN Number</span>
                <span className="font-mono font-bold text-zinc-950">{bank?.uanNo || '100987654321'}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: SALARY INFO (ADMIN-ONLY BOUNDARY RULE 45) */}
      {activeTab === 'salary' && (
        <Card className="p-8 space-y-6 bg-white border-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-xl font-black text-zinc-950">Salary Info (Admin / HR Confidential)</h3>
              <p className="text-xs text-zinc-500">Per Rule 45, Salary Info configuration is strictly managed by HR/Admin Officers.</p>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold border border-zinc-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-950" />
              <span>Admin Confidential</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1">
            <p className="font-bold text-zinc-950">Employee Read-Only Structure Summary</p>
            <p className="text-zinc-500">
              For complete payslips and monthly wage statements, navigate to the <a href="/payroll" className="font-bold text-zinc-950 underline">Payroll Module</a>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Gross Wage</span>
              <p className="text-2xl font-black text-zinc-950 font-mono mt-1">₹{sal?.monthWage.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Basic Salary (50%)</span>
              <p className="text-2xl font-black text-zinc-950 font-mono mt-1">₹{sal?.basicSalary.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Estimated Net Salary</span>
              <p className="text-2xl font-black text-zinc-950 font-mono mt-1">
                ₹{((sal?.monthWage || 50000) - (sal?.pfContributionEmployee || 3000) - (sal?.professionalTax || 200)).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: SECURITY & CHANGE PASSWORD */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-8 space-y-6 bg-white border-zinc-200">
            <h3 className="text-xl font-black text-zinc-950">Change Account Password</h3>
            <p className="text-xs text-zinc-500">
              Employees can change their initial system-generated password after first login.
            </p>

            {passNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{passNotice}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <FormField label="Current Password" required>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                />
              </FormField>

              <FormField label="New Password" required>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </FormField>

              <FormField label="Confirm New Password" required>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </FormField>

              <Button variant="primary" size="md" type="submit">
                Update Password
              </Button>
            </form>
          </Card>

          <Card className="p-8 space-y-6 bg-white border-zinc-200">
            <h3 className="text-xl font-black text-zinc-950">Digital Clearance & QR Pass</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="p-3 bg-white rounded-2xl border border-zinc-200">
                <QrCode className="w-24 h-24 text-zinc-950" />
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="text-base font-black text-zinc-950">{currentUser.name}</h4>
                <p className="font-mono font-bold text-zinc-600">ID: {currentUser.loginId}</p>
                <p className="text-zinc-500">Security Clearance Level: Level 2 Employee Pass</p>
                <p className="text-emerald-700 font-bold">Status: Active Verification Pass</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
