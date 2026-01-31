const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/gateway/:path*", // Cambiamos 'proxy-api' por 'gateway'
        destination: "https://aivideosolnar.majomaken.dev/api/:path*",
      },
    ];
  },
};
export default nextConfig;

//https://aivideosolnar.majomaken.dev
//https://api-staging.intelligentvideos.ai