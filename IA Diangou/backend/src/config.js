const config = {
  PORT: process.env.PORT || 5003,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'diangou',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  JWT_SECRET: process.env.JWT_SECRET || 'diangou-secret-key',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

export { config };
export default config;

