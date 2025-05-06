"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-provider";
import { supabase } from "@/lib/supabase";
import {
  calculateMatrixScore,
  formatTime,
  generateMatrix,
  parseMatrixSize,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

enum TrainingState {
  READY = "ready",
  MEMORIZING = "memorizing",
  RECALLING = "recalling",
  RESULT = "result",
}

export default function MatricesTrainingPage() {
  const searchParams = useSearchParams();
  const sizeStr = searchParams.get("size") || "3x3";
  const size = parseMatrixSize(sizeStr);
  const router = useRouter();
  const { user } = useAuth();

  const [matrix, setMatrix] = useState<number[][]>([]);
  const [userMatrix, setUserMatrix] = useState<string[][]>([]);
  const [trainingState, setTrainingState] = useState<TrainingState>(
    TrainingState.READY
  );
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [memorizeTime, setMemorizeTime] = useState<number>(
    size === 3 ? 10 : size === 4 ? 20 : 30
  ); // Time in seconds based on matrix size
  const [remainingMemorizeTime, setRemainingMemorizeTime] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isRecord, setIsRecord] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    // Generate matrix when size changes
    const newMatrix = generateMatrix(size);
    setMatrix(newMatrix);

    // Initialize empty user matrix for input
    const emptyMatrix = Array(size)
      .fill(0)
      .map(() => Array(size).fill(""));
    setUserMatrix(emptyMatrix);

    // Set memorize time based on matrix size
    setMemorizeTime(size === 3 ? 10 : size === 4 ? 20 : 30);
    setRemainingMemorizeTime(size === 3 ? 10 : size === 4 ? 20 : 30);
  }, [size]);

  useEffect(() => {
    // Timer for memorizing phase
    if (trainingState === TrainingState.MEMORIZING) {
      const interval = setInterval(() => {
        setRemainingMemorizeTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTrainingState(TrainingState.RECALLING);
            startTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [trainingState]);

  const startTraining = () => {
    setTrainingState(TrainingState.MEMORIZING);
    setRemainingMemorizeTime(memorizeTime);
  };

  const startTimer = () => {
    setTimer(0);
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (trainingState !== TrainingState.RECALLING) return;
    setActiveCell({ row, col });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!activeCell || trainingState !== TrainingState.RECALLING) return;

    const { row, col } = activeCell;

    // Only allow digits 0-9
    if (/^[0-9]$/.test(e.key)) {
      const newMatrix = [...userMatrix];
      newMatrix[row][col] = e.key;
      setUserMatrix(newMatrix);

      // Move to next cell
      const nextCol = (col + 1) % size;
      const nextRow = nextCol === 0 ? (row + 1) % size : row;
      setActiveCell({ row: nextRow, col: nextCol });
    } else if (e.key === "Backspace") {
      const newMatrix = [...userMatrix];
      newMatrix[row][col] = "";
      setUserMatrix(newMatrix);
    } else if (e.key === "ArrowUp" && row > 0) {
      setActiveCell({ row: row - 1, col });
    } else if (e.key === "ArrowDown" && row < size - 1) {
      setActiveCell({ row: row + 1, col });
    } else if (e.key === "ArrowLeft" && col > 0) {
      setActiveCell({ row, col: col - 1 });
    } else if (e.key === "ArrowRight" && col < size - 1) {
      setActiveCell({ row, col: col + 1 });
    }
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (trainingState !== TrainingState.RECALLING) return;

    // Only allow digits 0-9
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 1);

    const newMatrix = [...userMatrix];
    newMatrix[row][col] = cleanValue;
    setUserMatrix(newMatrix);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    stopTimer();

    // Convert userMatrix strings to numbers for scoring
    const numberUserMatrix = userMatrix.map((row) =>
      row.map((cell) => parseInt(cell, 10) || 0)
    );

    // Calculate score
    const calculatedScore = calculateMatrixScore(numberUserMatrix, matrix);
    setScore(calculatedScore);
    setTrainingState(TrainingState.RESULT);

    if (user) {
      setIsLoading(true);
      try {
        // Save training session
        const { data: sessionData, error: sessionError } = await supabase
          .from("training_sessions")
          .insert({
            user_id: user.id,
            discipline_id: 3, // Matrices
            difficulty: sizeStr,
            score: calculatedScore,
            correct_answers: Math.floor(calculatedScore / 10), // Each correct cell is worth 10 points
            total_questions: size * size,
            accuracy: (calculatedScore / (size * size * 10)) * 100,
            duration: timer,
            session_data: {
              matrix,
              user_matrix: numberUserMatrix,
            },
          })
          .select();

        if (sessionError) throw sessionError;

        // Check if it's a record
        const { data: recordData, error: recordError } = await supabase
          .from("records")
          .select("score")
          .eq("user_id", user.id)
          .eq("discipline_id", 3)
          .eq("difficulty", sizeStr)
          .single();

        if (recordError && recordError.code !== "PGRST116") {
          throw recordError;
        }

        if (!recordData || calculatedScore > recordData.score) {
          setIsRecord(true);
        }
      } catch (error) {
        console.error("Error saving training session:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTryAgain = () => {
    // Reset state for a new attempt
    setTrainingState(TrainingState.READY);
    const newMatrix = generateMatrix(size);
    setMatrix(newMatrix);
    const emptyMatrix = Array(size)
      .fill(0)
      .map(() => Array(size).fill(""));
    setUserMatrix(emptyMatrix);
    setTimer(0);
    setActiveCell(null);
    setIsRecord(false);
  };

  return (
    <div className="container py-12 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Entrenamiento: Matrices ({sizeStr})
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        {trainingState === TrainingState.READY && (
          <div className="text-center space-y-6">
            <p className="text-lg">
              Memorizarás una matriz {sizeStr} de números. Tendrás{" "}
              {memorizeTime} segundos para memorizarla.
            </p>
            <Button onClick={startTraining} size="lg">
              Comenzar
            </Button>
          </div>
        )}

        {trainingState === TrainingState.MEMORIZING && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="flex flex-col items-center">
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 max-w-md">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${(remainingMemorizeTime / memorizeTime) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Tiempo restante:{" "}
                  <span className="font-bold">{remainingMemorizeTime}s</span>
                </div>
              </div>
              <p className="font-medium mt-2">¡Memoriza estos números!</p>
            </div>

            <div className="grid place-items-center">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${size}, 1fr)`,
                }}
              >
                {matrix.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center font-bold text-xl transform transition-all hover:scale-110"
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {trainingState === TrainingState.RECALLING && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            onKeyDown={handleKeyPress}
          >
            <div className="text-center mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Tiempo: {formatTime(timer)}
              </div>
              <p className="font-medium">Recuerda e ingresa los números:</p>
            </div>

            <div className="grid place-items-center">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${size}, 1fr)`,
                }}
              >
                {userMatrix.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <Input
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-12 h-12 p-0 text-center text-xl ${
                        activeCell?.row === rowIndex &&
                        activeCell?.col === colIndex
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      value={cell}
                      onChange={(e) =>
                        handleInputChange(rowIndex, colIndex, e.target.value)
                      }
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      maxLength={1}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Haz clic en una celda y usa las flechas del teclado para moverte
            </div>

            <Button type="submit" className="w-full">
              Verificar
            </Button>
          </form>
        )}

        {trainingState === TrainingState.RESULT && (
          <div className="space-y-6 text-center">
            <div className="text-2xl font-bold">
              {score > 0 ? "¡Buen trabajo!" : "¡Intenta de nuevo!"}
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <div className="text-xl mb-1">
                Puntuación: <span className="font-bold">{score}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {Math.floor(score / 10)} de {size * size} celdas correctas
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Tiempo: {formatTime(timer)}
              </div>
              {isRecord && (
                <div className="mt-2 text-green-600 dark:text-green-400 font-medium">
                  ¡Nuevo récord personal!
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Matriz correcta:</h3>
                <div className="grid place-items-center">
                  <div
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${size}, 1fr)`,
                    }}
                  >
                    {matrix.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`correct-${rowIndex}-${colIndex}`}
                          className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center font-medium"
                        >
                          {cell}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Tu respuesta:</h3>
                <div className="grid place-items-center">
                  <div
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${size}, 1fr)`,
                    }}
                  >
                    {userMatrix.map((row, rowIndex) =>
                      row.map((cell, colIndex) => {
                        const isCorrect =
                          cell &&
                          parseInt(cell, 10) === matrix[rowIndex][colIndex];
                        return (
                          <div
                            key={`user-${rowIndex}-${colIndex}`}
                            className={`w-10 h-10 rounded flex items-center justify-center font-medium ${
                              isCorrect
                                ? "bg-green-100 dark:bg-green-900"
                                : cell
                                ? "bg-red-100 dark:bg-red-900"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}
                          >
                            {cell || ""}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={handleTryAgain}>Intentar de nuevo</Button>
              <Button
                variant="outline"
                onClick={() => router.push("/disciplines/matrices")}
              >
                Cambiar tamaño
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
