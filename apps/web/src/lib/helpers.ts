export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function cx(...args: (string | false | undefined | null)[]): string {
  return args.filter(Boolean).join(' ');
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}
