const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" })
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in")
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" })
    }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session?.authorization?.username;

    // Validate inputs
    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required" });
    }
    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    // Retrieve the book by ISBN
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews if not present
    book.reviews = book.reviews || {};

    // Add or update the review
    if (book.reviews[username]) {
        book.reviews[username] = review; // Update existing review
        return res.status(200).json({ message: "Review updated successfully", data: book.reviews });
    } else {
        book.reviews[username] = review; // Add new review
        return res.status(201).json({ message: "Review added successfully", data: book.reviews });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Retrieve the ISBN from the route parameter
    const username = req.session?.authorization?.username; // Retrieve the username from the session

    // Validate inputs
    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required" });
    }

    // Retrieve the book by ISBN
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has a review for the book
    if (book.reviews && book.reviews[username]) {
        delete book.reviews[username]; // Delete the user's review
        return res.status(200).json({ message: "Review deleted successfully", data: book.reviews });
    } else {
        return res.status(404).json({ message: "No review found for the user to delete" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;