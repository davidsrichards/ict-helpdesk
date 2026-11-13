'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isActivePath } from './nav-utils';
import { signOut } from '@/lib/actions/auth';
import { notifyPopupOpened, subscribeToOtherPopups } from '@/lib/utils/popup-coordinator';

const POPUP_ID = 'mobile-menu';

type MenuLink = { href: string; label: string };

interface MobileMenuProps {
  links: MenuLink[];
  userLinks?: MenuLink[];
  displayName?: string;
  role?: string | null;
}

export function MobileMenu({ links, userLinks = [], displayName, role }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    return subscribeToOtherPopups(POPUP_ID, () => setOpen(false));
  }, []);

  function handleToggle() {
    setOpen((prev) => {
      const next = !prev;
      if (next) notifyPopupOpened(POPUP_ID);
      return next;
    });
  }

  const linkClass = (active: boolean) =>
    `block px-4 py-3 min-h-[44px] text-sm focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 focus-visible:outline-none ${
      active ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <div ref={menuRef} className="md:hidden">
      <button
        type="button"
        onClick={handleToggle}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {open && (
        <nav
          id="mobile-nav-menu"
          className="absolute left-0 right-0 top-full z-50 max-h-[80vh] overflow-y-auto border-b border-gray-200 bg-white py-2 shadow-lg"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col">
            {links.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={linkClass(active)}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {userLinks.length > 0 && (
            <div className="mt-2 border-t border-gray-100 pt-2">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {displayName}
                {role && role !== 'user' ? ` · ${role}` : ''}
              </p>
              <ul className="flex flex-col">
                {userLinks.map((link) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={linkClass(active)}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <form action={signOut}>
                    <button type="submit" className={`w-full text-left ${linkClass(false)}`}>
                      Sign out
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          )}
        </nav>
      )}
    </div>
  );
}
