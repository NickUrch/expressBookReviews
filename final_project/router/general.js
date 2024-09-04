const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully added"});
        } else {
            return res.status(404).json({message: "User already exists"});
        }
    } else {
        return res.status(404).json({message: "Error adding user"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    try {
        const req_isbn = req.params.isbn;
        console.log(req_isbn);
        const matching_book = books[req_isbn];

        if (matching_book) {
            res.json(matching_book);
        } else {
            res.status(404).json({ message: "Book not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    try {
        const req_author = req.params.author;
        const matching_books = [];

        const book_keys = Object.keys(books);

        for (const key of book_keys) {
            const book = books[key];
            if (book.author === req_author) {
                matching_books.push(book);
            }
        }
        if (matching_books.length > 0) {
            res.json(matching_books);
        } else {
            res.status(404).json({ message: "No books found by that author" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving books"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    try {
        const req_title = req.params.title;
        const matching_books = [];

        const book_keys = Object.keys(books);

        for (const key of book_keys) {
            const book = books[key];
            if (book.title === req_title) {
                matching_books.push(book);
            }
        }
        if (matching_books.length > 0) {
            res.json(matching_books);
        } else {
            res.status(404).json({ message: "No books found by that title" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving books"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    try {
        const req_isbn = req.params.isbn;
        const book = books[req_isbn];

        if (book) {
            const review = book.reviews;
            res.json(review);
        } else {
            res.status(404).json({ message: "Book not found"});
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book"});
    }
});

function getBookListWithPromise(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
};

// Task 10 with promise
public_users.get('/promise', function (req, res) {
    try {
      getBookListWithPromise('http://localhost:5000/') 
        .then(bookList => {
          res.json(bookList);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book list" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
});
  
//Task-10 With Async
public_users.get('/async', async function (req, res) {
    try {
        const bookList = await getBookListAsync('http://localhost:5000/'); //
        res.json(bookList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
    }
});

// Task-11 With Promise
public_users.get('/promise/isbn/:isbn', function (req, res) {
    try {
      const requestedIsbn = req.params.isbn;
      getBookListWithPromise("http://localhost:5000/isbn/" + requestedIsbn) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unexpected error" });
    }
});

// Task-11 With Async
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const requestedIsbn = req.params.isbn;
        const book = await getBookListAsync("http://localhost:5000/isbn/" + requestedIsbn);
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
    }
});
  
// Task-12 With Promise
public_users.get('/promise/author/:author', function (req, res) {
    try {
        const requestedAuthor = req.params.author;
        getBookListWithPromise("http://localhost:5000/author/" + requestedAuthor) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unexpected error" });
    }
});

// Task-12 With Async
public_users.get('/async/author/:author', async function (req, res) {
    try {
        const requestedAuthor = req.params.author;
        const book = await getBookListAsync("http://localhost:5000/author/" + requestedAuthor);
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
    }
});
  
// Task-13 With Promise
public_users.get('/promise/title/:title', function (req, res) {
    try {
        const requestedTitle = req.params.title;
        getBookListWithPromise("http://localhost:5000/title/" + requestedTitle) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unexpected error" });
    }
});

// Task-13 With Async
public_users.get('/async/title/:title', async function (req, res) {
    try {
        const requestedTitle = req.params.title;
        const book = await getBookListAsync("http://localhost:5000/title/" + requestedTitle);
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
    }
});
  







module.exports.general = public_users;
