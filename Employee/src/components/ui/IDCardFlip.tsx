import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, RotateCw } from 'lucide-react';
import type { Employee } from '../../types/api';
import { Badge } from './Badge';

export interface IDCardFlipProps {
  employee: Employee;
  onClick?: () => void;
}

export const IDCardFlip: React.FC<IDCardFlipProps> = ({ employee, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      onClick={onClick}
      className="relative w-full h-[240px] perspective-1000 cursor-pointer group select-none"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full transform-style-3d relative"
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-zinc-200 p-5 flex flex-col justify-between shadow-2xs backface-hidden group-hover:border-zinc-300 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                D
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">{employee.company}</h4>
                <p className="text-[10px] text-zinc-400 font-mono">{employee.loginId}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFlip}
              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-950 transition-colors"
              title="Flip card"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-3.5 my-1">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-14 h-14 rounded-xl object-cover border border-zinc-200"
            />
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-sm font-bold text-zinc-950 truncate">{employee.name}</h3>
              <p className="text-xs text-zinc-600 truncate">{employee.jobTitle}</p>
              <p className="text-[11px] text-zinc-400 truncate">{employee.department}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 text-xs">
            <span className="text-zinc-500 font-medium">{employee.manager}</span>
            <Badge status={employee.workStatus} />
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-2xl bg-zinc-950 text-white p-5 flex flex-col justify-between shadow-2xs backface-hidden rotate-y-180">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{employee.loginId}</span>
            <button
              type="button"
              onClick={handleFlip}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Flip back"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-3.5 my-1">
            <div className="p-2 bg-white rounded-xl flex-shrink-0">
              <QrCode className="w-14 h-14 text-zinc-950" />
            </div>
            <div className="space-y-1 text-xs text-zinc-300 min-w-0">
              <p className="font-bold text-white truncate">{employee.name}</p>
              <p className="text-[11px] text-zinc-400 truncate">{employee.email}</p>
              <p className="text-[11px] text-zinc-400">{employee.phone}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800 text-[10px] text-zinc-400">
            <span>{employee.department}</span>
            <span className="font-mono text-zinc-300">{employee.company}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
