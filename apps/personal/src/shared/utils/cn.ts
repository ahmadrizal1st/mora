import { clsx, type ClassValue } from 'clsx';

/**
 * A utility to merge class names using clsx.
 * In a full Tailwind setup, this would also use tailwind-merge.
 * For this project, it's a wrapper around clsx.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
