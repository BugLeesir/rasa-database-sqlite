/**
 * Module handles database management
 *
 * The sample data is for a chat log with one table:
 * Messages: id + message text
 */

const fs = require("fs");
const dbFile = "./.data/chat.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
const casual = require("casual");
let db;

//SQLite wrapper for async / await connections https://www.npmjs.com/package/sqlite
dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;

    try {
      if (!exists) {
        await db.run(
          "CREATE TABLE Messages (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT)"
        );
        for (let r = 0; r < 5; r++)
          await db.run(
            "INSERT INTO Messages (message) VALUES (?)",
            casual.catch_phrase
          );
      }
      console.log(await db.all("SELECT * from Messages"));
    } catch (dbError) {
      console.error(dbError);
    }
  });

// Server script calls these methods to connect to the db
module.exports = {
  
  /**
   *  测试数据库的接口
   * 
   */

  // Get the messages in the database
  getMessages: async () => {
    try {
      return await db.all("SELECT * from Messages");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  // Add new message
  addMessage: async message => {
    let success = false;
    try {
      success = await db.run("INSERT INTO Messages (message) VALUES (?)", [
        message
      ]);
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
  },

  // Update message text
  updateMessage: async (id, message) => {
    let success = false;
    try {
      success = await db.run(
        "Update Messages SET message = ? WHERE id = ?",
        message,
        id
      );
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
  },

  // Remove message
  deleteMessage: async id => {
    let success = false;
    try {
      success = await db.run("Delete from Messages WHERE id = ?", id);
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
  },

    /**
     * 
     * 水文站数据库的接口
     */

    // Get hydrometric_station in the database
    getHydrometricStation: async () => {
      try {
        return await db.all("SELECT * from hydrometric_station");
      } catch (dbError) {
        console.error(dbError);
      }
    },
    
    // Get waterlevel in the database
    getWaterLevel: async () => {
      try {
        return await db.all("SELECT * from waterlevel");
      } catch (dbError) {
        console.error(dbError);
      }
    },

    // Get hydrometric_station by name
    getHydrometricStationByName: async name => {
      try {
        return await db.all("SELECT * from hydrometric_station where name = ?", name);
      } catch (dbError) {
        console.error(dbError);
      }
    },

    // Get waterLevel by StationId
    getWaterLevelByStationId: async stationId => {
      try {
        return await db.all("SELECT * from waterlevel where station_id = ?", stationId);
      } catch (dbError) {
        console.error(dbError);
      }
    }
};
