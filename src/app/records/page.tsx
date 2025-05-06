"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-provider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// World records data (static)
const worldRecords = [
  {
    prueba: "Decimal 1 second",
    digitos: "21",
    persona: "Ramón Campayo",
    fecha: "05/09/2015",
    lugar: "San Sebastián",
  },
  {
    prueba: "Decimal 4 seconds",
    digitos: "31",
    persona: "Joaquín García",
    fecha: "06/09/2015",
    lugar: "San Sebastián",
  },
  {
    prueba: "Color Shapes",
    puntos: "3185",
    persona: "Joaquín García",
    fecha: "05/09/2015",
    lugar: "San Sebastián",
  },
  {
    prueba: "Binary 1 second",
    digitos: "52",
    persona: "Miguel A. Vergara",
    fecha: "06/09/2015",
    lugar: "San Sebastián",
  },
  {
    prueba: "Binary 4 seconds",
    digitos: "96",
    persona: "Ramón Campayo",
    fecha: "18/12/2010",
    lugar: "Albacete",
  },
  {
    prueba: "Matrices",
    puntos: "2800",
    persona: "Víctor Rodrigo",
    fecha: "05/09/2015",
    lugar: "San Sebastián",
  },
  {
    prueba: "Puntuacion",
    puntos: "14824",
    persona: "Ramón Campayo",
    fecha: "06/09/2015",
    lugar: "San Sebastián",
  },
];

// Discipline mapping for display names
const disciplineMap: Record<number, string> = {
  1: "Dígitos Decimales",
  2: "Números Binarios",
  3: "Matrices",
  4: "Formas y Colores",
};

export default function RecordsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [personalRecords, setPersonalRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("world");

  useEffect(() => {
    const fetchPersonalRecords = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("records")
          .select(
            "id, discipline_id, difficulty, score, created_at, disciplines(name)"
          )
          .eq("user_id", user.id)
          .order("score", { ascending: false });

        if (error) {
          console.error("Error fetching records:", error);
          return;
        }

        setPersonalRecords(data || []);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalRecords();
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  // Format difficulty for display
  const formatDifficulty = (difficulty: string, disciplineId: number) => {
    if (disciplineId === 3) {
      // Matrices
      return difficulty; // Already formatted as "3x3", "4x4", etc.
    } else if (disciplineId === 4) {
      // Shapes and Colors
      return difficulty.charAt(0).toUpperCase() + difficulty.slice(1); // Capitalize
    } else {
      // Decimal and Binary digits (displayed as seconds)
      return `${difficulty}s`;
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Récords</h1>
      <p className="text-lg mb-8">
        Consulta los mejores resultados registrados y tus récords personales.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="world">Récords Mundiales</TabsTrigger>
          <TabsTrigger value="personal">Mis Récords</TabsTrigger>
        </TabsList>

        <TabsContent value="world">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Disciplina
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Resultado
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Persona
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Fecha
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Lugar
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {worldRecords.map((record, index) => (
                    <tr
                      key={index}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">{record.prueba}</td>
                      <td className="p-4 align-middle font-medium">
                        {record.digitos
                          ? `${record.digitos} dígitos`
                          : `${record.puntos} puntos`}
                      </td>
                      <td className="p-4 align-middle">{record.persona}</td>
                      <td className="p-4 align-middle">{record.fecha}</td>
                      <td className="p-4 align-middle">{record.lugar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personal">
          {!user ? (
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-xl font-medium mb-4">
                Inicia sesión para ver tus récords
              </h3>
              <p className="text-muted-foreground mb-4">
                Necesitas iniciar sesión para ver y registrar tus récords
                personales.
              </p>
              <Button onClick={() => router.push("/login")}>
                Iniciar Sesión
              </Button>
            </div>
          ) : isLoading ? (
            <div className="text-center p-8">
              <p>Cargando récords...</p>
            </div>
          ) : personalRecords.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-xl font-medium mb-4">
                No tienes récords personales
              </h3>
              <p className="text-muted-foreground mb-4">
                Comienza a entrenar para registrar tus primeros récords.
              </p>
              <Button onClick={() => router.push("/disciplines")}>
                Comenzar Entrenamiento
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Disciplina
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Dificultad
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Puntuación
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {personalRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          {disciplineMap[record.discipline_id]}
                        </td>
                        <td className="p-4 align-middle">
                          {formatDifficulty(
                            record.difficulty,
                            record.discipline_id
                          )}
                        </td>
                        <td className="p-4 align-middle font-medium">
                          {record.score} puntos
                        </td>
                        <td className="p-4 align-middle">
                          {formatDate(record.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button onClick={() => router.push("/disciplines")}>
              Volver a Entrenar
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
