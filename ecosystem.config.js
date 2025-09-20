module.exports = {
  apps: [
    {
      name: 'baddie-reseller-api',
      script: './backend/dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true
    },
    {
      name: 'baddie-reseller-ai',
      script: './ai-engine/main.py',
      interpreter: 'python3',
      instances: 1,
      env: {
        PYTHONPATH: './ai-engine',
        ENV: 'development'
      },
      env_production: {
        PYTHONPATH: './ai-engine',
        ENV: 'production'
      },
      error_file: './logs/ai-error.log',
      out_file: './logs/ai-out.log',
      log_file: './logs/ai-combined.log',
      time: true
    }
  ]
};