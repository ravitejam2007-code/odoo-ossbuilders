import React from 'react';
import { User, ArrowRight, Building2, Phone } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Employee } from '../../types/api';

export interface ProfileQuickCardProps {
  employee: Employee;
  className?: string;
}

export const ProfileQuickCard: React.FC<ProfileQuickCardProps> = ({ employee, className = '' }) => {
  return (
    <Card className={`p-6 flex flex-col justify-between space-y-4 bg-white border border-zinc-200 ${className}`}>
      <div className="flex items-center space-x-3.5">
        <img
          src={employee.avatar}
          alt={employee.name}
          className="w-12 h-12 rounded-2xl object-cover border border-zinc-200 shadow-2xs"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-black text-zinc-950 truncate tracking-tight">{employee.name}</h4>
          <p className="text-xs font-semibold text-zinc-500 truncate">{employee.jobTitle}</p>
          <p className="text-[10px] font-mono font-bold text-zinc-400">{employee.loginId}</p>
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 font-medium">Department:</span>
          <span className="font-bold text-zinc-950">{employee.department}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 font-medium">Manager:</span>
          <span className="font-bold text-zinc-950">{employee.manager}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-medium">Employee details & settings</span>
        <a href="/profile" className="font-bold text-zinc-950 hover:underline flex items-center gap-1">
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
