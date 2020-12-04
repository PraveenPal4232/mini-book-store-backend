const router = require("express").Router();
let Book = require("../models/BookModel");
const multer = require('multer');

const storage = multer.diskStorage({
  destination:function(req, file, cb){
    cb(null, './uploads/books');
  },
  filename:function(req, file, cb){
    cb(null, file.originalname);
  }
});

const fileFIlter = (req, file,cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}

const upload = multer({storage:storage, limits:{
  fileSize: 1024 * 1024 * 2
}}); 

router.route("/").get((req, res) => {
  Book.find()
    .then((books) => res.json(books))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post(upload.single('cover'), (req, res) => {
  // console.log(req.file);
  const name = req.body.name;
  const author = req.body.author;
  const price = req.body.price;
  const summary = req.body.summary;
  const cover = req.file.path;

  const newBook = new Book({
    name,
    author,
    price,
    summary,
    cover
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

router.route("/update/:id").post(upload.single('cover'),(req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      book.name = req.body.name;
      book.author = req.body.author;
      book.price = req.body.price;
      book.summary = req.body.summary;
      book.cover = req.file.path;

      book
        .save()
        .then(() => res.json("Book Updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
