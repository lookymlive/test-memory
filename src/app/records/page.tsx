import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Récords - Speed Memory",
  description: "Récords mundiales y personales en disciplinas de memoria",
};

const records = [
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

export default function RecordsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Récords Mundiales
      </h1>
      <p className="text-lg mb-8">
        Los mejores resultados registrados en las diferentes disciplinas de
        memoria.
      </p>

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
              {records.map((record, index) => (
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

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline">Ver mis récords personales</Button>
      </div>
    </div>
  );
}
