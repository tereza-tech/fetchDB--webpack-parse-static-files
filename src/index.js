// init project
var path = require("path");
var express = require("express");
var app = express();

// We're using the "Bug Tracker" base template:
// https://airtable.com/shrUYWTEQIkk9P1Yq
var Airtable = require("airtable");
// Get the AIRTABLE_API_KEY and AIRTABLE_BASE_ID from https://airtable.com/api
// Them add them in CodeSandbox from the server control panel to the left, under Secret Keys
var base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);
var tableName = "Bugs and issues";
var viewName = "Bugs by priority";

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname + "../views/index.html"));
});

// Cache the records in case we get a lot of traffic.
// Otherwise, we'll hit Airtable's rate limit.
var cacheTimeoutMs = 5 * 1000; // Cache for 5 seconds.
var cachedResponse = null;
var cachedResponseDate = null;

app.get("/data", function (_, response) {
  if (cachedResponse && new Date() - cachedResponseDate < cacheTimeoutMs) {
    response.send(cachedResponse);
  } else {
    // Select the first 10 records from the view.
    base(tableName)
      .select({
        maxRecords: 10,
        view: viewName
      })
      .firstPage(function (error, records) {
        if (error) {
          response.send({ error: error });
        } else {
          cachedResponse = {
            records: records.map((record) => {
              return {
                name: record.get("Name"),
                picture: record.get("Attachments"),
                priority: record.get("Priority"),
                status: record.get("Status")
              };
            })
          };
          cachedResponseDate = new Date();
          response.send(cachedResponse);
        }
      });
  }
});

// Listen on port 8080
var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
