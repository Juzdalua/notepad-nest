module.exports = {
  apps: [
    {
      name: 'notepad-nest',
      script: 'dist/main.js',
      instances: '1',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      merge_logs: true,
    },
  ],
};
// #pm2 start ecosystem.config.js --env production
