const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let valid_user = users.filter((user) => {
        return user.username === username;
    });

    if (valid_user.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let auth_user = users.filter((user) => {
        return (user.username == username && user.password == password);
    });

    if (auth_user.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});
        req.session.authorization = {accessToken, username};
        res.status(200).json({message: "User successfully logged in"});
    } else {
        res.status(208).json({message: "Invalid username or password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    try {
        const requestedIsbn = req.params.isbn;
        const reviewText = req.query.review;
        const username = req.session.authorization.username; // Assuming username is stored in the session
    
        if (!username) {
          return res.status(401).json({ message: "Unauthorized" }); // Handle unauthorized access
        }
    
        const book = books[requestedIsbn];
    
        if (book) {
          book.reviews[username] = reviewText; // Add or modify review based on username
          res.json({ message: "Review added/modified successfully" });
        } else {
          res.status(404).json({ message: "Book not found" }); // Handle book not found
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding/modifying review" }); // Handle unexpected errors
      }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
