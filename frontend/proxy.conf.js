const PROXY_CONFIG = [
  {
    context: [
      "/auth"
    ],
    target: "http://backend:3000",
    secure: false,
    changeOrigin: true,
    logLevel: "debug"
  }
];

module.exports = PROXY_CONFIG; 