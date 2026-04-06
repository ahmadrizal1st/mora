/**
 * Extracts initials from a full name.
 * @param name Full name
 * @returns Initials (max 2 characters, uppercase)
 */
export function getInitials(name: string): string {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
