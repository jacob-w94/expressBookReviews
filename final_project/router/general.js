const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({
                "username": username,
                "password": password
            })
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" })
        }
    } else if (!username && !password) {
        return res.status(404).json({ message: "Missing username and password!" })
    } else if (!password) {
        return res.status(404).json({ message: "Missing password!" })
    } else if (!username) {
        return res.status(404).json({ message: "Missing username!" })
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const fetchBooks = () => new Promise((resolve) => setTimeout(() => resolve(books), 100));

    fetchBooks()
        .then(bookList => {
            return res.status(200).json({
                message: "success",
                data: bookList
            });
        })
        .catch(error => {
            return res.status(500).json({
                message: "Error retrieving books",
                error: error.message
            });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const fetchBookByISBN = () =>
            new Promise((resolve, reject) => {
                const book = books[isbn];
                if (book) resolve(book);
                else reject(new Error("Book not found"));
            });

        const book = await fetchBookByISBN();
        return res.status(200).json({ message: "success", data: book });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const fetchBooksByAuthor = () =>
            new Promise((resolve, reject) => {
                const booksByAuthor = Object.fromEntries(
                    Object.entries(books).filter(([key, book]) => book.author === author)
                );

                if (Object.keys(booksByAuthor).length > 0) resolve(booksByAuthor);
                else reject(new Error("No books found for the specified author."));
            });

        const booksByAuthor = await fetchBooksByAuthor();
        return res.status(200).json({ message: "success", data: booksByAuthor });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const fetchBooksByTitle = () =>
        new Promise((resolve, reject) => {
            const booksByTitle = Object.fromEntries(
                Object.entries(books).filter(([key, book]) => book.title === title)
            );

            if (Object.keys(booksByTitle).length > 0) resolve(booksByTitle);
            else reject(new Error("No books found for the specified title."));
        });

    fetchBooksByTitle()
        .then(booksByTitle => {
            return res.status(200).json({ message: "success", data: booksByTitle });
        })
        .catch(error => {
            return res.status(404).json({ message: error.message });
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json({ message: "success", data: book.reviews });
    } else {
        return res.status(400).json({ message: "Book not found" })
    }
});

module.exports.general = public_users;
module.exports.users = users;
