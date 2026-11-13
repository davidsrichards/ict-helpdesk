'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isActivePath } from './nav-utils';

type NavLink = {
  href: string;
  label: string;
};

export function TopNavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center gap-1">
      {links.map((link) => {
        const isActive = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
              isActive
                ? 'bg-blue-50 font-semibold text-blue-800'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
