const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const url = "mongodb://127.0.0.1:27017/wikiDB";

mongoose.connect(url);

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);


app.route("/articles")

    .get((req, res) => {
        const getAll = async () => {
            const articles = await Article.find({});
            res.send(articles);
        }
        getAll();
    })

    .post((req, res) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        article.save();
        res.send("Post successful");
    })

    .delete((req, res) => {

        const deleteAll = async () => {
            await Article.deleteMany({});
            res.send("All deleted");
        }
        deleteAll();
    });


app.route("/articles/:article")

    .get((req, res) => {
        const getOne = async () => {
            const article = await Article.findOne({ title: req.params.article });
            if (article !== null) {
                res.send(article);
            }
            else {
                res.send("No articles found");
            }
        }
        getOne();
    })

    .put((req, res) => {
        const putOne = async () => {
            const article = await Article.updateOne(
                { title: req.params.article },
                { title: req.body.title, content: req.body.content }
            );
            if (article.modifiedCount === 1) {
                res.send("Article updated.");
            }
            else {
                res.send("No Article to update.");
            }
        }
        putOne();
    })
    .patch((req, res) => {
        const patchOne = async () => {
            const article = await Article.updateOne(
                { title: req.params.article },
                { $set: req.body }
            );
            if (article.modifiedCount === 1) {
                res.send("Article updated.");
            }
            else {
                res.send("No Article to update.");
            }
        }
        patchOne();
    })
    .delete((req,res)=>{
        const deleteOne = async()=>{
            const article = await Article.deleteOne({title : req.body.title});
            if(article.deletedCount===1){
                res.send("Deleted successfully.");
            }
            else{
                res.send("Cannot find the article.")
            }    
        }
        deleteOne();
    });



app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000.');
    console.log()
})