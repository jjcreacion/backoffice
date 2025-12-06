module.exports = {
  apps : [{
    name: 'backoffice-tnb',
    script: 'npm',
    args: 'start', 
    exec_mode: 'cluster',
    instances: max, 
    out_file: '/var/www/backoffice/logs/out.log',
    error_file: '/var/www/backoffice/logs/error.log',

    env_production: {
      NODE_ENV: 'production',
      PORT: 3001, 
      NEXT_PUBLIC_BASE_URL: 'http://216.246.113.71',
      NEXT_PUBLIC_PORT: 8080,
    }
  }]
};