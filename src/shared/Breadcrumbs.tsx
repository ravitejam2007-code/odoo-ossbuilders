import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  // DESIGN-meta: breadcrumb uses body-sm (14px), steel for parents, ink for active leaf
  <nav aria-label="Breadcrumb">
    <ol className="flex items-center gap-1 flex-wrap">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-[#8595a4] flex-shrink-0" aria-hidden="true" />
            )}
            {isLast ? (
              <span className="text-[14px] font-normal leading-[1.43] tracking-[-0.14px] text-[#1c1e21]">
                {item.label}
              </span>
            ) : (
              <a
                href={item.href || '#'}
                className="text-[14px] font-normal leading-[1.43] tracking-[-0.14px] text-[#5d6c7b] hover:text-[#1c1e21] transition-colors duration-150"
              >
                {item.label}
              </a>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
