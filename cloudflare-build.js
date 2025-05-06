// Script personalizado para el build de Cloudflare Pages
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Iniciando build personalizado para Cloudflare Pages...");

try {
  // 1. Ejecutar Next.js build con una configuración específica
  console.log("📦 Ejecutando Next.js build...");
  execSync('NODE_OPTIONS="--max-old-space-size=4096" next build', {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
      // Forzar runtime de edge para todos los componentes
      NEXT_RUNTIME: "edge",
    },
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
