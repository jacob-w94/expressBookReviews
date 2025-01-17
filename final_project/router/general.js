const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.status(200).json({
        message: "success",
        data: books
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Extract the ISBN from the request parameters
    const book = books[isbn]; // Find the book with the matching ISBN

    if (book) {
        return res.status(200).json({ message: "success", data: book });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author

    const booksByAuthor = Object.fromEntries(
        Object.entries(books).filter(([key, book]) => book.author === author)
    );

    if (Object.keys(booksByAuthor).length === 0) {
        return res.status(404).json({ message: "No books found for the specified author." });
    }

    return res.status(200).json({ message: "success", data: booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title

    const booksByTitle = Object.fromEntries(
        Object.entries(books).filter(([key, book]) => book.title === title)
    );

    if (Object.keys(booksByTitle).length === 0) {
        return res.status(404).json({ message: "No books found for the specified author." });
    }

    return res.status(200).json({ message: "success", data: booksByTitle });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
