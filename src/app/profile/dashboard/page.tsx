"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-provider";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StatsType {
  total_sessions: number;
  total_score: number;
  avg_accuracy: number;
  most_practiced: { discipline_id: number; count: number; name: string } | null;
  best_record: {
    discipline_id: number;
    score: number;
    name: string;
    difficulty: string;
  } | null;
  recent_days_active: number;
}

const disciplineNames: Record<number, string> = {
  1: "Dígitos Decimales",
  2: "Números Binarios",
  3: "Matrices",
  4: "Formas y Colores",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<StatsType | null>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch recent training sessions
        const { data: sessions, error: sessionsError } = await supabase
          .from("training_sessions")
          .select("*, disciplines(name)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (sessionsError) throw sessionsError;

        setRecentSessions(sessions || []);

        // Calculate stats
        const { data: statsData, error: statsError } = await supabase
          .from("training_sessions")
          .select(
            "discipline_id, score, accuracy, created_at, disciplines(name)"
          )
          .eq("user_id", user.id);

        if (statsError) throw statsError;

        if (statsData && statsData.length > 0) {
          // Process statistics
          const totalSessions = statsData.length;
          const totalScore = statsData.reduce(
            (sum, item) => sum + item.score,
            0
          );
          const avgAccuracy =
            statsData.reduce((sum, item) => sum + item.accuracy, 0) /
            totalSessions;

          // Find most practiced discipline
          const disciplineCounts: Record<
            number,
            { count: number; name: string }
          > = {};
          statsData.forEach((session) => {
            if (!disciplineCounts[session.discipline_id]) {
              disciplineCounts[session.discipline_id] = {
                count: 0,
                name:
                  session.disciplines?.[0]?.name ||
                  disciplineNames[session.discipline_id] ||
                  "Unknown",
              };
            }
            disciplineCounts[session.discipline_id].count++;
          });

          let mostPracticed: {
            discipline_id: number;
            count: number;
            name: string;
          } | null = null;
          Object.entries(disciplineCounts).forEach(([id, { count, name }]) => {
            if (!mostPracticed || count > mostPracticed.count) {
              mostPracticed = { discipline_id: parseInt(id), count, name };
            }
          });

          // Get best record
          const { data: recordData, error: recordError } = await supabase
            .from("records")
            .select("discipline_id, score, difficulty, disciplines(name)")
            .eq("user_id", user.id)
            .order("score", { ascending: false })
            .limit(1);

          if (recordError) throw recordError;

          const bestRecord =
            recordData && recordData.length > 0
              ? {
                  discipline_id: recordData[0].discipline_id,
                  score: recordData[0].score,
                  difficulty: recordData[0].difficulty,
                  name:
                    recordData[0].disciplines?.[0]?.name ||
                    disciplineNames[recordData[0].discipline_id] ||
                    "Unknown",
                }
              : null;

          // Calculate active days in the last 30 days
          const now = new Date();
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

          const activeDaysSet = new Set(
            statsData
              .filter(
                (session) => new Date(session.created_at) >= thirtyDaysAgo
              )
              .map((session) => new Date(session.created_at).toDateString())
          );

          const recentDaysActive = activeDaysSet.size;

          setStats({
            total_sessions: totalSessions,
            total_score: totalScore,
            avg_accuracy: avgAccuracy,
            most_practiced: mostPracticed,
            best_record: bestRecord,
            recent_days_active: recentDaysActive,
          });
        } else {
          setStats({
            total_sessions: 0,
            total_score: 0,
            avg_accuracy: 0,
            most_practiced: null,
            best_record: null,
            recent_days_active: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format discipline name and difficulty
  const formatTrainingSession = (session: any) => {
    const disciplineName =
      session.disciplines?.[0]?.name ||
      disciplineNames[session.discipline_id] ||
      "Unknown";

    let difficultyText = session.difficulty;
    if (session.discipline_id === 1 || session.discipline_id === 2) {
      // Decimal digits or binary
      difficultyText = `${session.difficulty}s`;
    } else if (session.discipline_id === 3) {
      // Matrices - already formatted as 3x3, 4x4, etc.
      difficultyText = session.difficulty;
    } else if (session.discipline_id === 4) {
      // Shapes and colors
      difficultyText =
        session.difficulty.charAt(0).toUpperCase() +
        session.difficulty.slice(1);
    }

    return `${disciplineName} (${difficultyText})`;
  };

  if (!user) {
    return (
      <div className="container py-12 max-w-4xl mx-auto">
        <div className="text-center p-8 border rounded-lg">
          <h3 className="text-xl font-medium mb-4">
            Inicia sesión para ver tus estadísticas
          </h3>
          <p className="text-muted-foreground mb-4">
            Necesitas iniciar sesión para ver tu dashboard de entrenamiento.
          </p>
          <Button onClick={() => router.push("/login")}>Iniciar Sesión</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Dashboard de Entrenamiento
      </h1>
      <p className="text-muted-foreground mb-8">
        Analiza tu progreso y resultados de entrenamiento
      </p>

      {isLoading ? (
        <div className="text-center p-8">
          <p>Cargando estadísticas...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sesiones Totales
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.total_sessions || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Puntuación Total
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.total_score || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Precisión Media
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? `${Math.round(stats.avg_accuracy)}%` : "0%"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Días Activos (30d)
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.recent_days_active || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Disciplina Más Practicada</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.most_practiced ? (
                  <div>
                    <p className="text-xl font-bold">
                      {stats.most_practiced.name}
                    </p>
                    <p className="text-muted-foreground">
                      {stats.most_practiced.count} sesiones
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Sin datos todavía</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mejor Récord</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.best_record ? (
                  <div>
                    <p className="text-xl font-bold">
                      {stats.best_record.score} puntos
                    </p>
                    <p className="text-muted-foreground">
                      {stats.best_record.name} ({stats.best_record.difficulty})
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Sin datos todavía</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Sessions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Sesiones Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                {recentSessions.length > 0 ? (
                  <div className="space-y-8">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {formatTrainingSession(session)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(session.created_at)}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {session.score} puntos
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No hay sesiones recientes
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={() => router.push("/disciplines")}>
              Comenzar Entrenamiento
            </Button>
            <Button variant="outline" asChild>
              <Link href="/records">Ver Récords</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
