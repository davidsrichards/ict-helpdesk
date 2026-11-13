import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/auth';
import { APP_NAME, BrandLogo, INSTITUTION_NAME } from '@/components/brand/BrandLogo';

const HIGHLIGHTS = [
  { title: 'Report an issue', text: 'Log network, hardware, software and account problems in minutes.' },
  { title: 'Track progress', text: 'Follow every ticket from submission to resolution in real time.' },
  { title: 'Self-service help', text: 'Browse the knowledge base for quick answers and guides.' },
];

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user) redirect('/');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <aside className="relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 text-white lg:w-[46%] lg:min-h-screen flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-gold-400/10" aria-hidden="true" />

        <div className="relative flex items-center gap-4">
          <div className="rounded-full bg-white p-1.5 shadow-lg">
            <BrandLogo size={56} priority />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-gold-300">{INSTITUTION_NAME}</p>
            <p className="text-xl font-semibold leading-tight">{APP_NAME}</p>
          </div>
        </div>

        <div className="relative hidden lg:block my-12">
          <h2 className="text-4xl font-bold leading-tight">
            Fast, reliable <span className="text-gold-400">ICT support</span> for the NSUK community.
          </h2>
          <p className="mt-4 max-w-md text-blue-100">
            One place for students and staff to request help and for the ICT directorate to resolve it.
          </p>
          <ul className="mt-10 space-y-5">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-400 text-blue-950" aria-hidden="true">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-blue-100">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative hidden lg:block text-sm italic text-blue-200">Knowledge for Development</p>
      </aside>

      <main id="main" className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
