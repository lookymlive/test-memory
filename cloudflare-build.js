// Script personalizado para el build de Cloudflare Pages
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

console.log("🚀 Iniciando build personalizado para Cloudflare Pages...");

try {
  // 1. Ejecutar Next.js build con una configuración específica
  console.log("📦 Ejecutando Next.js build...");

  // Detectar el sistema operativo para usar la sintaxis correcta
  const isWindows = os.platform() === "win32";

  // Configurar variables de entorno y comando según el sistema operativo
  const env = {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    NEXT_RUNTIME: "edge",
    NODE_OPTIONS: "--max-old-space-size=4096",
  };

  const buildCommand = "next build";

  // Ejecutar el comando de build
  execSync(buildCommand, {
    stdio: "inherit",
    env: env,
  });

  // 2. Copiar archivos estáticos adicionales
  console.log("📋 Copiando archivos estáticos...");

  // Asegurarse de que existe el directorio .next/static
  if (!fs.existsSync(path.join(process.cwd(), ".next", "static"))) {
    fs.mkdirSync(path.join(process.cwd(), ".next", "static"), {
      recursive: true,
    });
  }

  // Crear un archivo _headers para Cloudflare
  fs.writeFileSync(
    path.join(process.cwd(), ".next", "_headers"),
    `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: origin-when-cross-origin
  
# Cache assets
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
`
  );

  console.log("✅ Build completado con éxito para Cloudflare Pages");
} catch (error) {
  console.error("❌ Error durante el build:", error);
  process.exit(1);
}
