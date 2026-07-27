// Inline SVG icons ported verbatim from src/assets/svgs.tsx of the 0vix-frontend
// repo (auto-transact branch). Paths are quoted exactly.
import type { SVGProps } from "react";

export const SortArrowIcon = ({
  selected = false,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { selected?: boolean }) => (
  <svg
    width="8"
    height="10"
    className={"transition-all " + (className ?? "")}
    {...props}
    viewBox="0 0 8 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.5 3.5L1.205 4.205L3.5 1.915V10H4.5V1.915L6.795 4.21L7.5 3.5L4 0L0.5 3.5Z"
      fill={selected ? "#fff" : "#7C8792"}
    />
  </svg>
);

export const CircularSuccessIcon = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18.3146 3.68499C14.2743 -0.355284 7.72478 -0.355284 3.6845 3.68499C-0.355772 7.72527 -0.355772 14.2748 3.6845 18.3151C7.72478 22.3553 14.2743 22.3553 18.3146 18.3151C22.3548 14.2748 22.354 7.72527 18.3146 3.68499ZM16.6296 8.44196L10.3433 14.7291C10.1881 14.8843 9.9776 14.9714 9.75816 14.9714C9.53871 14.9714 9.32825 14.8843 9.17306 14.7291L5.36947 10.9247C5.29263 10.8479 5.23168 10.7567 5.1901 10.6563C5.14851 10.5559 5.12711 10.4483 5.12711 10.3396C5.12711 10.1202 5.21429 9.90969 5.36947 9.75451C5.52465 9.59933 5.73512 9.51215 5.95457 9.51215C6.17403 9.51215 6.3845 9.59933 6.53968 9.75451L9.75816 12.973L15.4594 7.27092C15.5363 7.19409 15.6276 7.13315 15.728 7.09158C15.8284 7.05002 15.9361 7.02865 16.0448 7.02869C16.1535 7.02873 16.2611 7.05017 16.3615 7.09181C16.462 7.13344 16.5532 7.19445 16.63 7.27134C16.7069 7.34823 16.7678 7.4395 16.8094 7.53994C16.8509 7.64039 16.8723 7.74803 16.8723 7.85673C16.8722 7.96544 16.8508 8.07307 16.8091 8.17348C16.7675 8.27389 16.7065 8.36512 16.6296 8.44196Z"
      fill="#22C55E"
    />
  </svg>
);

export const ErrorIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width="31"
    height="30"
    viewBox="0 0 31 30"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.385 9L15.5 12.885L11.615 9L9.5 11.115L13.385 15L9.5 18.885L11.615 21L15.5 17.115L19.385 21L21.5 18.885L17.615 15L21.5 11.115L19.385 9ZM15.5 0C7.205 0 0.5 6.705 0.5 15C0.5 23.295 7.205 30 15.5 30C23.795 30 30.5 23.295 30.5 15C30.5 6.705 23.795 0 15.5 0ZM15.5 27C8.885 27 3.5 21.615 3.5 15C3.5 8.385 8.885 3 15.5 3C22.115 3 27.5 8.385 27.5 15C27.5 21.615 22.115 27 15.5 27Z"
      fill="#EF4444"
    />
  </svg>
);

export const RedirectIcon = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 10 10"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.33333 0V1.33333H7.72667L0 9.06L0.94 10L8.66667 2.27333V6.66667H10V0H3.33333Z"
      fill="#F2F4FE"
    />
  </svg>
);

export const CloseIcon = ({
  className,
  onClick,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    className={className}
    onClick={onClick}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
      fill="#7C8792"
    />
  </svg>
);

export const MenuIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.5 5h15M2.5 10h15M2.5 15h15"
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
