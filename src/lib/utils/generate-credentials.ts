/**
 * Generates a random username for municipalities
 * Format: {municipality_name_lowercase}_{random_string}
 */
export function generateMunicipalityUsername(municipalityName: string): string {
  const cleanName = municipalityName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '_');
  
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${cleanName}_${randomSuffix}`;
}

/**
 * Generates a random password with specified requirements
 * Format: {uppercase}{lowercase}{number}{special}{random}
 */
export function generateMunicipalityPassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@#$%&*!';
  
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Add 4 more random characters
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = 0; i < 4; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Generates both username and password for a municipality
 */
export function generateMunicipalityCredentials(municipalityName: string) {
  return {
    username: generateMunicipalityUsername(municipalityName),
    password: generateMunicipalityPassword()
  };
}

/**
 * Generates a random username for companies
 * Format: {company_name_lowercase}_{random_string}
 */
export function generateCompanyUsername(companyName: string): string {
  const cleanName = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '_');
  
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${cleanName}_${randomSuffix}`;
}

/**
 * Generates both username and password for a company
 */
export function generateCompanyCredentials(companyName: string) {
  return {
    username: generateCompanyUsername(companyName),
    password: generateMunicipalityPassword() // Reuse the same password generator
  };
}
