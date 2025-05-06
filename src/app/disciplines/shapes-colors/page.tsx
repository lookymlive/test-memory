"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const difficulties = [
  { id: "basic", label: "Básico", description: "5 formas y colores" },
  {
    id: "intermediate",
    label: "Intermedio",
    description: "8 formas y colores",
  },
  { id: "advanced", label: "Avanzado", description: "12 formas y colores" },
];

export default function ShapesColorsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  const handleStart = () => {
    if (selectedDifficulty) {
      router.push(
        `/disciplines/shapes-colors/training?difficulty=${selectedDifficulty}`
      );
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
        <h1 className="text-3xl font-bold tracking-tight mt-4">
          Formas y Colores
        </h1>
        <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
          Mejora tu memoria asociativa con secuencias de formas y colores.
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">¿Cómo funciona?</h2>
          <ol className="space-y-2 list-decimal pl-5">
            <li>
              Se te mostrará una secuencia de formas con diferentes colores.
            </li>
            <li>Cada forma y color aparecerá por 2 segundos.</li>
            <li>
              Deberás memorizar tanto la forma como el color de cada elemento en
              la secuencia.
            </li>
            <li>
              Al finalizar, selecciona las formas y colores en el orden
              correcto.
            </li>
            <li>
              Obtendrás puntos por cada forma y color recordado correctamente.
            </li>
          </ol>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Selecciona una dificultad
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
