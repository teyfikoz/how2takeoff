module.exports = {
  apps: [{
    name: 'how2takeoff',
    script: './dist/index.js',
    cwd: '/var/www/how2takeoff',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 8002,
      DATABASE_URL: 'postgresql://how2takeoff_user:how2takeoff_secure_2024@localhost:5432/how2takeoff_db',
      SESSION_SECRET: 'how2takeoff_secret_key_2024_xyz_secure'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
