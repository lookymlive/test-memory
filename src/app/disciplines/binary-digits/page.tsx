"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const difficulties = [
  { id: "0.5", label: "0.5 segundos", description: "Dificultad extrema" },
  { id: "1", label: "1 segundo", description: "Dificultad alta" },
  { id: "2", label: "2 segundos", description: "Dificultad media" },
  { id: "3", label: "3 segundos", description: "Dificultad baja" },
  { id: "4", label: "4 segundos", description: "Dificultad muy baja" },
];

export default function BinaryDigitsPage() {
  useAuth();
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  const handleStart = () => {
    if (selectedDifficulty) {
      router.push(
        `/disciplines/binary-digits/training?difficulty=${selectedDifficulty}`
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
          Números Binarios
        </h1>
        <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
          Entrena tu memoria con secuencias de números binarios (0 y 1) a
          diferentes velocidades.
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">¿Cómo funciona?</h2>
          <ol className="space-y-2 list-decimal pl-5">
            <li>
              Se te mostrará una secuencia de dígitos binarios (0 y 1), uno por
              uno.
            </li>
            <li>Cada dígito aparecerá durante el tiempo seleccionado.</li>
            <li>
              Deberás memorizar la secuencia completa en el orden correcto.
            </li>
            <li>Al finalizar, ingresa los dígitos que recuerdes.</li>
            <li>Obtendrás puntos por cada dígito recordado correctamente.</li>
          </ol>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Selecciona una dificultad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
