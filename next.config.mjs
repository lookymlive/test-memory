import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // Limitar el análisis de módulos para evitar errores de stack overflow
  webpack: (config, { isServer }) => {
    // Modificar el comportamiento de webpack para limitar la recursión
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/node_modules", "**/.git", "**/.next"],
    };

    // Limitar la profundidad de análisis
    config.module.rules.push({
      test: /\.js$/,
      enforce: "pre",
      use: ["source-map-loader"],
      exclude: [/node_modules/, /\.next/],
    });

    return config;
  },
  // Ignorar archivos específicos para evitar problemas durante la compilación
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    // Deshabilitar características experimentales que pueden causar problemas
    serverActions: false,
    serverComponentsExternalPackages: [],
  },
  // No output: "standalone" para evitar problemas
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
