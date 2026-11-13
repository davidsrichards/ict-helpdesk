import Link from 'next/link';
import { getUser, getProfile } from '@/lib/supabase/auth';
import { getUnreadCount } from '@/lib/actions/notifications';
import { NotificationBell } from '@/components/features/notifications/NotificationBell';
import { createServerClient } from '@/lib/supabase/server';
import { MobileMenu } from './MobileMenu';
import { TopNavLinks } from './TopNavLinks';
import { UserMenu } from './UserMenu';
import { APP_NAME, BrandLogo } from '@/components/brand/BrandLogo';

export default async function NavBar() {
  const user = await getUser();
  const profile = user ? await getProfile() : null;
  const unreadCount = user ? await getUnreadCount() : 0;

  // Check KB visibility
  const supabase = await createServerClient();
  const { data: kbSetting } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'kb_visible')
    .single();
  const kbVisible = kbSetting?.value === 'true';

  const displayName = profile?.display_name || user?.email || '';
  const isAgent = profile && ['agent', 'admin'].includes(profile.role);
  const isAdmin = profile && profile.role === 'admin';

  // Build nav links for both desktop and mobile (top-level navigation bar)
  const navLinks: { href: string; label: string }[] = [];
  if (user) navLinks.push({ href: '/', label: 'Dashboard' });
  // Regular users see "My Tickets" in top nav; agents/admins get it in the user menu instead
  if (user && !isAgent) navLinks.push({ href: '/tickets', label: 'My Tickets' });
  if (isAgent) {
    navLinks.push({ href: '/agent', label: 'Agent Dashboard' });
  }
  if (isAdmin) navLinks.push({ href: '/admin', label: 'Admin Settings' });
  if (kbVisible) navLinks.push({ href: '/help', label: 'Help Center' });
  if (isAgent) {
    navLinks.push({ href: '/kb/manage', label: 'Manage Articles' });
  }

  // Build user menu links (inside the dropdown)
  const userMenuLinks: { href: string; label: string }[] = [];
  // Agents/admins: My Tickets, Reports, Canned Responses
  if (isAgent) {
    userMenuLinks.push({ href: '/tickets', label: 'My Tickets' });
    userMenuLinks.push({ href: '/reports', label: 'Reports' });
    userMenuLinks.push({ href: '/canned-responses', label: 'Canned Responses' });
  }
  // All users: Profile, Notification Settings
  userMenuLinks.push({ href: '/profile', label: 'Profile' });
  userMenuLinks.push({ href: '/notification-settings', label: 'Notification Settings' });

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-gold-400 bg-white shadow-sm">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6" aria-label="Main navigation">
        <div className="flex items-center gap-2 sm:gap-6">
          <MobileMenu
            links={navLinks}
            userLinks={user ? userMenuLinks : []}
            displayName={displayName}
            role={profile?.role ?? null}
          />
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <BrandLogo size={40} priority />
            <span className="leading-tight">
              <span className="block text-base font-bold text-blue-800">NSUK</span>
              <span className="block text-xs font-medium text-gray-600">{APP_NAME}</span>
            </span>
          </Link>
          <TopNavLinks links={navLinks} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <NotificationBell initialUnreadCount={unreadCount} userId={user.id} />
              <div className="hidden sm:flex items-center gap-2">
                <UserMenu
                  displayName={displayName}
                  role={profile?.role ?? null}
                  links={userMenuLinks}
                />
              </div>
            </>
          ) : (
            <a
              href="/login"
              className="flex min-h-10 items-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Sign in
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
