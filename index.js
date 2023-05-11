//Book management project
const express= require("express");

//for post request bodyparser is required
var bodyparser = require("body-parser");

//Database
const database = require("./database");

const booky = express();

booky.use(bodyparser.urlencoded({extended: true}));
booky.use(bodyparser.json());

//GET REQUEST

//1.Get all the books present
booky.get("/",(req,res)=>{
    return res.json({book: database.books});
});

//2.Get specific book

booky.get("/is/:isbn",(req,res)=>{
    const getbookdetails = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getbookdetails.length===0){
        return res.json({error: `No book found of ISBN ${req.params.isbn}`});
    }

    return res.json({book: getbookdetails});
});

//3.books details by category
booky.get("/c/:category",(req,res)=>{
    const getdetails=database.books.filter(
        (cate) => cate.category.includes(req.params.category)
    );

    if(getdetails.length===0){
        return res.json({error: `Not found category ${req.params.category}`});
    }

    return res.json({cate: getdetails});
});
//4.display all authors

booky.get("/a",(req,res)=> {
    return res.json({author: database.author});
});

//5.display all authors by providing isbn of book

booky.get("/a/:isbn",(req,res)=>{
    const authordetails = database.author.filter(
        (auth) => auth.books.includes(req.params.isbn)
    )

    if(authordetails.length===0){
        return res.json({error: `No author found for the isbn ${req.params.isbn}`})
    }

    return res.json({author: authordetails})
});

//6.display all the publications
booky.get("/p",(req,res)=>{
    return res.json({publications: database.publication})
})


//POST REQUEST -- USED TO ADD DATA INTO THE DATABASE

//1.Add new book
booky.post("/book/new",(req,res)=>{
    const newBook=req.body;
    database.books.push(newBook);
    return res.json({updatedbooks: database.books});
});

//2.ADD new author
booky.post("/author/new",(req,res)=>{
    const newauthor=req.body;
    database.author.push(newauthor);
    return res.json({updatedauthor:  database.author});
});

//3.ADD new publication
booky.post("/p/new",(req,res)=>{
    const newp=req.body;
    database.publication.push(newp);
    return res.json({updatedpub: database.publication});
})

//PUT-UPDATE THE DATA
booky.put("/p/ub/:isbn",(req,res)=>{
    database.publication.forEach((pub)=>{
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }
    });

    database.books.forEach((book)=> {
        if(book.ISBN === req.params.isbn) {
            book.publications=req.body.pubId;
            return;
        }
    });

    return res.json(
        {
            books:database.books,
            publications: database.publication,
            message: "Successfully updated publications"
        }
    );
});

//DELETE

//1.Delete a book
booky.delete("/book/delete/:isbn",(req,res)=>{
    const updatedbookdatabase=database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books=updatedbookdatabase;

    return res.json({books: database.books});

});

//2.Delete author from the book and related book from author
booky.delete("/book/delete/:isbn/:authorId",(req,res)=>{
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn) {
            const newAuthorlist = book.author.filter(
            (eachauthor) => eachauthor !== parseInt(req.params.authorId)
            );
            book.author=newAuthorlist;
            return;
        }
    });

    //update author database
    database.author.forEach((auth)=>{
        if(auth.id === parseInt(req.params.authorId)) {
            const newbooklist= auth.books.filter(
                (eachbook)=> eachbook !== req.params.isbn
            );
            auth.books=newbooklist;
            return;
        }
    });

    return res.json({author: database.author, 
    books: database.books,
    message: "success"
    });
});

booky.listen(8000,()=>{
    console.log("Server is up and running");
});