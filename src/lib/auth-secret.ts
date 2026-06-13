export function getAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
}

export function isAuthConfigured(): boolean {
  return Boolean(getAuthSecret());
}
