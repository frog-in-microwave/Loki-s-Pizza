/**
 * TYPESCRIPT TYPES
 * These act as a blueprint for your data. They tell the editor exactly what 
 * properties an object should have, allowing for intelligent autocomplete 
 * and preventing typos across your app.
 * 
 * KEYWORDS TO SEARCH: "TypeScript Basics", "TypeScript Type Aliases"
 */

// A Type Alias restricting the Language variable to ONLY be "en" or "ar"
export type Language = "en" | "ar";

// An interface defining an object that holds translations
export interface LocalizedText {
  en?: string;
  ar?: string;
}

export interface SizeOption {
  id: string;
  name: LocalizedText;
  dimension?: string;
  price: string;
}

export interface SubcategoryOption {
  id: string;
  label: LocalizedText;
}

export interface Category {
  id: string;
  order: number;
  name: LocalizedText;
  subtitle?: LocalizedText;
  note?: LocalizedText;
  subcategories?: SubcategoryOption[];
}

export interface Product {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  subcategory?: LocalizedText;
  order: number;
  name: LocalizedText;
  price: string;
  sizes?: SizeOption[];
  defaultSize?: string;
  selectedSizeId?: string;
  isSpicy?: boolean;
  badge?: LocalizedText;
  comboOption?: string;
  description?: LocalizedText;
  image: string;
  isAvailable: boolean;
}
