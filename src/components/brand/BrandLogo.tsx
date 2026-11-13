import Image from 'next/image';

export const INSTITUTION_NAME = 'Nasarawa State University, Keffi';
export const APP_NAME = 'ICT Helpdesk';

export function BrandLogo({
  size = 40,
  className = '',
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/nsuk_logo.png"
      alt="Nasarawa State University crest"
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
