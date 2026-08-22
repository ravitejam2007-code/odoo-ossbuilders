import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrentUser, useUpdateProfileMutation } from '../hooks/useEmployeeData';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { FormField, Input, Textarea, Select } from '../../shared/FormField';
import { ArrowLeft, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

export const ProfileEditView: React.FC = () => {
  const { currentUser: authUser } = useAuth();
  const { data: profileUser } = useCurrentUser();
  const updateProfileMutation = useUpdateProfileMutation();

  const currentUser = profileUser || authUser;

  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [residingAddress, setResidingAddress] = useState(currentUser?.residingAddress || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [about, setAbout] = useState(currentUser?.about || '');
  const [interests, setInterests] = useState(currentUser?.interests?.join(', ') || '');
  const [whatILove, setWhatILove] = useState(currentUser?.whatILoveAboutJob || '');
  const [dob, setDob] = useState(currentUser?.dob || '');
  const [nationality, setNationality] = useState(currentUser?.nationality || 'Indian');
  const [gender, setGender] = useState(currentUser?.gender || 'Male');
  const [maritalStatus, setMaritalStatus] = useState(currentUser?.maritalStatus || 'Single');

  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await updateProfileMutation.mutateAsync({
        phone: phone.trim(),
        avatar: avatar.trim() || currentUser.avatar,
        residingAddress: residingAddress.trim(),
        about: about.trim(),
        whatILoveAboutJob: whatILove.trim(),
        interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
        dob: dob || undefined,
        nationality: nationality.trim(),
        gender: gender.trim(),
        maritalStatus: maritalStatus.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/profile';
        }
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile. Please check your entries.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-[#1c1e21]">
      <div className="flex items-center justify-between">
        <a href="/profile" className="inline-flex items-center text-[13px] font-semibold text-[#0a1317] hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Profile</span>
        </a>
        <span className="text-[12px] font-semibold text-[#8595a4] uppercase tracking-wider">Employee Self-Service</span>
      </div>

      <Card variant="feature" className="p-6 space-y-6">
        <div className="border-b border-[#dee3e9] pb-4">
          <h1 className="text-[22px] font-semibold text-[#0a1317] tracking-tight">Edit Profile Information</h1>
          <p className="text-[13px] text-[#5d6c7b] mt-0.5">
            Update personal contact, address, avatar, and background details.
          </p>
        </div>

        {success && (
          <div className="p-3.5 rounded-[12px] bg-[#e6f4ea] border border-[#31a24c]/30 text-[13px] text-[#1a7f3c] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#31a24c] flex-shrink-0" />
            <span>Profile updated successfully! Redirecting to profile...</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-[12px] bg-[#fde8ec] border border-[#f0284a]/20 text-[13px] text-[#c0122e] font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#e41e3f] flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Read-only HR Governed Fields Banner */}
        <div className="p-4 rounded-[12px] bg-[#f1f4f7] border border-[#dee3e9] space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#5d6c7b]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d6c7b]">
              Administrative Fields (Read-Only)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[12px]">
            <div>
              <span className="text-[#8595a4] block">Full Name:</span>
              <span className="font-bold text-[#0a1317]">{currentUser.name}</span>
            </div>
            <div>
              <span className="text-[#8595a4] block">Login ID:</span>
              <span className="font-mono font-bold text-[#0a1317]">{currentUser.loginId}</span>
            </div>
            <div>
              <span className="text-[#8595a4] block">Work Email:</span>
              <span className="font-medium text-[#0a1317] truncate block">{currentUser.email}</span>
            </div>
            <div>
              <span className="text-[#8595a4] block">Department:</span>
              <span className="font-medium text-[#0a1317]">{currentUser.department}</span>
            </div>
            <div>
              <span className="text-[#8595a4] block">Job Title:</span>
              <span className="font-medium text-[#0a1317]">{currentUser.jobTitle}</span>
            </div>
            <div>
              <span className="text-[#8595a4] block">Company:</span>
              <span className="font-medium text-[#0a1317]">{currentUser.company}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Phone Contact">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </FormField>

            <FormField label="Avatar Image URL">
              <Input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Date of Birth">
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </FormField>

            <FormField label="Nationality">
              <Input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Indian"
              />
            </FormField>

            <FormField label="Gender">
              <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Residing Address">
            <Input
              type="text"
              value={residingAddress}
              onChange={(e) => setResidingAddress(e.target.value)}
              placeholder="Building, Street, City, State, ZIP"
            />
          </FormField>

          <FormField label="About Me (Bio)">
            <Textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Brief summary about yourself..."
            />
          </FormField>

          <FormField label="What I Love About My Job">
            <Input
              type="text"
              value={whatILove}
              onChange={(e) => setWhatILove(e.target.value)}
              placeholder="What motivates you at work..."
            />
          </FormField>

          <FormField label="Interests & Hobbies (Comma-separated)">
            <Input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Open Source, Chess, UI Design, Cycling"
            />
          </FormField>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#dee3e9]">
            <a href="/profile">
              <Button variant="ghost" size="sm" type="button">
                Cancel
              </Button>
            </a>
            <Button variant="primary" size="md" type="submit" loading={updateProfileMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
