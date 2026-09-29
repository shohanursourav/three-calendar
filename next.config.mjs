/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * Allow the hosted preview / tunnel hosts to talk to the dev server (harmless in production,
   * and handy when developing inside a container or Codespace).
   */
  allowedDevOrigins: ['*.e2b.app', '*.vercel.app', 'localhost', '127.0.0.1'],
};

export default nextConfig;
