import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a random sequence of digits of the given length
export function generateDigitSequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 10));
}

// Calculate score based on correct digits
export function calculateScore(
  userInput: number[],
  sequence: number[]
): number {
  let score = 0;
  for (let i = 0; i < Math.min(userInput.length, sequence.length); i++) {
    if (userInput[i] === sequence[i]) {
      score += 10;
    } else {
      break; // Stop scoring after the first error
    }
  }
  return score;
}

// Calculate memory training difficulty level length
export function getDifficultyLevelLength(difficulty: string): number {
  // Base starting length for each difficulty
  const baseLength =
    {
      "0.5": 5, // Start with 5 digits for hardest difficulty
      "1": 5,
      "2": 4,
      "3": 4,
      "4": 3, // Start with 3 digits for easiest difficulty
    }[difficulty] || 4;

  return baseLength;
}

// Format a seconds value to mm:ss format
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}
