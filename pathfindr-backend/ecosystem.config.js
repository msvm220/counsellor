module.exports = {
  apps: [
    {
      name: 'pathfindr-api',
      script: 'src/server.js',
      instances: 'max',           // Use all available CPU cores
      exec_mode: 'cluster',       // Cluster mode for load balancing
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,
      // Graceful shutdown
      kill_timeout: 30000,
      listen_timeout: 10000,
      shutdown_with_message: true,
    },
  ],
};
