const router = require("express").Router();
let Book = require("../models/BookModel");

router.route("/").get((req, res) => {
  Book.find()
    .then((books) => res.json(books))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const author = req.body.author;
  const price = req.body.price;
  const summary = req.body.summary;

  const newBook = new Book({
    name,
    author,
    price,
    summary
  });

  newBook
    .save()
    .then(() => res.json("Book Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Book.findById(req.params.id)
    .then((book) => res.json(book))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(() => res.json("Book Deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      book.username = req.body.username;
      book.description = req.body.description;
      book.duration = Number(req.body.duration);
      book.date = Date.parse(req.body.date);

      book
        .save()
        .then(() => res.json("Book Updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
