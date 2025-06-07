import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  //   env: {
  //   BACKEND_URL: process.env.NODE_ENV === 'production'
  //     ? 'https://tu-backend-produccion.com'
  //     : 'http://localhost:3000'
  // },
  eslint: {
    // Desactiva ESLint durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Permite builds de producción aunque hayan errores de TypeScript
    // no es recomendado para producción real
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
