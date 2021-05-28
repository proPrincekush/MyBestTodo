require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const todo = require("./schema");
const date = require("./js/date")
const _ = require("lodash");


const app = express();


app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());

let uri = process.env.URI;
mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify:false
})
.then((msg)=>{console.log("mongodb connected")})
.catch(err=>{console.log("connection failed")})


let tasks = [];
let workList = [];
let lists;
app.get("/",(req,res)=>{
   
    todo.todoModel.find((err,items)=>{
        if (err) {
            console.log(err);
        }
        // console.log(items);
        todo.listModel.find((err,lists)=>{
            if (err) {
               console.log(err); 
            }
            else{
                res.render("todo",
                    {
                    title:"Main",
                    tasks:items,
                    compTasks:[],
                    lists
                })
            }  
        })
    })  
})

app.post("/task",(req,res)=>{
    console.log(req.body);
    const InputTask = req.body.task;
    const listName = req.body.list;

    const task = new todo.todoModel({
        item:InputTask,
        createdAt:date.today,
    })

    if(listName==="Main"){
        task.save();
        res.redirect("/");
    }else{
        todo.listModel.findOne({name:listName},(err,listdoc)=>{
            if (err) {
                console.log(err);
            } else {
                console.log("list data:==> ",listdoc.name);
                if (listdoc) {
                    listdoc.items.push(task);
                    listdoc.save((err,listData)=>{
                        if (err) {
                            console.log(err);
                        }
                        console.log(listData);
                        res.redirect("/"+listName); 
                    });
                   
                }
            }
        })
    

    }

   
    
})


app.post("/task/complete",(req,res)=>{
     // console.log(req.body);
     const itemId = req.body.item;
     const listName = req.body.list;
 
     if (listName == "Main") {
        todo.todoModel.findById(itemId,(err,doc)=>{
            if (doc) {
                todo.compTaskModel.create({item:doc.item})
                .then(doc=>console.log("task completed"))
                .catch(err=>console.log(err))
            }
        })
        todo.todoModel.deleteOne({_id:req.body.item},err=>{
            console.log(err)
            res.redirect("/");
        });
     } else {
         todo.listModel.findOne({name:listName},(err,listdoc)=>{
             if (err) {
                 console.log(err);
             } else {
 
                listdoc.items.map(item=>{
                    if (item._id==itemId) {
                      let compTask= new todo.compTaskModel({
                             item:item.item,
                             createdAt:item.createdAt,
                             _id:item._id,
                             completedAt:date.today
                         });

                     listdoc.compTask.push(compTask)
                     listdoc.save((err,listData)=>{
                        if (err) {
                            console.log(err);
                        }
                       
                    });

                    }
                })
                 
             todo.listModel.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemId}}},(err,doc)=>{
             if (err) {
                 console.log(err);
             }else{
                 res.redirect("/"+listName);
             }
             })
 
             }
         })
 
     }
   
})



app.post("/deleteItems",(req,res)=>{
    // console.log(req.body);
    const itemId = req.body.item;
    const listName = req.body.list;

    if (listName == "Main") {
        todo.todoModel.deleteOne({_id:req.body.item},err=>{
            console.log(err)
            res.redirect("/");
        });
    } else {
        
        todo.listModel.findOne({name:listName},(err,listdoc)=>{
            if (err) {
                console.log(err);
            } else {
                todo.listModel.findOneAndUpdate({name:listName},{$pull:{compTask:{_id:itemId}}},(err,doc)=>{
                if (err) {
                    console.log(err);
                }else{
                    res.redirect("/"+listName);
                }
                })
            }
        })

    }
  
})


app.get("/:listName",(req,res)=>{
    const listName = _.capitalize(req.params.listName);

    todo.listModel.findOne({name:listName},(err,doc)=>{
        if (err) {
            console.log(err);
        } else {
            if (doc) {
                
                todo.listModel.find((err,lists)=>{
                    if (err) {
                       console.log(err); 
                    }
                    res.render("todo",
                    {
                    title:listName,
                    tasks:doc.items,
                    compTasks:doc.compTask,
                    lists
                        })
                    })
            } else {
                makeList(listName,res);
            }
        }
    })
   
})


app.post("/list/delete",(req,res)=>{
    let id = req.body.id;
    console.log(id);
    todo.listModel.findOneAndDelete({_id:id},(err,doc)=>{
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    })
})



function makeList(listName,res) {
    const customlist = new todo.listModel({
        name:listName,
        items:[
            {
                item:"Welcome to your custom list"
            }
        ]
    })
    customlist.save((err,listDoc)=>{
        if (err) {
            console.log(err);
        }
        // console.log(listDoc);
        todo.listModel.find((err,lists)=>{
            if (err) {
               console.log(err); 
            }
            
            res.render("todo",
            {
            title:listDoc.name,
            tasks:listDoc.items,
            compTasks:listDoc.compTask,
            lists
            })
        })
    })
}








app.listen(5000,()=>{
    console.log("server started at port 5000...");
})