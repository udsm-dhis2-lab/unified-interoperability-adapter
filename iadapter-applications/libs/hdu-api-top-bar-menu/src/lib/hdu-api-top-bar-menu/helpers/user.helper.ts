/**
 * Returns the initials of a given full name.
 * @param fullName - The full name from which to extract initials.
 * @returns The initials of the name.
 */
export function getInitials(fullName: string): string {
  if (!fullName) return '';

  // Split the name into parts
  const nameParts = fullName.split(' ');

  // Extract the first character of each part
  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return initials;
}
