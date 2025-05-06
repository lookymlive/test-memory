import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Test Memory",
  description:
    "Analiza tu progreso y resultados de entrenamiento en Test Memory",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
