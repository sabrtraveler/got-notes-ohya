// Setting variables for the required modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

// Using express library
const app = express();

// Setting up a port
const PORT = process.env.PORT || 3000;

// Allows the server to talk to the client
app.use(express.static(__dirname + "/public"));
// Fortmatting
app.use(express.urlencoded({ extended: true }));
// Use json format with express
app.use(express.json());

// Get request for the notes path
// Sends the notes.html file back to the client

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// API request for the notes
// Read the db.json file
// If the file is empty initialize it as an empty array
// Check to see if the objects have ids
// If they don't then give them ids
// Send back the data to the client side
app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    if (data === "") {
      data = "[]";
      fs.writeFile("./db/db.json", data, function (err) {
        if (err) throw err;
      });
    }
    const addIdtoNotes = JSON.parse(data).map(function (note) {
      if (!note.hasOwnProperty("id")) {
        note.id = uuid.v4();
      }
      return note;
    });
    fs.writeFile("./db/db.json", JSON.stringify(addIdtoNotes), function (err) {
      if (err) throw err;
    });

    return res.json(addIdtoNotes);
  });
});

// Get request to index page
// Send the html file back
app.get("*", function (req, res) {
  res.redirect("/");
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Post reques
// Get the data from the client and give the object a unique id
// Read the json file and add the new object, then rewrite the JSON file
app.post("/api/notes", function (req, res) {
  let allNotes;
  const newNote = req.body;
  newNote.id = uuid.v4();
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    allNotes = JSON.parse(data);
    allNotes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(allNotes), function (err) {
      if (err) throw err;
    });
  });
  res.json(newNote);
});

// Delete request
// Remove the object that the user has chosen to delete from the json file and rewrite it
// Return the data back to the user
app.delete("/api/notes/:id", function (req, res) {
  let query = { _id: req.params.id };
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    let allNotes = JSON.parse(data);
    const newNotes = allNotes.filter(function (note) {
      if (note.id !== query._id) {
        return note;
      }
    });
    fs.writeFile("./db/db.json", JSON.stringify(newNotes), function (err) {
      if (err) throw err;
      return res.json(newNotes);
    });
  });
});

// Enure that the server is listening to PORT 3000
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
