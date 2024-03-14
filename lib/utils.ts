import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isTrue(value?: string) {
  if (value === undefined) return false;
  return /^true$/i.test(value);
}

export function getRandomSeed() {
  return BigInt(Math.floor(Math.random() * 9007199254740991));
}
