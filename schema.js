const express = require("express");
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    item:{type:String,required:true},
    createdAt:{type:Date},
    
})

exports.todoModel = mongoose.model("todo",todoSchema);

const compTodoSchema = new mongoose.Schema({
    item:{type:String,required:true},
    createdAt:{type:Date},
    completedAt:{type:Date}
})

exports.compTaskModel = mongoose.model("CompTodo",compTodoSchema);



const listSchema = new mongoose.Schema({
    name:String,
    items:[todoSchema],
    compTask:[compTodoSchema]
})

exports.listModel = mongoose.model("list",listSchema);

