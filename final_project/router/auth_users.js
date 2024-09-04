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
        const req_isbn = req.params.isbn;
        const new_review = req.query.review;
        const username = req.session.authorization.username; 
    
        if (!username) {
          return res.status(401).json({ message: "Unauthorized" }); 
        }
    
        const book = books[req_isbn];
    
        if (book) {
          book.reviews[username] = new_review; 
          res.json({ message: "Review added/modified successfully" });
        } else {
          res.status(404).json({ message: "Book not found" }); 
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding/modifying review" }); 
      }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    try {
        const req_isbn = req.params.isbn;
        const username = req.session.authorization.username;

        if (!username) {
            res.status(401).json({ message: "Unauthorized user"});
        }

        const book = books[req_isbn];

        if (book) {
            delete book.reviews[username];
            res.status(200).json({message: "Review deleted"});
        } else {
            res.status(404).json({message: "Review not found"});
        }

    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Error deleting review"});
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
