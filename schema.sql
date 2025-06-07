
CREATE TABLE users (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       email TEXT UNIQUE NOT NULL,
                       password_hash TEXT NOT NULL,
                       full_name TEXT
);

CREATE TABLE sessions (
                          id TEXT PRIMARY KEY,
                          user_id INTEGER NOT NULL,
                          expires_at INTEGER NOT NULL,
                          FOREIGN KEY (user_id) REFERENCES users(id)
);
