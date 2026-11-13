import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { ADMIN_GROUPS } from './admin-nav';

export default async function AdminPage() {
  const supabase = await createServerClient();
  const head = { count: 'exact' as const, head: true };
  const [users, agents, open, unassigned] = await Promise.all([
    supabase.from('profiles').select('id', head),
    supabase.from('profiles').select('id', head).in('role', ['agent', 'admin']),
    supabase.from('tickets').select('id', head).eq('status', 'open'),
    supabase.from('tickets').select('id', head).eq('status', 'open').is('assigned_agent_id', null),
  ]);
  const stats = [
    { label: 'Registered users', value: users.count ?? 0, href: '/admin/users' },
    { label: 'Agents & admins', value: agents.count ?? 0, href: '/admin/agents' },
    { label: 'Open tickets', value: open.count ?? 0, href: '/agent' },
    { label: 'Unassigned', value: unassigned.count ?? 0, href: '/agent' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="mt-1 text-sm text-gray-600">Configure how the NSUK ICT Helpdesk works.</p>
      </div>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-blue-700">{stat.value}</p>
          </Link>
        ))}
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
