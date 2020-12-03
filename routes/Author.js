const router = require("express").Router();
let Author = require("../models/AuthorModel");

router.route("/").get((req, res) => {
  Author.find()
    .then((authors) => res.json(authors))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const newAuthor = new Author({ username });
  newAuthor
    .save()
    .then(() => res.json("Author Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
