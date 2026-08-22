import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FormField, Input, Textarea } from '../ui/FormField';
import { CheckCircle2, ArrowLeft, Lock } from 'lucide-react';

export const ProfileEditView: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  if (!currentUser) return null;

  // Permitted editable fields
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [residingAddress, setResidingAddress] = useState(currentUser.residingAddress || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || '');
  const [about, setAbout] = useState(currentUser.about || '');

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    updateProfile({
      phone,
      residingAddress,
      avatar: avatarUrl,
      about,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-zinc-900">
      <div className="flex items-center justify-between">
        <a href="/profile" className="inline-flex items-center text-xs font-bold text-zinc-950 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Profile</span>
        </a>
        <span className="text-xs text-zinc-500 font-bold">Self-Service Profile Edit</span>
      </div>

      <Card className="p-8 space-y-6 bg-white border-zinc-200 shadow-2xs">
        <div className="border-b border-zinc-100 pb-4">
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">Edit Profile Details</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Update self-service fields permitted under Dayflow HRMS security policy.
          </p>
        </div>

        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Profile changes saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Read-Only System Details Notice */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs text-zinc-600">
            <div className="flex items-center space-x-1.5 font-bold text-zinc-950">
              <Lock className="w-4 h-4 text-zinc-950" />
              <span>Restricted System Fields (Read-Only)</span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Name, Email, Manager, Designation, and Salary structure are managed by HR. Contact your administrator to request updates to system fields.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name (Read-Only)">
              <Input type="text" disabled value={currentUser.name} className="bg-zinc-100 font-bold text-zinc-500" />
            </FormField>

            <FormField label="Login ID (Read-Only)">
              <Input type="text" disabled value={currentUser.loginId} className="bg-zinc-100 font-mono font-bold text-zinc-500" />
            </FormField>
          </div>

          {/* EDITABLE FIELD: Phone */}
          <FormField label="Phone Contact Number" required>
            <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormField>

          {/* EDITABLE FIELD: Avatar URL */}
          <FormField label="Profile Picture Avatar URL">
            <Input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </FormField>

          {/* EDITABLE FIELD: Residing Address */}
          <FormField label="Residing Address">
            <Textarea value={residingAddress} onChange={(e) => setResidingAddress(e.target.value)} />
          </FormField>

          {/* EDITABLE FIELD: About */}
          <FormField label="Professional Bio / About">
            <Textarea value={about} onChange={(e) => setAbout(e.target.value)} />
          </FormField>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-zinc-100">
            <a href="/profile">
              <Button variant="ghost" size="md" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </a>
            <Button variant="primary" size="md" type="submit" loading={isSubmitting} disabled={isSubmitting}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
