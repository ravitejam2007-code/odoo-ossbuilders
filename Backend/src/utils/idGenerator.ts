/**
 * Generates the standardized Employee Login ID:
 * Format: [Company (2 chars)] + [First 2 of First Name + First 2 of Last Name] + [Joined Year (4 digits)] + [Serial (4 digits)]
 * Example: OIJODO20220001
 */
export function generateEmployeeLoginId(
  company: string,
  fullName: string,
  year: number = new Date().getFullYear(),
  serial: number = 1
): string {
  // 1. Company Code (2 chars)
  const cleanCompany = company.replace(/[^a-zA-Z]/g, '').toUpperCase();
  const compCode = (cleanCompany.length >= 2 ? cleanCompany.slice(0, 2) : (cleanCompany + 'XX').slice(0, 2));

  // 2. Name Code (First 2 of first name + First 2 of last name)
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || 'User';
  const lastName = parts.length > 1 ? parts[parts.length - 1] : 'Employee';

  const first2 = (firstName.replace(/[^a-zA-Z]/g, '').toUpperCase() + 'XX').slice(0, 2);
  const last2 = (lastName.replace(/[^a-zA-Z]/g, '').toUpperCase() + 'XX').slice(0, 2);
  const nameCode = `${first2}${last2}`;

  // 3. Year (4 digits)
  const yearCode = String(year);

  // 4. Serial (4 digits padded)
  const serialCode = String(serial).padStart(4, '0');

  return `${compCode}${nameCode}${yearCode}${serialCode}`;
}
