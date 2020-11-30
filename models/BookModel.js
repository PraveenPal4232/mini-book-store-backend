const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: String, required: true },
    summary: { type: String, required: true },
    cover: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
