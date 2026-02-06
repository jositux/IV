const nextConfig = {
  //images: {
  //unoptimized: true, // Esto evita que Next use librerías de C como sharp
  //},
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