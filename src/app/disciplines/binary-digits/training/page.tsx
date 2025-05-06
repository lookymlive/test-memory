"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-provider";
import { supabase } from "@/lib/supabase";
import {
  calculateScore,
  formatTime,
  generateBinarySequence,
  getDifficultyLevelLength,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

enum TrainingState {
  READY = "ready",
  MEMORIZING = "memorizing",
  RECALLING = "recalling",
  RESULT = "result",
}

export default function BinaryDigitsTrainingPage() {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "2";
  const router = useRouter();
  const { user } = useAuth();

  const [sequence, setSequence] = useState<number[]>([]);
  const [currentDigitIndex, setCurrentDigitIndex] = useState<number>(-1);
  const [trainingState, setTrainingState] = useState<TrainingState>(
    TrainingState.READY
  );
  const [userInput, setUserInput] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [score, setScore] = useState<number>(0);
  const [isRecord, setIsRecord] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Generate sequence when difficulty changes
    const length = getDifficultyLevelLength(difficulty) + 2; // Binary is easier, so add 2 to the length
    setSequence(generateBinarySequence(length));
  }, [difficulty]);

  useEffect(() => {
    // Timer for memorizing phase
    if (trainingState === TrainingState.MEMORIZING) {
      if (currentDigitIndex < sequence.length) {
        const displayTime = parseFloat(difficulty) * 1000; // Convert to milliseconds
        const timer = setTimeout(() => {
          setCurrentDigitIndex((prevIndex) => prevIndex + 1);
        }, displayTime);

        return () => clearTimeout(timer);
      } else {
        setTrainingState(TrainingState.RECALLING);
        startTimer();
      }
    }
  }, [currentDigitIndex, trainingState, sequence, difficulty]);

  const startTraining = () => {
    setTrainingState(TrainingState.MEMORIZING);
    setCurrentDigitIndex(0);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow 0 and 1
    const value = e.target.value.replace(/[^01]/g, "");
    setUserInput(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    stopTimer();

    // Calculate score
    const userSequence = userInput.split("").map(Number);
    const calculatedScore = calculateScore(userSequence, sequence);
    setScore(calculatedScore);
    setTrainingState(TrainingState.RESULT);

    if (user) {
      setIsLoading(true);
      try {
        // Save training session
        const { error: sessionError } = await supabase
          .from("training_sessions")
          .insert({
            user_id: user.id,
            discipline_id: 2, // Binary Digits
            difficulty: difficulty,
            score: calculatedScore,
            correct_answers: Math.floor(calculatedScore / 10), // Each correct digit is worth 10 points
            total_questions: sequence.length,
            accuracy: (calculatedScore / (sequence.length * 10)) * 100,
            duration: timer,
            session_data: {
              sequence,
              user_input: userSequence,
            },
          });

        if (sessionError) throw sessionError;

        // Check if it's a record
        const { data: recordData, error: recordError } = await supabase
          .from("records")
          .select("score")
          .eq("user_id", user.id)
          .eq("discipline_id", 2)
          .eq("difficulty", difficulty)
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
    setUserInput("");
    setCurrentDigitIndex(-1);
    setTimer(0);
    const length = getDifficultyLevelLength(difficulty) + 2; // Binary is easier, so add 2 to the length
    setSequence(generateBinarySequence(length));
    setIsRecord(false);
  };

  return (
    <div className="container py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Entrenamiento: Números Binarios ({difficulty}s)
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        {trainingState === TrainingState.READY && (
          <div className="text-center space-y-6">
            <p className="text-lg">
              Memorizarás {sequence.length} dígitos binarios mostrados a{" "}
              {difficulty} segundos por dígito.
            </p>
            <Button onClick={startTraining} size="lg">
              Comenzar
            </Button>
          </div>
        )}

        {trainingState === TrainingState.MEMORIZING && (
          <div className="flex flex-col items-center justify-center h-48">
            {currentDigitIndex < sequence.length ? (
              <div
                className="relative"
                key={currentDigitIndex} // Key helps with animation
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-full">
                  <div
                    className="h-full bg-primary-foreground transition-all duration-1000"
                    style={{
                      width: `100%`,
                      animation: `progress ${parseFloat(difficulty)}s linear`,
                    }}
                  ></div>
                </div>
                <div className="text-7xl font-bold animate-bounce mt-6 px-8 py-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {sequence[currentDigitIndex]}
                </div>
                <div className="text-sm text-gray-500 mt-4">
                  Dígito {currentDigitIndex + 1} de {sequence.length}
                </div>
              </div>
            ) : (
              <div className="text-xl">Preparando...</div>
            )}
          </div>
        )}

        {trainingState === TrainingState.RECALLING && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Tiempo: {formatTime(timer)}
              </div>
              <p className="font-medium">
                Ingresa los {sequence.length} dígitos binarios en orden:
              </p>
            </div>

            <Input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              maxLength={sequence.length}
              placeholder="Ingresa los dígitos aquí (solo 0 y 1)"
              className="text-center text-xl py-6"
              autoFocus
            />

            <div className="text-xs text-gray-500 text-center">
              {userInput.length}/{sequence.length} dígitos ingresados
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={userInput.length === 0}
            >
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
                {Math.floor(score / 10)} de {sequence.length} dígitos correctos
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">
                  Secuencia correcta:
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded border">
                  {sequence.join(" ")}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Tu respuesta:</div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded border">
                  {userInput.split("").join(" ")}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={handleTryAgain}>Intentar de nuevo</Button>
              <Button
                variant="outline"
                onClick={() => router.push("/disciplines/binary-digits")}
              >
                Cambiar dificultad
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
