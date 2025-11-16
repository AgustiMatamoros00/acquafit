const PROXY_CONFIG = [
  {
    context: [
      "/auth",
      "/users",
      "/workouts",
      "/exercises",
      "/sets",
      "/workout_x_exercise"
    ],
    target: "http://localhost:3000",
    secure: false,
    changeOrigin: true,
    logLevel: "debug"
  }
];

module.exports = PROXY_CONFIG;

