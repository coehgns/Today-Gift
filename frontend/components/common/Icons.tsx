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
