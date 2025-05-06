import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Available shapes for the shapes-colors discipline
export const shapes = [
  "circle",
  "square",
  "triangle",
  "star",
  "heart",
  "diamond",
  "pentagon",
  "hexagon",
  "octagon",
  "cross",
  "moon",
  "cloud",
];

// Available colors for the shapes-colors discipline
export const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "teal",
  "lime",
  "cyan",
  "indigo",
  "amber",
];

// Get shape icons (simple representation using emojis or symbols)
export function getShapeIcon(shape: string): string {
  const icons: Record<string, string> = {
    circle: "●",
    square: "■",
    triangle: "▲",
    star: "★",
    heart: "♥",
    diamond: "♦",
    pentagon: "⬟",
    hexagon: "⬢",
    octagon: "⯄",
    cross: "✚",
    moon: "☾",
    cloud: "☁",
  };
  return icons[shape] || "●";
}

// Get tailwind color classes
export function getColorClass(color: string): string {
  const colorClasses: Record<string, string> = {
    red: "text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-950",
    blue: "text-blue-500 bg-blue-100 dark:text-blue-400 dark:bg-blue-950",
    green: "text-green-500 bg-green-100 dark:text-green-400 dark:bg-green-950",
    yellow:
      "text-yellow-500 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-950",
    purple:
      "text-purple-500 bg-purple-100 dark:text-purple-400 dark:bg-purple-950",
    orange:
      "text-orange-500 bg-orange-100 dark:text-orange-400 dark:bg-orange-950",
    pink: "text-pink-500 bg-pink-100 dark:text-pink-400 dark:bg-pink-950",
    teal: "text-teal-500 bg-teal-100 dark:text-teal-400 dark:bg-teal-950",
    lime: "text-lime-500 bg-lime-100 dark:text-lime-400 dark:bg-lime-950",
    cyan: "text-cyan-500 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-950",
    indigo:
      "text-indigo-500 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-950",
    amber: "text-amber-500 bg-amber-100 dark:text-amber-400 dark:bg-amber-950",
  };
  return (
    colorClasses[color] ||
    "text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800"
  );
}

// Get the number of items based on difficulty level
export function getShapesColorCount(difficulty: string): number {
  return (
    {
      basic: 5,
      intermediate: 8,
      advanced: 12,
    }[difficulty] || 5
  );
}

// Generate a random sequence for the shapes-colors discipline
export function generateShapesColorSequence(
  count: number
): Array<{ shape: string; color: string }> {
  const sequence: Array<{ shape: string; color: string }> = [];

  // Create a copy of the arrays to avoid repeating elements
  const availableShapes = [...shapes];
  const availableColors = [...colors];

  for (let i = 0; i < count; i++) {
    // Get random shape and color
    const shapeIndex = Math.floor(Math.random() * availableShapes.length);
    const colorIndex = Math.floor(Math.random() * availableColors.length);

    const shape = availableShapes[shapeIndex];
    const color = availableColors[colorIndex];

    // Add to sequence
    sequence.push({ shape, color });

    // Remove used shape and color to avoid repetition
    availableShapes.splice(shapeIndex, 1);
    availableColors.splice(colorIndex, 1);

    // If we run out of unique items, reset the arrays
    if (availableShapes.length === 0) availableShapes.push(...shapes);
    if (availableColors.length === 0) availableColors.push(...colors);
  }

  return sequence;
}

// Calculate score for shapes-colors
export function calculateShapesColorScore(
  userSequence: Array<{ shape: string; color: string }>,
  correctSequence: Array<{ shape: string; color: string }>
): number {
  let score = 0;

  for (
    let i = 0;
    i < Math.min(userSequence.length, correctSequence.length);
    i++
  ) {
    // Score for correct shape
    if (userSequence[i].shape === correctSequence[i].shape) {
      score += 5;
    }

    // Score for correct color
    if (userSequence[i].color === correctSequence[i].color) {
      score += 5;
    }
  }

  return score;
}

// Generate a random sequence of digits of the given length
export function generateDigitSequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 10));
}

// Generate a random sequence of binary digits (0 and 1)
export function generateBinarySequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 2));
}

// Generate a random matrix of given size with single-digit numbers (0-9)
export function generateMatrix(size: number): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 10))
  );
}

// Calculate score for matrices based on correct positions
export function calculateMatrixScore(
  userMatrix: number[][],
  correctMatrix: number[][]
): number {
  let score = 0;
  const size = correctMatrix.length;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (userMatrix[i][j] === correctMatrix[i][j]) {
        score += 10;
      }
    }
  }

  return score;
}

// Parse matrix size from the format "3x3", "4x4", etc.
export function parseMatrixSize(sizeStr: string): number {
  return parseInt(sizeStr.split("x")[0], 10);
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
