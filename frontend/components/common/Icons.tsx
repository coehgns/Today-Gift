import type { SVGProps } from "react";

function Svg({ className, children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function GiftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8" />
      <path d="M2.5 7.5A1.5 1.5 0 0 1 4 6h16a1.5 1.5 0 0 1 1.5 1.5V12h-19Z" />
      <path d="M12 6v15" />
      <path d="M12 6H8.8C7.4 6 6.5 5.1 6.5 4s.9-2 2.1-2C10.4 2 12 6 12 6Z" />
      <path d="M12 6h3.2c1.4 0 2.3-.9 2.3-2s-.9-2-2.1-2C13.6 2 12 6 12 6Z" />
    </Svg>
  );
}

export function HeroGiftIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M27 48h66c5 0 9 4 9 9v39c0 7.2-5.8 13-13 13H31c-7.2 0-13-5.8-13-13V57c0-5 4-9 9-9Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M60 48v61"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M18 70h84"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M42 49v18"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M78 49v18"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M60 48c-13.8.5-28.8-1.5-33.5-8.5-6-8.9.2-18.2 10.5-16.2C48.5 25.6 55.6 39.1 60 48Z"
        fill="#ffdc5a"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M60 48c13.8.5 28.8-1.5 33.5-8.5 6-8.9-.2-18.2-10.5-16.2C71.5 25.6 64.4 39.1 60 48Z"
        fill="#ffdc5a"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GitHubIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.11.79-.25.79-.56v-2.12c-3.23.7-3.91-1.38-3.91-1.38-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.58-.29-5.29-1.29-5.29-5.74 0-1.27.45-2.31 1.2-3.12-.12-.29-.52-1.48.11-3.08 0 0 .98-.31 3.2 1.19A11.1 11.1 0 0 1 12 5.91c.98 0 1.97.13 2.9.39 2.2-1.5 3.18-1.19 3.18-1.19.64 1.6.24 2.79.12 3.08.75.81 1.2 1.85 1.2 3.12 0 4.46-2.72 5.44-5.3 5.73.42.36.79 1.07.79 2.16v3.2c0 .31.2.68.8.56A11.5 11.5 0 0 0 12 .5Z"
      />
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5Z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />
      <path d="M5 14l.6 1.4L7 16l-1.4.6L5 18l-.6-1.4L3 16l1.4-.6Z" />
    </Svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function TargetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </Svg>
  );
}

export function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M20.8 8.6c0 5.2-8.8 10.4-8.8 10.4S3.2 13.8 3.2 8.6A4.4 4.4 0 0 1 11 5.8a4.4 4.4 0 0 1 9.8 2.8Z" />
    </Svg>
  );
}

export function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M21 20v-1.2a3.5 3.5 0 0 0-3-3.5" />
      <path d="M15.5 4.2a3 3 0 0 1 0 5.6" />
    </Svg>
  );
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M9.5 20v-6h5v6" />
    </Svg>
  );
}

export function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </Svg>
  );
}

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="7" r="3" />
      <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
    </Svg>
  );
}

export function QuestionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.7 2.7 0 0 1 5.2 1c0 2-2.7 2.2-2.7 4" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

export function CakeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M4 21h16" />
      <path d="M5 21v-8h14v8" />
      <path d="M5 16c2 1.3 4 .3 5 0s3 1.3 5 0 3-.3 4 0" />
      <path d="M8 13V9" />
      <path d="M12 13V9" />
      <path d="M16 13V9" />
      <path d="M8 6v.01" />
      <path d="M12 6v.01" />
      <path d="M16 6v.01" />
    </Svg>
  );
}

export function SmileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 10h.01" />
      <path d="M15.5 10h.01" />
      <path d="M8.8 14.5c1.8 2 4.6 2 6.4 0" />
    </Svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </Svg>
  );
}

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="m5 12 4 4L19 6" />
    </Svg>
  );
}
