let db = 'trudo_db'
let host = 'db'
let drop = false
if (process.env.NODE_ENV === 'test') db += "_test"
if (process.env.NODE_ENV === 'test') drop = true
if (process.env.NODE_ENV === 'test') host = 'db_test'

module.exports = {
  "type": "mysql",
  "host": host,
  "port": 3306,
  "username": "root",
  "password": "admin321",
  "database": db,
  "synchronize": true,
  "dropSchema": drop,
  "logging": false,
  "entities": ["dist/**/*.entity{.ts,.js}", "src/**/*.entity{.ts,.js}"],
  "migrations": ["dist/migration/**/*.js"],
  "subscribers": ["dist/**/*.subscriber.js"],
  "cli": {
    "entitiesDir": "src/entities",
    "migrationsDir": "src/migration",
    "subscribersDir": "src/subscriber"
  }
}
