"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-provider";
import { supabase } from "@/lib/supabase";
import {
  calculateShapesColorScore,
  colors,
  formatTime,
  generateShapesColorSequence,
  getColorClass,
  getShapeIcon,
  getShapesColorCount,
  shapes,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

enum TrainingState {
  READY = "ready",
  MEMORIZING = "memorizing",
  RECALLING = "recalling",
  RESULT = "result",
}

export default function ShapesColorsTrainingPage() {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "basic";
  const router = useRouter();
  const { user } = useAuth();

  const [sequence, setSequence] = useState<
    Array<{ shape: string; color: string }>
  >([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(-1);
  const [trainingState, setTrainingState] = useState<TrainingState>(
    TrainingState.READY
  );
  const [userSequence, setUserSequence] = useState<
    Array<{ shape: string; color: string }>
  >([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [score, setScore] = useState<number>(0);
  const [isRecord, setIsRecord] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Generate sequence when difficulty changes
    const count = getShapesColorCount(difficulty);
    setSequence(generateShapesColorSequence(count));
  }, [difficulty]);

  useEffect(() => {
    // Timer for memorizing phase
    if (trainingState === TrainingState.MEMORIZING) {
      if (currentItemIndex < sequence.length) {
        const displayTime = 2000; // 2 seconds per shape-color
        const timer = setTimeout(() => {
          setCurrentItemIndex((prevIndex) => prevIndex + 1);
        }, displayTime);

        return () => clearTimeout(timer);
      } else {
        setTrainingState(TrainingState.RECALLING);
        startTimer();
      }
    }
  }, [currentItemIndex, trainingState, sequence]);

  const startTraining = () => {
    setTrainingState(TrainingState.MEMORIZING);
    setCurrentItemIndex(0);
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

  const handleShapeSelect = (shape: string) => {
    if (trainingState !== TrainingState.RECALLING) return;
    setSelectedShape(shape);
  };

  const handleColorSelect = (color: string) => {
    if (trainingState !== TrainingState.RECALLING) return;
    setSelectedColor(color);
  };

  const handleAddToSequence = () => {
    if (!selectedShape || !selectedColor) return;

    const newItem = { shape: selectedShape, color: selectedColor };
    setUserSequence([...userSequence, newItem]);

    // Reset selections
    setSelectedShape(null);
    setSelectedColor(null);
  };

  const handleRemoveLastItem = () => {
    if (userSequence.length === 0) return;
    setUserSequence(userSequence.slice(0, -1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    stopTimer();

    // Calculate score
    const calculatedScore = calculateShapesColorScore(userSequence, sequence);
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
            discipline_id: 4, // Shapes and Colors
            difficulty: difficulty,
            score: calculatedScore,
            correct_answers: Math.floor(calculatedScore / 10), // Every shape and color pair is worth 10 points
            total_questions: sequence.length,
            accuracy: (calculatedScore / (sequence.length * 10)) * 100,
            duration: timer,
            session_data: {
              sequence,
              user_sequence: userSequence,
            },
          })
          .select();

        if (sessionError) throw sessionError;

        // Check if it's a record
        const { data: recordData, error: recordError } = await supabase
          .from("records")
          .select("score")
          .eq("user_id", user.id)
          .eq("discipline_id", 4)
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
    setUserSequence([]);
    setCurrentItemIndex(-1);
    setTimer(0);
    setSelectedShape(null);
    setSelectedColor(null);
    const count = getShapesColorCount(difficulty);
    setSequence(generateShapesColorSequence(count));
    setIsRecord(false);
  };

  return (
    <div className="container py-12 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Entrenamiento: Formas y Colores ({difficulty})
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        {trainingState === TrainingState.READY && (
          <div className="text-center space-y-6">
            <p className="text-lg">
              Memorizarás {sequence.length} formas y colores. Cada uno aparecerá
              por 2 segundos.
            </p>
            <Button onClick={startTraining} size="lg">
              Comenzar
            </Button>
          </div>
        )}

        {trainingState === TrainingState.MEMORIZING && (
          <div className="flex flex-col items-center justify-center h-56">
            {currentItemIndex < sequence.length ? (
              <div
                className="flex flex-col items-center"
                key={currentItemIndex}
              >
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 max-w-md">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: "100%", animation: "progress 2s linear" }}
                  ></div>
                </div>
                <div
                  className={`text-[100px] transform transition-all duration-500 scale-100 ${getColorClass(
                    sequence[currentItemIndex].color
                  )}`}
                >
                  <div className="flex items-center justify-center p-8 rounded-lg shadow-inner">
                    {getShapeIcon(sequence[currentItemIndex].shape)}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-4">
                  Elemento {currentItemIndex + 1} de {sequence.length}
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
                Selecciona las formas y colores en orden:
              </p>
            </div>

            {/* User sequence display */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-medium mb-2">Tu secuencia:</h3>
              <div className="flex flex-wrap gap-2">
                {userSequence.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">Vacío</div>
                ) : (
                  userSequence.map((item, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 flex items-center justify-center text-2xl rounded-md ${getColorClass(
                        item.color
                      )}`}
                    >
                      {getShapeIcon(item.shape)}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Shape selection */}
            <div>
              <h3 className="text-sm font-medium mb-2">
                Selecciona una forma:
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {shapes.map((shape) => (
                  <div
                    key={shape}
                    className={`h-12 w-12 flex items-center justify-center text-2xl border rounded-md cursor-pointer transition ${
                      selectedShape === shape
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary"
                    }`}
                    onClick={() => handleShapeSelect(shape)}
                  >
                    {getShapeIcon(shape)}
                  </div>
                ))}
              </div>
            </div>

            {/* Color selection */}
            <div>
              <h3 className="text-sm font-medium mb-2">Selecciona un color:</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`h-12 w-12 ${getColorClass(
                      color
                    )} rounded-md cursor-pointer transition ${
                      selectedColor === color ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>

            {/* Preview of current selection */}
            <div className="flex justify-center items-center gap-4">
              <div className="text-center">
                <h3 className="text-sm font-medium mb-2">Vista previa:</h3>
                <div className="h-16 w-16 flex items-center justify-center text-4xl rounded-lg mx-auto">
                  {selectedShape && selectedColor ? (
                    <div className={getColorClass(selectedColor)}>
                      {getShapeIcon(selectedShape)}
                    </div>
                  ) : (
                    <div className="text-gray-300 dark:text-gray-600">?</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleAddToSequence}
                  disabled={!selectedShape || !selectedColor}
                  size="sm"
                >
                  Agregar
                </Button>
                <Button
                  type="button"
                  onClick={handleRemoveLastItem}
                  disabled={userSequence.length === 0}
                  variant="outline"
                  size="sm"
                >
                  Quitar último
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              {userSequence.length}/{sequence.length} elementos seleccionados
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={userSequence.length < sequence.length}
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
                {Math.floor(score / 10)} de {sequence.length} elementos
                correctos
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
                <h3 className="text-sm font-medium mb-2">
                  Secuencia correcta:
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {sequence.map((item, index) => (
                    <div
                      key={`correct-${index}`}
                      className={`w-10 h-10 flex items-center justify-center text-2xl rounded-md ${getColorClass(
                        item.color
                      )}`}
                    >
                      {getShapeIcon(item.shape)}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Tu respuesta:</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {userSequence.map((item, index) => {
                    const correctShape = item.shape === sequence[index]?.shape;
                    const correctColor = item.color === sequence[index]?.color;
                    const colorClass = correctColor
                      ? getColorClass(item.color)
                      : "bg-red-100 dark:bg-red-950 text-gray-600 dark:text-gray-400";

                    return (
                      <div
                        key={`user-${index}`}
                        className={`w-10 h-10 flex items-center justify-center text-2xl rounded-md ${colorClass} ${
                          !correctShape && !correctColor ? "opacity-60" : ""
                        } ${!correctShape ? "line-through" : ""}`}
                      >
                        {getShapeIcon(item.shape)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={handleTryAgain}>Intentar de nuevo</Button>
              <Button
                variant="outline"
                onClick={() => router.push("/disciplines/shapes-colors")}
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
