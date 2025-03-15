import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Concatenate class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}