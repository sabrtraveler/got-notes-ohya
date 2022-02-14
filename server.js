// assigning variables for the modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

//assigning variable for express 
const app = express();

// assigning variable for the port set up
const PORT = process.env.PORT || 3000;

// this makes sure the server can communicate with the client
app.use(express.static(__dirname + "/public"));
// it parses incoming requests with urlencoded payloads. The “extended” syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded. 
app.use(express.urlencoded({ extended: true }));
// it allows json with express
app.use(express.json());

// for the notes path create a Get Request 
app.get("/notes", function (req, res) {
// sending the notes.html file to the client
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// when there is an api request
app.get("/api/notes", function (req, res) {
// fs readfile on db.json
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
// if the db.json file is empty initialize as empty array
    if (data === "") {
      data = "[]";
      fs.writeFile("./db/db.json", data, function (err) {
        if (err) throw err;
      });
    }
    const addIdtoNotes = JSON.parse(data).map(function (note) {
// check if the objects have ids
      if (!note.hasOwnProperty("id")) {
// if there are no ids then give them one
        note.id = uuid.v4();
      }
      return note;
    });
    fs.writeFile("./db/db.json", JSON.stringify(addIdtoNotes), function (err) {
      if (err) throw err;
    });
// send the data back to the client
    return res.json(addIdtoNotes);
  });
});

// Get request for index.html
app.get("*", function (req, res) {
  res.redirect("/");
// send index.html back
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// post request on notes
app.post("/api/notes", function (req, res) {
  let allNotes;
  // retrieve the data from client 
  const newNote = req.body;
  //assign an id to the object
  newNote.id = uuid.v4();
  // read the db.json and add new object 
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    allNotes = JSON.parse(data);
    allNotes.push(newNote);
    // rewrite the JSON file
    fs.writeFile("./db/db.json", JSON.stringify(allNotes), function (err) {
      if (err) throw err;
    });
  });
  res.json(newNote);
});

// delete request
app.delete("/api/notes/:id", function (req, res) {
// delete the object that user chose to delete from json and rewrite
  let query = { _id: req.params.id };
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    let allNotes = JSON.parse(data);
    const newNotes = allNotes.filter(function (note) {
      if (note.id !== query._id) {
        return note;
      }
    });
    // return data back to user
    fs.writeFile("./db/db.json", JSON.stringify(newNotes), function (err) {
      if (err) throw err;
      return res.json(newNotes);
    });
  });
});

// make sure server is litening on port 3000
app.listen(PORT, () => console.log(`the app is listening on ${PORT}`));
