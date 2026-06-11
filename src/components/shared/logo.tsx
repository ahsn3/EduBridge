import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND, SITE_NAME } from "@/lib/site-config";

export type LogoVariant = "icon" | "name" | "full";

const variantConfig: Record<
  LogoVariant,
  { src: string; width: number; height: number; className: string }
> = {
  icon: {
    src: BRAND.logo,
    width: 40,
    height: 40,
    className:
      "h-9 w-9 rounded-full object-cover ring-2 ring-primary/15 shadow-md",
  },
  name: {
    src: BRAND.logoName,
    width: 160,
    height: 48,
    className: "h-10 w-auto object-contain",
  },
  full: {
    src: BRAND.logoFull,
    width: 280,
    height: 100,
    className: "h-16 w-auto object-contain",
  },
};

interface LogoProps {
  variant?: LogoVariant;
  showName?: boolean;
  href?: string;
  className?: string;
  imageClassName?: string;
  nameClassName?: string;
  priority?: boolean;
}

export function Logo({
  variant = "name",
  showName = false,
  href = "/",
  className,
  imageClassName,
  nameClassName,
  priority = false,
}: LogoProps) {
  const config = variantConfig[variant];

  const content = (
    <>
      <Image
        src={config.src}
        alt={SITE_NAME}
        width={config.width}
        height={config.height}
        className={cn(config.className, imageClassName)}
        priority={priority}
      />
      {showName && (
        <span className={cn("font-bold text-xl text-foreground", nameClassName)}>
          {SITE_NAME}
        </span>
      )}
    </>
  );

  if (!href) {
    return (
      <div className={cn("inline-flex items-center", showName && "gap-2.5", className)}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center shrink-0",
        showName && "gap-2.5",
        className
      )}
    >
      {content}
    </Link>
  );
}
