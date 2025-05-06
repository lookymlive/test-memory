export const runtime = "edge";

import Link from "next/link";

export const metadata = {
  title: "Disciplinas - Test Memory",
  description: "Explora las diferentes disciplinas de entrenamiento de memoria",
};

const disciplines = [
  {
    id: "decimal-digits",
    title: "Dígitos Decimales",
    description:
      "Entrena tu memoria con secuencias de números decimales a diferentes velocidades.",
    icon: "🔢",
    variants: [
      "0.5 segundos",
      "1 segundo",
      "2 segundos",
      "3 segundos",
      "4 segundos",
    ],
  },
  {
    id: "binary-digits",
    title: "Números Binarios",
    description:
      "Memoriza secuencias de números binarios (0 y 1) con diferentes intervalos de tiempo.",
    icon: "🔀",
    variants: [
      "0.5 segundos",
      "1 segundo",
      "2 segundos",
      "3 segundos",
      "4 segundos",
    ],
  },
  {
    id: "matrices",
    title: "Matrices",
    description:
      "Entrena tu memoria visual con matrices de números y patrones.",
    icon: "📊",
    variants: ["3x3", "4x4", "5x5"],
  },
  {
    id: "shapes-colors",
    title: "Formas y Colores",
    description:
      "Mejora tu memoria asociativa con secuencias de formas y colores.",
    icon: "🎨",
    variants: ["Básico", "Intermedio", "Avanzado"],
  },
];

export default function DisciplinesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Disciplinas de Memoria
      </h1>
      <p className="text-lg mb-8">
        Explora las diferentes disciplinas disponibles para entrenar tu memoria
        y mejorar tus habilidades cognitivas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {disciplines.map((discipline) => (
          <div
            key={discipline.id}
            className="rounded-lg border bg-card text-card-foreground shadow"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="text-4xl mb-4">{discipline.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{discipline.title}</h3>
              <p className="text-sm mb-4 flex-grow">{discipline.description}</p>

              <div className="text-sm text-muted-foreground mb-4">
                <h4 className="font-medium mb-1">Variantes:</h4>
                <ul className="flex flex-wrap gap-1">
                  {discipline.variants.map((variant) => (
                    <li
                      key={variant}
                      className="px-2 py-0.5 bg-secondary rounded-sm text-xs"
                    >
                      {variant}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/disciplines/${discipline.id}`}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full"
              >
                Explorar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
