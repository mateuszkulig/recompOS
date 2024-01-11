// sql.js

/**
 * Used SQL queries
 */
const sqlGetRecords = "SELECT * FROM `filesystem`";
const sqlSetRecord = 'INSERT INTO `filesystem` (filename, content) VALUES ("<REPLACE1>", "<REPLACE2>")';


/**
 * Get all records from the filesystem database
 * @param {Connection}      databaseFilesystem      MySql connection object 
 * @param {(Array) => void} callback                Callback for request handler
 */
const getAllRecords = (databaseFilesystem, callback) => {
    // let records;
    databaseFilesystem.query(sqlGetRecords, (err, result) => {
        if (err) {
            throw err;
        } else {
            callback(result);
        }
    })
}


/**
 * Create an entry in filesystem database
 * @param {Connection}      databaseFilesystem      MySql connection object 
 * @param {String}          filename                Filename of newly created file
 * @param {(Array) => void} callback                Callback for request handler
 */
const createRecord = (databaseFilesystem, filename, content, callback) => {
    const success = {ok: true};
    databaseFilesystem.query(
        sqlSetRecord.replace("<REPLACE1>", filename).replace("<REPLACE2>", content),    // REPLACEX is expected placeholder
        (err, result) => {   
        if (err) {
            throw err;
        } else {
            callback(success);
        }
    })
}


module.exports = {
    getAllRecords,
    createRecord
}
