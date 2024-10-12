require("dotenv").config();

const express = require('express');
const Connect = require('./db');
const { connect } = require('mongoose');
const app = express();

Connect();

app.use(express.json());

app.get('/',function(req,res){
    res.send('hello world')
})

app.use('/api/user', require('./Routes/user'))
app.use('/api/notes', require('./Routes/notes'))


port = 8000 || process.env.PORT;

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
app.listen(3000)

