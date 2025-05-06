"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const difficulties = [
  { id: "3x3", label: "3×3", description: "Dificultad baja" },
  { id: "4x4", label: "4×4", description: "Dificultad media" },
  { id: "5x5", label: "5×5", description: "Dificultad alta" },
];

export default function MatricesPage() {
  useAuth();
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  const handleStart = () => {
    if (selectedDifficulty) {
      router.push(`/disciplines/matrices/training?size=${selectedDifficulty}`);
    }
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link
          href="/disciplines"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 flex items-center"
        >
          ← Volver a disciplinas
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-4">Matrices</h1>
        <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
          Entrena tu memoria visual con matrices de números y patrones.
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">¿Cómo funciona?</h2>
          <ol className="space-y-2 list-decimal pl-5">
            <li>
              Se te mostrará una matriz de números durante un tiempo limitado.
            </li>
            <li>
              Deberás memorizar la posición y valor de cada número en la matriz.
            </li>
            <li>
              Después, se te pedirá que recuerdes la ubicación de los números.
            </li>
            <li>Obtendrás puntos por cada número recordado correctamente.</li>
            <li>Mayor tamaño de matriz = mayor dificultad.</li>
          </ol>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Selecciona un tamaño de matriz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficulties.map((difficulty) => (
              <div
                key={difficulty.id}
                className={`p-4 border rounded-md cursor-pointer transition ${
                  selectedDifficulty === difficulty.id
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary"
                }`}
                onClick={() => setSelectedDifficulty(difficulty.id)}
              >
                <h3 className="font-medium">{difficulty.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {difficulty.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={handleStart} disabled={!selectedDifficulty}>
          Comenzar entrenamiento
        </Button>
      </div>
    </div>
  );
}
