import Link from 'next/link';
import { getProfile, requireAuth } from '@/lib/supabase/auth';
import { createServerClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';
import { INSTITUTION_NAME } from '@/components/brand/BrandLogo';

type Stat = { label: string; value: number; href: string; tone: string };
type Action = { label: string; description: string; href: string; primary?: boolean };

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function HomePage() {
  const user = await requireAuth();
  const profile = await getProfile();
  const supabase = await createServerClient();

  const role = profile?.role ?? 'user';
  const isAgent = role === 'agent' || role === 'admin';
  const isAdmin = role === 'admin';
  const displayName = profile?.display_name || user.email?.split('@')[0] || 'there';

  const count = async (build: (q: ReturnType<typeof base>) => ReturnType<typeof base>) => {
    const { count: c } = await build(base());
    return c ?? 0;
  };
  function base() {
    return supabase.from('tickets').select('id', { count: 'exact', head: true });
  }

  const [mine, mineOpen, minePending, mineClosed, allOpen, allPending, unassigned, assignedToMe, kbSetting, recent] =
    await Promise.all([
      count((q) => q.eq('creator_id', user.id)),
      count((q) => q.eq('creator_id', user.id).eq('status', 'open')),
      count((q) => q.eq('creator_id', user.id).eq('status', 'pending')),
      count((q) => q.eq('creator_id', user.id).eq('status', 'closed')),
      isAgent ? count((q) => q.eq('status', 'open')) : Promise.resolve(0),
      isAgent ? count((q) => q.eq('status', 'pending')) : Promise.resolve(0),
      isAgent ? count((q) => q.eq('status', 'open').is('assigned_agent_id', null)) : Promise.resolve(0),
      isAgent ? count((q) => q.eq('assigned_agent_id', user.id).neq('status', 'closed')) : Promise.resolve(0),
      supabase.from('app_settings').select('value').eq('key', 'kb_visible').single(),
      (isAgent
        ? supabase.from('tickets').select('id, title, slug, status, urgency, updated_at')
        : supabase.from('tickets').select('id, title, slug, status, urgency, updated_at').eq('creator_id', user.id)
      )
        .order('updated_at', { ascending: false })
        .limit(6),
    ]);

  const kbVisible = kbSetting.data?.value === 'true';
  const recentTickets = recent.data ?? [];

  const myStats: Stat[] = [
    { label: 'My tickets', value: mine, href: '/tickets', tone: 'text-blue-700' },
    { label: 'Open', value: mineOpen, href: '/tickets?status=active', tone: 'text-green-600' },
    { label: 'Pending', value: minePending, href: '/tickets?status=active', tone: 'text-amber-600' },
    { label: 'Resolved / closed', value: mineClosed, href: '/tickets?status=closed', tone: 'text-gray-600' },
  ];
  const staffStats: Stat[] = [
    { label: 'Open tickets', value: allOpen, href: '/agent', tone: 'text-green-600' },
    { label: 'Pending', value: allPending, href: '/agent', tone: 'text-amber-600' },
    { label: 'Unassigned', value: unassigned, href: '/agent', tone: 'text-red-600' },
    { label: 'Assigned to me', value: assignedToMe, href: '/agent', tone: 'text-blue-700' },
  ];
  const stats = isAgent ? staffStats : myStats;

  const actions: Action[] = [
    { label: 'Report an issue', description: 'Submit a new ICT support request', href: '/tickets/new', primary: true },
    { label: 'My tickets', description: 'Follow the progress of your requests', href: '/tickets' },
  ];
  if (kbVisible) actions.push({ label: 'Help Center', description: 'Find answers and how-to guides', href: '/help' });
  if (isAgent) {
    actions.push({ label: 'Agent dashboard', description: 'Work through the ticket queue', href: '/agent' });
    actions.push({ label: 'Reports', description: 'Volume, SLA and satisfaction metrics', href: '/reports' });
  }
  if (isAdmin) actions.push({ label: 'Admin settings', description: 'Users, teams, SLAs and more', href: '/admin' });
  actions.push({ label: 'My profile', description: 'Update your name and password', href: '/profile' });

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 px-6 py-8 text-white shadow-sm sm:px-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-gold-400/10" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gold-300">{today}</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {greeting()}, {displayName}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-blue-100">
              {isAgent
                ? `Here is what is happening on the ${INSTITUTION_NAME} ICT helpdesk right now.`
                : `Welcome to the ${INSTITUTION_NAME} ICT helpdesk. Tell us what is wrong and we will get it fixed.`}
            </p>
          </div>
          <Link
            href="/tickets/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gold-400 px-5 text-sm font-semibold text-blue-950 shadow hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New ticket
          </Link>
        </div>
      </section>

      <section aria-label="Ticket summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:p-5"
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold ${stat.tone}`}>{stat.value}</p>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2" aria-labelledby="recent-heading">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 id="recent-heading" className="font-semibold text-gray-900">
              {isAgent ? 'Recently updated tickets' : 'My recent tickets'}
            </h2>
            <Link href={isAgent ? '/agent' : '/tickets'} className="text-sm font-medium text-blue-700 hover:underline">
              View all
            </Link>
          </div>
          {recentTickets.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-gray-600">You have not submitted any tickets yet.</p>
              <Link
                href="/tickets/new"
                className="mt-4 inline-flex rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Create your first ticket
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentTickets.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/tickets/${t.id}/${t.slug}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        <span className="text-gray-500">#{t.id}</span> {t.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">Updated {timeAgo(t.updated_at)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="hidden sm:inline-flex">
                        <Badge variant="priority" value={t.urgency} />
                      </span>
                      <Badge variant="status" value={t.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="actions-heading">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 id="actions-heading" className="font-semibold text-gray-900">
              Quick actions
            </h2>
          </div>
          <ul className="space-y-1 p-3">
            {actions.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className={`block rounded-lg px-3 py-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    a.primary ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className={`text-sm font-medium ${a.primary ? 'text-blue-800' : 'text-gray-900'}`}>{a.label}</p>
                  <p className="text-xs text-gray-500">{a.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
