import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Acerca de - Speed Memory",
  description: "Información sobre el proyecto Speed Memory",
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Acerca de Speed Memory
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Historia</h2>
        <p className="mb-4">
          Speed Memory comenzó como un simulador de entrenamiento mental
          desarrollado en 2015, diseñado para ayudar a entrenar diferentes
          disciplinas de memoria competitiva y asociado con campeones de memoria
          como Ramón Campayo y otros competidores destacados.
        </p>
        <p className="mb-4">
          En 2025, el proyecto ha sido modernizado por Lookym para convertirse en una
          aplicación web accesible desde cualquier dispositivo, manteniendo
          todas las funcionalidades del simulador original y ampliándolas con
          nuevas características.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Disciplinas</h2>
        <p className="mb-4">
          Speed Memory permite entrenar en diversas disciplinas de memoria,
          incluyendo:
        </p>
        <ul className="list-disc ml-6 mb-4 space-y-1">
          <li>Memorización de dígitos decimales (con diferentes tiempos)</li>
          <li>Memorización de números binarios (con diferentes tiempos)</li>
          <li>Memorización de matrices</li>
          <li>Memorización de formas y colores</li>
          <li>Y otras disciplinas de entrenamiento mental</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Tecnologías</h2>
        <p className="mb-4">
          Esta versión moderna de Speed Memory ha sido desarrollada utilizando:
        </p>
        <ul className="list-disc ml-6 mb-4 space-y-1">
          <li>Next.js para el frontend y backend</li>
          <li>Tailwind CSS para los estilos</li>
          <li>Supabase para la base de datos y autenticación</li>
          <li>Cloudinary para el almacenamiento de imágenes y videos</li>
        </ul>
      </section>

      <div className="flex justify-center mt-8">
        <Button asChild>
          <Link href="/disciplines">Explorar disciplinas</Link>
        </Button>
      </div>
    </div>
  );
}
