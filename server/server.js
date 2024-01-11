// server.js

const express = require("express");
const mysql = require("mysql");
const filesystemApi = require("./sql");
const bodyParser = require('body-parser');

const PORT = 3001;


/**
 * Setup database credentials and filesystem connection
 */
const databaseCredentials = {
	host: "localhost",
	user: "root",
	password: "",
	database: "recompos",
	charset: "utf8mb4_general_ci",
  	port: 3306
};


/**
 * Connect to database
 */
const databaseFilesystem = mysql.createConnection(databaseCredentials);

databaseFilesystem.connect((err) =>  {
	if (err) throw err;
	console.log("Connected to database");
});


/**
 * Endpoints configuration
 */
const app = express();

/**
 * Host static files from build directory
 * NOTE: this breaks the static hosting if you are not running from main directory (.. relative to this file)
 */
app.use(express.static("build"));

/**
 * getFiles endpoint that outputs all of the files
 */
app.get("/api/get-files", (req, res) => {
	filesystemApi.getAllRecords(databaseFilesystem, (results) => res.json(results));
});

/**
 * createFile endpoint that adds a file
 */
app.post("/api/create-file", bodyParser.json(), (req, res) => {
	console.log(req);
	filesystemApi.createRecord(databaseFilesystem, req.body.filename, req.body.content, (results => res.json(results)));
})

/**
 * Setting up the port
 */
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
