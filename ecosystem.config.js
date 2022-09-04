module.exports = {
  apps : [{
    name : "benefit",
    script: "./dist/main.js",
    exp_backoff_restart_delay: 3000,
    max_memory_restart: '450M',
    max_restarts: 10,
    watch: true,
    instances: 2, 
    exec_mode: "cluster",
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    }
  }]
}
