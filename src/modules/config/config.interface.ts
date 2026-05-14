export type HostConfig = {
  host: string;
  port: number;
};

export type DatabaseConfig = {
  url: string;
};

export type RedisConfig = {
  url: string;
};

export type AppConfig = {
  host: HostConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
};
