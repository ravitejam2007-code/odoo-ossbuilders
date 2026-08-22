import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Employee, WorkStatus } from '../types/api';

export interface AuthContextType {
  currentUser: Employee | null;
  isAuthenticated: boolean;
  checkInTime: string | null;
  login: (emailOrLoginId: string, password?: string, extraData?: Partial<Employee>) => void;
  signup: (data: { name: string; email: string; phone?: string; department?: string; company?: string; password?: string }) => void;
  logout: () => void;
  checkIn: () => void;
  checkOut: () => void;
  updateCurrentUserProfile: (updated: Partial<Employee>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateEmployeeLoginId(name: string, year: number = 2026, sequence: number = 1): string {
  const parts = name.trim().split(/\s+/);
  const firstTwo = (parts[0] || 'EM').substring(0, 2).toUpperCase();
  const lastTwo = (parts[1] || parts[0] || 'PL').substring(0, 2).toUpperCase();
  const nameCode = (firstTwo + lastTwo).padEnd(4, 'X');
  const seqStr = String(sequence).padStart(4, '0');
  return `OI${nameCode}${year}${seqStr}`;
}

export const INITIAL_REGISTERED_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    loginId: 'OIJODO20220001',
    name: 'John Doe',
    email: 'john.doe@odoo.com',
    phone: '+91 98765 43210',
    company: 'Odoo India',
    department: 'Engineering',
    jobTitle: 'Senior Frontend Developer',
    manager: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    workStatus: 'present',
    joinedYear: 2022,
    serialNo: '0001',
    about: 'Senior software engineer dedicated to building scalable enterprise HR solutions.',
    whatILoveAboutJob: 'Solving architectural challenges and shipping clean production apps.',
    interests: ['Open-source', 'Chess', 'Web performance'],
    skills: ['React', 'TypeScript', 'Astro.js', 'Tailwind CSS', 'TanStack Query'],
    certifications: ['Certified Frontend Specialist 2025', 'Agile Engineering Leader'],
    dob: '1995-06-15',
    residingAddress: '42 Silicon Avenue, Tech Park',
    nationality: 'Indian',
    gender: 'Male',
    maritalStatus: 'Single',
    bankDetails: {
      accountNumber: '918237465012',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      panNo: 'ABCDE1234F',
      uanNo: '100987654321',
      empCode: 'OIJODO20220001',
    },
    salaryInfo: {
      monthWage: 50000,
      yearlyWage: 600000,
      basicSalary: 25000,
      houseRentAllowance: 12500,
      standardAllowance: 5000,
      performanceBonus: 5000,
      leaveTravelAllowance: 2500,
      fixedAllowance: 0,
      pfContributionEmployee: 3000,
      pfContributionEmployer: 3000,
      professionalTax: 200,
      noOfWorkingDaysPerWeek: 5,
      breakTimeHours: 1,
    },
  },
  {
    id: 'emp-102',
    loginId: 'OIMAAL20230002',
    name: 'Matt Alice',
    email: 'matt.alice@odoo.com',
    phone: '+91 98765 43211',
    company: 'Odoo India',
    department: 'Design',
    jobTitle: 'Lead Product Designer',
    manager: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    workStatus: 'present',
    joinedYear: 2023,
    serialNo: '0002',
  },
  {
    id: 'emp-103',
    loginId: 'OIRASM20240003',
    name: 'Rachel Smith',
    email: 'rachel.smith@odoo.com',
    phone: '+91 98765 43212',
    company: 'Odoo India',
    department: 'Human Resources',
    jobTitle: 'HR Specialist',
    manager: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    workStatus: 'on_leave',
    joinedYear: 2024,
    serialNo: '0003',
  },
];

function getRegisteredEmployees(): Employee[] {
  if (typeof window === 'undefined') return INITIAL_REGISTERED_EMPLOYEES;
  const raw = localStorage.getItem('dayflow_registered_employees');
  if (!raw) {
    localStorage.setItem('dayflow_registered_employees', JSON.stringify(INITIAL_REGISTERED_EMPLOYEES));
    return INITIAL_REGISTERED_EMPLOYEES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_REGISTERED_EMPLOYEES;
  }
}

