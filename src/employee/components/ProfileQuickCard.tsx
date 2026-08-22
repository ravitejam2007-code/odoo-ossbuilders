import React from 'react';
import type { Employee } from '../types/api';
import { Card } from '../../shared/Card';
import { Badge } from '../../shared/Badge';
import { ArrowRight, User } from 'lucide-react';

export const ProfileQuickCard: React.FC<{ employee: Employee }> = ({ employee }) => {
  return (
    <Card className="p-5 bg-white border-zinc-200 flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={employee.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
            alt={employee.name || 'Employee'}
            className="w-12 h-12 rounded-xl object-cover border border-zinc-200"
          />
          <div className="min-w-0">
            <h3 className="text-base font-bold text-zinc-950 truncate">{employee.name}</h3>
            <p className="text-xs text-zinc-500 truncate">{employee.jobTitle}</p>
            <p className="text-[10px] text-zinc-400 font-mono truncate">{employee.loginId}</p>
          </div>
        </div>
        <Badge status={employee.workStatus} />
      </div>

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-medium">{employee.department}</span>
        <a href="/profile" className="font-bold text-zinc-950 hover:underline inline-flex items-center gap-1">
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
