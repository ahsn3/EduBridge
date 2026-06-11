import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND, SITE_NAME } from "@/lib/site-config";

interface BrandMarkProps {
  href?: string;
  className?: string;
  imageSize?: "sm" | "md" | "lg";
  showName?: boolean;
  nameClassName?: string;
  priority?: boolean;
}

const sizeMap = {
  sm: { box: "h-8 w-8", text: "text-lg" },
  md: { box: "h-9 w-9", text: "text-xl" },
  lg: { box: "h-11 w-11", text: "text-2xl" },
} as const;

export function BrandMark({
  href = "/",
  className,
  imageSize = "md",
  showName = true,
  nameClassName,
  priority = false,
}: BrandMarkProps) {
  const sizes = sizeMap[imageSize];

  const content = (
    <>
      <span
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 shadow-md bg-background",
          sizes.box
        )}
      >
        <Image
          src={BRAND.logo}
          alt={SITE_NAME}
          fill
          sizes={sizes.box}
          className="object-cover"
          priority={priority}
        />
      </span>
      {showName && (
        <span
          className={cn(
            "font-bold tracking-tight text-foreground",
            sizes.text,
            nameClassName
          )}
        >
          {SITE_NAME}
        </span>
      )}
    </>
  );

  const wrapperClass = cn(
    "inline-flex items-center gap-2.5 shrink-0",
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
