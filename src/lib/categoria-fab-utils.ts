/**
 * FAB Category Calculation Utility
 * REQ-2.1.9, REQ-2.1.10
 *
 * Calculates categoria_fab based on athlete's age
 * Aligned with Prisma schema: atletas.categoria_fab (String field)
 */

/**
 * All 8 FAB categories as per PRD Appendix B
 */
export const FAB_CATEGORIES = {
  U8: 'U8',
  U10: 'U10',
  U14: 'U14',
  U16: 'U16',
  MENORES: 'Menores',
  U20: 'U20',
  U23: 'U23',
  MAYORES: 'Mayores',
} as const

export type CategoriaFAB = typeof FAB_CATEGORIES[keyof typeof FAB_CATEGORIES]

/**
 * Calculate age from birth date
 */
export function calculateAge(fechaNacimiento: Date): number {
  const today = new Date()
  let age = today.getFullYear() - fechaNacimiento.getFullYear()
  const monthDiff = today.getMonth() - fechaNacimiento.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fechaNacimiento.getDate())) {
    age--
  }

  return age
}

/**
 * Calculate FAB category based on age
 * REQ-2.1.9: Category calculation according to current age
 *
 * Categories:
 * - U8: < 8 años
 * - U10: 8-9 años (actually 10-11 based on name)
 * - U14: 12-13 años
 * - U16: 14-15 años
 * - Menores: 16-17 años
 * - U20: 18-20 años
 * - U23: 21-22 años
 * - Mayores: 23+ años
 */
export function calculateCategoriaFAB(fechaNacimiento: Date | string): CategoriaFAB {
  const birthDate = typeof fechaNacimiento === 'string'
    ? new Date(fechaNacimiento)
    : fechaNacimiento

  const age = calculateAge(birthDate)

  if (age < 8) {
    return FAB_CATEGORIES.U8
  } else if (age >= 8 && age <= 9) {
    return FAB_CATEGORIES.U10
  } else if (age >= 12 && age <= 13) {
    return FAB_CATEGORIES.U14
  } else if (age >= 14 && age <= 15) {
    return FAB_CATEGORIES.U16
  } else if (age >= 16 && age <= 17) {
    return FAB_CATEGORIES.MENORES
  } else if (age >= 18 && age <= 20) {
    return FAB_CATEGORIES.U20
  } else if (age >= 21 && age <= 22) {
    return FAB_CATEGORIES.U23
  } else {
    return FAB_CATEGORIES.MAYORES
  }
}

/**
 * Get all categories for dropdown selection
 */
export function getAllCategorias(): CategoriaFAB[] {
  return Object.values(FAB_CATEGORIES)
}

/**
 * Get category label for display
 */
export function getCategoriaLabel(categoria: CategoriaFAB): string {
  return categoria
}

/**
 * Validate if age is within category range
 */
export function isAgeInCategory(age: number, categoria: CategoriaFAB): boolean {
  const birthDate = new Date()
  birthDate.setFullYear(birthDate.getFullYear() - age)
  const calculatedCategory = calculateCategoriaFAB(birthDate)
  return calculatedCategory === categoria
}
