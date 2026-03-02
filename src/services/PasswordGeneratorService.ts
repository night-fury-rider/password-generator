import { EXCLUDED_CHARACTERS } from "$/constants/app.config.constants";

interface IPasswordOptions {
  includeAt: boolean;
  includeDollar: boolean;
  includeHash: boolean;
  includeNumber: boolean;
  length: number;
}

type TStrengthLevel = "Fair" | "Strong" | "Very Strong" | "Weak";

interface IStrengthResult {
  color: string;
  label: TStrengthLevel;
}

const CHARSET_DIGITS = "23456789";
const CHARSET_LOWER = "abcdefghijkmnprstuvwxyz";
const CHARSET_UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";

const _buildBaseCharset = (includeNumber: boolean) => {
  const full =
    (includeNumber ? CHARSET_DIGITS : "") + CHARSET_LOWER + CHARSET_UPPER;
  return full
    .split("")
    .filter((c) => !EXCLUDED_CHARACTERS.includes(c))
    .join("");
};

const _shuffle = (chars: string[]): string[] => {
  const arr = [...chars];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const generatePassword = (options: IPasswordOptions): string => {
  const { includeAt, includeDollar, includeHash, includeNumber, length } =
    options;

  const required: string[] = [];
  if (includeAt) required.push("@");
  if (includeDollar) required.push("$");
  if (includeHash) required.push("#");
  if (includeNumber) {
    const digits = CHARSET_DIGITS.split("");
    required.push(digits[Math.floor(Math.random() * digits.length)]);
  }

  if (required.length >= length) {
    return _shuffle(required).slice(0, length).join("");
  }

  const baseCharset = _buildBaseCharset();
  const remaining = length - required.length;
  const fillerChars: string[] = [];

  for (let i = 0; i < remaining; i++) {
    fillerChars.push(
      baseCharset[Math.floor(Math.random() * baseCharset.length)],
    );
  }

  return _shuffle([...required, ...fillerChars]).join("");
};

const getPasswordStrength = (length: number): IStrengthResult => {
  if (length <= 8) return { color: "#f87171", label: "Weak" };
  if (length <= 12) return { color: "#facc15", label: "Fair" };
  if (length <= 20) return { color: "#4ade80", label: "Strong" };
  return { color: "#00ffc8", label: "Very Strong" };
};

export { generatePassword, getPasswordStrength };
export type { IPasswordOptions, IStrengthResult, TStrengthLevel };
