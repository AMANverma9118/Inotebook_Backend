const express = require('express');
const router = express.Router();
// const Notes = require('../Schemas/User');

router.get('/',(req,res)=>{
    console.log(req.body)
})

module.exports = router