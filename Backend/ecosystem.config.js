module.exports = {
  apps: [
    {
      name: "app1",
      script: "node dist/app.js",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
