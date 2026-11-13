'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';
import { ADMIN_GROUPS } from './admin-nav';

function Icon({ d }: { d: string }) {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const filterId = useId();
  const navId = useId();

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ADMIN_GROUPS;
    return ADMIN_GROUPS.map((g) => ({
      ...g,
      links: g.links.filter((l) => l.label.toLowerCase().includes(q)),
    })).filter((g) => g.links.length > 0);
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 pb-2">
        <Link
          href="/admin"
          onClick={onNavigate}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
            pathname === '/admin' ? 'bg-blue-700 text-white' : 'text-gray-800 hover:bg-gray-100'
          }`}
        >
          <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          Overview
        </Link>
        <label htmlFor={filterId} className="sr-only">
          Filter settings
        </label>
        <input
          id={filterId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search settings…"
          aria-controls={navId}
          className="mt-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
        />
      </div>

      <div id={navId} className="flex-1 space-y-5 overflow-y-auto px-4 pb-6 pt-2">
        {groups.length === 0 ? (
          <p className="px-3 py-2 text-sm text-gray-500">No matches.</p>
        ) : (
          groups.map((group) => (
            <section key={group.heading} aria-label={group.heading}>
              <h3 className="mb-1.5 flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <Icon d={group.icon} />
                {group.heading}
              </h3>
              <ul className="space-y-0.5">
                {group.links.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(link.href + '/');
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={`block rounded-lg border-l-2 px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          active
                            ? 'border-gold-500 bg-blue-50 font-medium text-blue-800'
                            : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const current = ADMIN_GROUPS.flatMap((g) => g.links).find(
    (l) => pathname === l.href || pathname.startsWith(l.href + '/'),
  );

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 mb-4 flex items-center gap-3 border-b border-gray-200 bg-white/95 px-4 sm:px-6 py-2.5 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-expanded={open}
          aria-controls="admin-drawer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
          </svg>
          Admin menu
        </button>
        <span className="truncate text-sm font-semibold text-gray-900">{current?.label ?? 'Overview'}</span>
      </div>

      <aside
        className="sticky top-24 hidden h-[calc(100vh-8rem)] w-64 shrink-0 self-start overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:block"
        aria-label="Admin navigation"
      >
        <NavContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div id="admin-drawer" className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <span className="text-sm font-semibold text-gray-900">Admin settings</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Close admin menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <NavContent onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
