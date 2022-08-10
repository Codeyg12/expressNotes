// Adding all packages that will be needed
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuidv1 = require("uuidv1");

// Setting up the Port and Express
const PORT = process.env.PORT || 3001;
const app = express();

// Sets Public to Static to save when using the same assets
app.use(express.static("public"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sets the front page to the index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Puts you on the notes.html 
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// I used .route to DRY out the code a bit and save time
app
  .route("/api/notes")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));
  })
  .post((req, res) => {
    // Deconstruction to set up variables and insert them into the code
    let { title, text } = req.body;
    let newNote = { title, text, id: uuidv1() };
  
    // Parses the new info and adds it the note variable
    let notesList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    notesList.push(newNote);

    // Adds the new note to the db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(notesList));
    res.json(notesList);
  });

  // This deletes current notes, it wasn't with .router because the ':id'
app.delete("/api/notes/:id", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteId = req.params.id;

  // Filters the notes id to ensure it's using the proper note id
  notes = notes.filter((current) => {
    return current.id != noteId;
  });

  // Changes the db.json to reflect note deletion
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.json(notes);
});

// If any other path is attempted they'll be sent back to the homepage
app.get("*", (req, res) => {
  //Initally I made an error page but that isn't correct 
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Now running on http://localhost:${PORT}`);
});

//npm run devStart
