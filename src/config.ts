const config = {
  database: {
    path: ":memory:",
  },
  particle: {
    username: process.env.PARTICLE_USERNAME,
    password: process.env.PARTICLE_PASSWORD,
  },
};

export default config;
