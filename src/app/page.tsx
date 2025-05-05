import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 lg:py-32">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-center">
          <span className="text-primary">Test Memory</span>
        </h1>
        <p className="text-xl text-center max-w-md">
          Entrena tu memoria y compite con los mejores en diversas disciplinas
          de memoria.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/disciplines">Comenzar entrenamiento</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Conocer más</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
