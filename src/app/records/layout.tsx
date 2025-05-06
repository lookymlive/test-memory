import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Récords - Test Memory",
  description: "Récords mundiales y personales en disciplinas de memoria",
};

export default function RecordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
