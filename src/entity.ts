import { type Database } from "better-sqlite3";

export default class Entity {
  db: Database;
  name: string;

  static init(db: Database) {
    return db
      .prepare(
        "CREATE TABLE IF NOT EXISTS data (entity text NOT NULL, key text NOT NULL, value text, PRIMARY KEY (entity, key))"
      )
      .run();
  }

  constructor(db: Database, name: string) {
    Entity.init(db);

    this.db = db;
    this.name = name;
  }

  async get(key: string) {
    const result = await this.db
      .prepare("SELECT value FROM data WHERE entity = ? AND key = ?")
      .get([this.name, key]);

    if (result?.value == null) {
      return null;
    }

    return JSON.parse(result.value);
  }

  set(key: string, value: unknown) {
    return this.db
      .prepare(
        "INSERT INTO data (entity, key, value) VALUES (?, ?, ?) ON CONFLICT DO UPDATE SET value = EXCLUDED.value"
      )
      .run([this.name, key, JSON.stringify(value)]);
  }
}
