//Book management project
require("dotenv").config();

const express= require("express");
const mongoose =require("mongoose");

//for post request bodyparser is required
var bodyparser = require("body-parser");

//Database
const database = require("./database/database");
const BookModel =  require("./database/book");
const AuthorModel=require("./database/author");
const publicationModel=require("./database/publication");

const booky = express();

booky.use(bodyparser.urlencoded({extended: true}));
booky.use(bodyparser.json());


mongoose.connect(process.env.MONGO_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}
).then(()=> console.log("connection established"));

//GET REQUEST

//1.Get all the books present
booky.get("/",async(req,res)=>{
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

//2.Get specific book

booky.get("/is/:isbn",async(req,res)=>{
    const getbook=await BookModel.findOne({ISBN: req.params.isbn});

    if(!getbook){
        return res.json({error: `No book found of ISBN ${req.params.isbn}`});
    }

    return res.json({book: getbook});
});

//3.books details by category
booky.get("/c/:category",async(req,res)=>{
    const bookbycat=await BookModel.findOne({category:req.params.category});

    if(!bookbycat){
        return res.json({error: `Not found category ${req.params.category}`});
    }

    return res.json({cate: bookbycat});
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
booky.get("/p",async(req,res)=>{
    const getallpub=await publicationModel.find();
    return res.json(getallpub)
})


//POST REQUEST -- USED TO ADD DATA INTO THE DATABASE

//1.Add new book
booky.post("/book/new",async(req,res)=>{
    const { newBook }=req.body;
    const addnewbook=BookModel.create(newBook);
    return res.json({
        books: addnewbook,
        message: "successfully added"
    })
});

//2.ADD new author
booky.post("/author/new",async(req,res)=>{
    const {newauthor}=req.body;
    const addnewaut=AuthorModel.create(newauthor);
    return res.json({
        author: addnewaut,
        message: "successfully added"
    })
    
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