const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
//db connection
const uri = "mongodb://localhost:27017/wikiDB";
mongoose.connect(uri);
const articleSchema = mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model("Article",articleSchema);
let a1 = {
    title : "API",
    content : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
}
let a2 = {
    title : "Bootstrap",
    content : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
}
let a3 = {
    title : "DOM",
    content : "The Document Object Model is like an API for interacting with our HTML"
}
let articles = [a1,a2,a3];
// Article.insertMany(articles,function(err,docs){
//   if(!err){
//     console.log("docs inserted Successfully");
//   }else{
//     console.log(err);
//   }
// })
//////////////////////////////////Requests targetting all articles//////////////////////////////////
app.get("/articles",function(req,res){
  ;
  const articles = Article.find({},function(err,foundDocs){
    if(!err){
      res.send(foundDocs);
    }else{
      res.send(err);
    }
  })
});

app.post("/articles",function(req,res){
  let article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  article.save(function(err,doc){
    if(!err){
      res.send("article saved Successfully :\n"+doc);
    }else{
      res.send(err);
    }
  })
});

app.delete("/articles",function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("deleted all articles Successfully");
    }else{
      res.send(err);
    }
  })
});

//////////////////////////////////Requests targetting a specific article/////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
  let title = req.params.articleTitle;
  Article.findOne({title:title},function(err,foundArticle){
    if(!err){
      res.send(foundArticle);
    }else{
      res.send(err);
    }
  })
})
.put(function(req,res){
  let title = req.params.articleTitle;
  let article = req.body;
  Article.replaceOne(
    {title:title},
    article,
    function(err){
      if(!err){
        res.send("Successfully updated the article");
      }else{
        res.send(err);
      }
    })
})
.patch(function(req,res){
  let title = req.params.articleTitle;
  Article.updateOne(
    {title:title},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Successfully updated the article");
      }else{
        res.send(err);
      }
    })
})
.delete(function(req,res){
  let title = req.params.articleTitle;
  Article.findOneAndDelete(
    {title:title},
    function(err){
      if(!err){
        res.send("Successfully deleted the article");
      }else{
        res.send(err);
      }
    })
});

app.listen(3000,function(err){
  if(!err){
    console.log("server hosted on port 3000");
  }

})
