/** Trim whitespace and strip accidental surrounding quotes from Railway env values. */
export function readEnv(name: string): string | undefined {
  const raw = process.env[name];
  if (!raw) return undefined;
  return raw.trim().replace(/^["']|["']$/g, "");
}

export function getEmailJsConfig() {
  const serviceId = readEnv("EMAILJS_SERVICE_ID");
  const templateId = readEnv("EMAILJS_TEMPLATE_ID");
  const publicKey = readEnv("EMAILJS_PUBLIC_KEY");
  const privateKey = readEnv("EMAILJS_PRIVATE_KEY");

  const configured = Boolean(serviceId && templateId && publicKey);

  return {
    serviceId,
    templateId,
    publicKey,
    privateKey,
    configured,
    hasPrivateKey: Boolean(privateKey),
  };
}

/** Safe summary for logs / health checks — never exposes full secrets. */
export function getEmailJsConfigSummary() {
  const config = getEmailJsConfig();
  const mask = (value: string | undefined, visible = 8) =>
    value ? `${value.slice(0, visible)}… (${value.length} chars)` : null;

  return {
    configured: config.configured,
    hasPrivateKey: config.hasPrivateKey,
    serviceId: mask(config.serviceId, 12),
    templateId: mask(config.templateId, 14),
    publicKey: mask(config.publicKey, 6),
    templateIdLooksValid: /^template_[a-z0-9]+$/i.test(config.templateId ?? ""),
    serviceIdLooksValid: /^service_[a-z0-9]+$/i.test(config.serviceId ?? ""),
  };
}
