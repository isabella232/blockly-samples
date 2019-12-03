/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Util scripts for interacting with the database.
 * @author navil@google.com (Navil Perez)
 */

const db = require('./db');

/**
 * Query the database for rows since the given server id.
 * @param {number} serverId serverId for the lower bound of the query.
 * @return {!Promise} Promise object represents the rows since the last given
 * serverId.
 * @public
 */
function queryDatabase(serverId) {
  return new Promise ((resolve, reject) => {
    db.all(`SELECT * from eventsdb WHERE serverId > ${serverId};`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => {
          row.events = JSON.parse(row.events);
        });
        resolve(rows);
      };
    });
  });
};

/**
 * Add rows to the database.
 * Rows are added transactionally.
 * @param {!Promise} Promise object represents the success of the write.
 * @public
 */
function addToServer(entry) {

  return new Promise((resolve, reject) => {
    db.run('INSERT INTO eventsdb(events, entryId) VALUES(?,?)',
        [JSON.stringify(entry.events), entry.entryId], (err) => {
      if (err) {
        console.error(err.message);
        reject(err);
      };
    });
    resolve();
  });
};

module.exports.queryDatabase = queryDatabase;
module.exports.addToServer = addToServer;