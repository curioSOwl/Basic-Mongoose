const mongoose= require("mongoose");

const AutSchema = mongoose.Schema(
    {
        id:Number,
        name: String,
        books: [String]

    },
    {
        id:Number,
        name: String,
        books: [String]
    }
) ;

const AutModel=mongoose.model("authors",AutSchema);
module.exports=AutModel;