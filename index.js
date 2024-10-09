require("dotenv").config();

const express = require('express');
const Connect = require('./db');
const { connect } = require('mongoose');
const app = express();

Connect();

app.get('/',function(req,res){
    res.send('hello world')
})


port = 8000 || process.env.PORT;

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
app.listen(3000)

