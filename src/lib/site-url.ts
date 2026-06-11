import { headers } from "next/headers";
import { getSiteUrl } from "@/lib/site-config";

export async function getRequestSiteUrl(): Promise<string> {
  try {
    const headersList = await headers();
    const host =
      headersList.get("x-forwarded-host") ?? headersList.get("host");

    if (host) {
      const forwardedProto = headersList.get("x-forwarded-proto");
      const protocol =
        forwardedProto ??
        (host.includes("localhost") || host.startsWith("127.0.0.1")
          ? "http"
          : "https");
      return `${protocol}://${host}`.replace(/\/$/, "");
    }
  } catch {
    // headers() is unavailable outside a request context
  }

  return getSiteUrl();
}
