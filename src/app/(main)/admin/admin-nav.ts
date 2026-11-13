export type AdminLink = { label: string; href: string; description: string };
export type AdminGroup = { heading: string; icon: string; links: AdminLink[] };

export const ADMIN_GROUPS: AdminGroup[] = [
  {
    heading: 'Ticket Structure',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    links: [
      { label: 'Ticket Types', href: '/admin/types', description: 'Define the kinds of requests users can raise.' },
      { label: 'Categories', href: '/admin/categories', description: 'Organise tickets into support categories.' },
      { label: 'Tags', href: '/admin/tags', description: 'Manage labels used to filter tickets.' },
      { label: 'Custom Fields', href: '/admin/custom-fields', description: 'Collect extra information on tickets.' },
      { label: 'Ticket Privacy', href: '/admin/privacy', description: 'Control who can see tickets.' },
    ],
  },
  {
    heading: 'People & Access',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    links: [
      { label: 'User Management', href: '/admin/users', description: 'View, search and manage all accounts.' },
      { label: 'Agents & Admins', href: '/admin/agents', description: 'Assign staff roles and permissions.' },
      { label: 'Teams', href: '/admin/teams', description: 'Group users and agents into teams.' },
      { label: 'Subscription Tiers', href: '/admin/tiers', description: 'Configure user tiers and priorities.' },
    ],
  },
  {
    heading: 'Workflow & SLAs',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    links: [
      { label: 'SLA Policies', href: '/admin/sla', description: 'Set response and resolution targets.' },
      { label: 'CSAT Settings', href: '/admin/csat', description: 'Configure satisfaction surveys.' },
      { label: 'Templates', href: '/admin/templates', description: 'Reusable ticket templates.' },
    ],
  },
  {
    heading: 'Channels & Communication',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    links: [
      { label: 'Email', href: '/admin/email', description: 'Outgoing email and notification delay.' },
      { label: 'Inbound Email', href: '/admin/inbound-email', description: 'Create tickets from incoming mail.' },
      { label: 'AI Configuration', href: '/admin/ai', description: 'AI summaries and suggested replies.' },
    ],
  },
  {
    heading: 'Knowledge Base',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    links: [{ label: 'KB Categories', href: '/admin/kb-categories', description: 'Organise help center articles.' }],
  },
  {
    heading: 'System Limits & Uploads',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    links: [
      { label: 'Pagination', href: '/admin/pagination', description: 'Items per page across lists.' },
      { label: 'Rate Limit', href: '/admin/rate-limit', description: 'Prevent ticket flooding.' },
      { label: 'File Uploads', href: '/admin/file-settings', description: 'Allowed file types and sizes.' },
    ],
  },
  {
    heading: 'Appearance & UX',
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
    links: [
      { label: 'Survey Templates', href: '/admin/survey-templates', description: 'Customise ticket page layouts.' },
      { label: 'User Settings', href: '/admin/user-settings', description: 'Defaults for new user accounts.' },
    ],
  },
  {
    heading: 'Audit & Compliance',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    links: [{ label: 'Audit Log', href: '/admin/audit-log', description: 'Review administrative activity.' }],
  },
];
