import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// DESIGN-meta tech-specs-table:
// - header: surface-soft bg, body-sm-bold, steel text
// - rows: canvas bg, 1px hairline-soft separator
// - cell text: body-sm, ink
// - rounded: lg (8px) for the container

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({ className, children, ...props }) => (
  <div className="w-full overflow-x-auto rounded-[8px]">
    <table
      className={twMerge(clsx('w-full border-collapse text-[14px] leading-[1.43] tracking-[-0.14px]', className))}
      {...props}
    >
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <thead
    className={twMerge(clsx('bg-[#f1f4f7]', className))}
    {...props}
  >
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <tbody className={twMerge(clsx('bg-[#ffffff] divide-y divide-[#dee3e9]', className))} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className, children, ...props }) => (
  <tr
    className={twMerge(clsx('border-b border-[#dee3e9] last:border-b-0', className))}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  // DESIGN-meta: body-sm-bold (14px/700), steel (#5d6c7b) color
  <th
    className={twMerge(
      clsx(
        'px-4 py-3 text-left',
        'text-[12px] font-bold leading-[1.33] tracking-[0.02em] uppercase',
        'text-[#5d6c7b]',
        'whitespace-nowrap',
        className
      )
    )}
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  // DESIGN-meta: body-sm (14px/400), ink (#1c1e21) color
  <td
    className={twMerge(
      clsx(
        'px-4 py-3',
        'text-[14px] font-normal leading-[1.43] tracking-[-0.14px]',
        'text-[#1c1e21]',
        'align-middle',
        className
      )
    )}
    {...props}
  >
    {children}
  </td>
);
