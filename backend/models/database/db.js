import sqlite3 from 'sqlite3'
import path from 'path';

const dbFile = './models/database/database.db'; 


const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error opening database ' + path.resolve(dbFile) + ': ' + err.message);
  } else {
    console.log('Connected to the SQLite database ' + path.resolve(dbFile));
  }
});

export default db;