const books = [
    {
        ISBN: "123ABC",
        title: "LUCIFER THE DEVIL",
        pubdate: "2017-05-09",
        numpages: 650,
        author: [1,2],
        publications: [1],
        category: ["fantasy","comedy","supernatural"]
    }
]

const author = [
    {
        id:1,
        name: "God",
        books: ["123ABC","87HJI"]

    },
    {
        id:2,
        name: "Samael",
        books: ["123ABC","38ALWAYS","Secretsinhell"]
    }
]

const publication = [
    {
        id:1,
        name: "Owlbooks",
        books: ["123ABC","87HJI","38ALWAYS","Secretsinhell"]
    },
    {
        id:2,
        name: "Writex",
        books: []
    }
]

module.exports = {books,author,publication};