module.exports = {
  apps: [
    {
      name: 'nova-video-worker',
      script: 'tsx',
      args: 'src/worker.ts',
      cwd: __dirname,
      env: {
        NODE_OPTIONS: '--use-system-ca',
      },
      restart_delay: 5000,
      max_restarts: 20,
      watch: false,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
