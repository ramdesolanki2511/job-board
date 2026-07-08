module.exports = {
  apps: [
    {
      name: "jobboard-api",
      script: "dist/server.js",
      cwd: __dirname,
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
