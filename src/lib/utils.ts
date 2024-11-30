import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateInviteCode = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const twCharColorMap = {
  a: 'bg-amber-500',
  b: 'bg-blue-500',
  c: 'bg-cyan-500',
  d: 'bg-emerald-500',
  e: 'bg-fuchsia-500',
  f: 'bg-cyan-500',
  g: 'bg-green-500',
  h: 'bg-indigo-500',
  i: 'bg-lime-500',
  j: 'bg-orange-500',
  k: 'bg-pink-500',
  l: 'bg-purple-500',
  m: 'bg-red-500',
  n: 'bg-sky-500',
  o: 'bg-teal-500',
  p: 'bg-violet-500',
  q: 'bg-yellow-500',
  r: 'bg-rose-500',
  s: 'bg-amber-500',
  t: 'bg-blue-500',
  u: 'bg-cyan-500',
  v: 'bg-emerald-500',
  w: 'bg-fuchsia-500',
  x: 'bg-cyan-500',
  y: 'bg-green-500',
  z: 'bg-indigo-500',
  A: 'bg-lime-500',
  B: 'bg-orange-500',
  C: 'bg-pink-500',
  D: 'bg-purple-500',
  E: 'bg-red-500',
  F: 'bg-sky-500',
  G: 'bg-teal-500',
  H: 'bg-violet-500',
  I: 'bg-yellow-500',
  J: 'bg-rose-500',
  K: 'bg-amber-500',
  L: 'bg-blue-500',
  M: 'bg-cyan-500',
  N: 'bg-emerald-500',
  O: 'bg-fuchsia-500',
  P: 'bg-cyan-500',
  Q: 'bg-green-500',
  R: 'bg-indigo-500',
  S: 'bg-lime-500',
  T: 'bg-orange-500',
  U: 'bg-pink-500',
  V: 'bg-purple-500',
  W: 'bg-red-500',
  X: 'bg-sky-500',
  Y: 'bg-teal-500',
  Z: 'bg-violet-500',
};

export const getColorForAvatar = (char: string) => twCharColorMap[char as keyof typeof twCharColorMap];
