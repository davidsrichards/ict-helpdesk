import Link from 'next/link';
import { ADMIN_GROUPS } from './admin-nav';

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="mt-1 text-sm text-gray-600">Configure how the NSUK ICT Helpdesk works.</p>
      </div>
      <div className="space-y-8">
        {ADMIN_GROUPS.map((group) => (
          <section key={group.heading} aria-label={group.heading}>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={group.icon} />
              </svg>
              {group.heading}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700">{link.label}</p>
                  <p className="mt-1 text-sm text-gray-600">{link.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
