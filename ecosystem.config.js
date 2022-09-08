module.exports = {
  apps: [{
    // General
    name : "benefit",
    script: "./dist/main.js",

    // Advanced features
    instances: 2, 
    exec_mode: "cluster",
    watch: true,

    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    },

    // Log files
    error_log: './logs/error.log',
    out_file: './logs/output.log',

    // Control flow
    max_restarts: 10,
    exp_backoff_restart_delay: 3000,
    max_memory_restart: '450M',
  }]
}
