const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/gateway/:path*", // Cambiamos 'proxy-api' por 'gateway'
        destination: "https://api-staging.intelligentvideos.ai/api/:path*",
      },
    ];
  },
};
export default nextConfig;