function saveRegisteredEmployees(list: Employee[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dayflow_registered_employees', JSON.stringify(list));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [checkInTime, setCheckInTime] = useState<string | null>('09:12 AM');

  useEffect(() => {
    // 1. Check for existing active session
    const saved = localStorage.getItem('dayflow_employee_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        return;
      } catch (e) {
        console.error('Failed to parse employee session', e);
      }
    }

    // 2. Default to first registered employee if no session
    const all = getRegisteredEmployees();
    const defaultUser = all[0] || INITIAL_REGISTERED_EMPLOYEES[0];
    setCurrentUser(defaultUser);
    localStorage.setItem('dayflow_employee_user', JSON.stringify(defaultUser));
  }, []);

  const signup = (data: { name: string; email: string; phone?: string; department?: string; company?: string; password?: string }) => {
    const all = getRegisteredEmployees();
    const loginId = generateEmployeeLoginId(data.name, 2026, all.length + 1);
    
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      loginId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || '+91 98765 43210',
      company: data.company?.trim() || 'Odoo India',
      department: data.department?.trim() || 'Engineering',
      jobTitle: 'Frontend Developer',
      manager: 'Sarah Jenkins',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      workStatus: 'present',
      joinedYear: 2026,
      serialNo: String(all.length + 1).padStart(4, '0'),
      about: `Hello! I'm ${data.name.trim()}, working in ${data.department || 'Engineering'}.`,
      whatILoveAboutJob: 'Building intuitive enterprise software and collaborating with the team.',
      interests: ['Technology', 'Product Design', 'Problem Solving'],
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Frontend Engineering'],
      certifications: ['Certified Software Specialist'],
      dob: '1996-05-20',
      residingAddress: '42 Silicon Avenue, Tech Park',
      nationality: 'Indian',
      gender: 'Other',
      maritalStatus: 'Single',
      bankDetails: {
        accountNumber: '918237465012',
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0001234',
        panNo: 'ABCDE1234F',
        uanNo: '100987654321',
        empCode: loginId,
      },
      salaryInfo: {
        monthWage: 50000,
        yearlyWage: 600000,
        basicSalary: 25000,
        houseRentAllowance: 12500,
        standardAllowance: 5000,
        performanceBonus: 5000,
        leaveTravelAllowance: 2500,
        fixedAllowance: 0,
        pfContributionEmployee: 3000,
        pfContributionEmployer: 3000,
        professionalTax: 200,
        noOfWorkingDaysPerWeek: 5,
        breakTimeHours: 1,
      },
    };

    const updatedList = [newEmp, ...all.filter(e => e.email !== newEmp.email && e.loginId !== newEmp.loginId)];
    saveRegisteredEmployees(updatedList);

    setCurrentUser(newEmp);
    localStorage.setItem('dayflow_employee_user', JSON.stringify(newEmp));
  };

  const login = (emailOrLoginId: string, password?: string, extraData?: Partial<Employee>) => {
    const input = emailOrLoginId.trim().toLowerCase();
    const all = getRegisteredEmployees();
    
    // Look for exact match by email, loginId, or name
    let found = all.find(
      (e) =>
        e.email.toLowerCase() === input ||
        e.loginId.toLowerCase() === input ||
        e.name.toLowerCase() === input
    );

    if (!found) {
      // If extra signup data was passed or new user
      const name = extraData?.name?.trim() || emailOrLoginId.split('@')[0].replace(/[._]/g, ' ') || 'Employee';
      const formattedName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      const loginId = extraData?.loginId || generateEmployeeLoginId(formattedName, 2026, all.length + 1);

      found = {
        id: `emp-${Date.now()}`,
        loginId,
        name: formattedName,
        email: emailOrLoginId.includes('@') ? emailOrLoginId.trim() : `${input}@odoo.com`,
        phone: extraData?.phone || '+91 98765 43210',
        company: extraData?.company || 'Odoo India',
        department: extraData?.department || 'Engineering',
        jobTitle: extraData?.jobTitle || 'Frontend Developer',
        manager: 'Sarah Jenkins',
        avatar: extraData?.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
        workStatus: 'present',
        joinedYear: 2026,
        serialNo: String(all.length + 1).padStart(4, '0'),
        about: `Hello, I'm ${formattedName}.`,
        whatILoveAboutJob: 'Building reliable applications with high design standards.',
        interests: ['Development', 'Open-source'],
        skills: ['React', 'TypeScript', 'Web Apps'],
        certifications: ['Certified Engineer'],
        dob: '1995-06-15',
        residingAddress: '42 Silicon Avenue, Tech Park',
        nationality: 'Indian',
        gender: 'Male',
        maritalStatus: 'Single',
        bankDetails: {
          accountNumber: '918237465012',
          bankName: 'HDFC Bank',
          ifscCode: 'HDFC0001234',
          panNo: 'ABCDE1234F',
          uanNo: '100987654321',
          empCode: loginId,
        },
        salaryInfo: {
          monthWage: 50000,
          yearlyWage: 600000,
          basicSalary: 25000,
          houseRentAllowance: 12500,
          standardAllowance: 5000,
          performanceBonus: 5000,
          leaveTravelAllowance: 2500,
          fixedAllowance: 0,
          pfContributionEmployee: 3000,
          pfContributionEmployer: 3000,
          professionalTax: 200,
          noOfWorkingDaysPerWeek: 5,
          breakTimeHours: 1,
        },
        ...extraData,
      };

      const updatedList = [found, ...all];
      saveRegisteredEmployees(updatedList);
    }

    setCurrentUser(found);
    localStorage.setItem('dayflow_employee_user', JSON.stringify(found));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dayflow_employee_user');
  };

  const checkIn = () => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(timeStr);
    const updated = { ...currentUser, workStatus: 'present' as WorkStatus };
    setCurrentUser(updated);
    localStorage.setItem('dayflow_employee_user', JSON.stringify(updated));

    // Also update in registered list
    const all = getRegisteredEmployees();
    saveRegisteredEmployees(all.map(e => e.id === updated.id ? updated : e));
  };

  const checkOut = () => {
    if (!currentUser) return;
    setCheckInTime(null);
    const updated = { ...currentUser, workStatus: 'absent' as WorkStatus };
    setCurrentUser(updated);
    localStorage.setItem('dayflow_employee_user', JSON.stringify(updated));

    // Also update in registered list
    const all = getRegisteredEmployees();
    saveRegisteredEmployees(all.map(e => e.id === updated.id ? updated : e));
  };

  const updateCurrentUserProfile = (updated: Partial<Employee>) => {
    if (!currentUser) return;
    const newProfile = { ...currentUser, ...updated };
    setCurrentUser(newProfile);
    localStorage.setItem('dayflow_employee_user', JSON.stringify(newProfile));

    // Update in registered employees list so it persists permanently
    const all = getRegisteredEmployees();
    saveRegisteredEmployees(all.map(e => e.id === newProfile.id ? newProfile : e));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        checkInTime,
        login,
        signup,
        logout,
        checkIn,
        checkOut,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
