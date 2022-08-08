const express = require("express");
const path = require("path");
const fs = require('fs')
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app
  .route("/api/notes")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));
  })
  .post((req, res) => {
    let newNote = req.body;
    let notesList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    notesList.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(notesList));
    res.json(notesList);
  });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/error.html"));
});

app.listen(PORT, () => {
  console.log(`Now running on ${PORT}`);
});

//npm run devStart
