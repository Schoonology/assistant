const config = {
  database: {
    path: process.env.DATABASE_PATH || ":memory:",
  },
  particle: {
    username: process.env.PARTICLE_USERNAME,
    password: process.env.PARTICLE_PASSWORD,
  },
};

export default config;
