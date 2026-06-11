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
    className: "object-cover",
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
  href?: string | null;
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

  const image =
    variant === "icon" ? (
      <span
        className={cn(
          "relative inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 shadow-md bg-background",
          imageClassName
        )}
      >
        <Image
          src={config.src}
          alt={SITE_NAME}
          fill
          sizes="36px"
          className={config.className}
          priority={priority}
        />
      </span>
    ) : (
      <Image
        src={config.src}
        alt={SITE_NAME}
        width={config.width}
        height={config.height}
        className={cn(config.className, imageClassName)}
        priority={priority}
      />
    );

  const content = (
    <>
      {image}
      {showName && (
        <span className={cn("font-bold text-xl text-foreground", nameClassName)}>
          {SITE_NAME}
        </span>
      )}
    </>
  );

  const wrapperClass = cn(
    "inline-flex items-center shrink-0",
    (showName || variant === "icon") && "gap-2.5",
    className
  );

  if (!href) {
    return (
      <div dir="ltr" className={wrapperClass}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href} dir="ltr" className={wrapperClass}>
      {content}
    </Link>
  );
}
