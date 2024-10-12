const express = require('express');
const router = express.Router();
const User = require('../Schemas/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


router.post('/Createuser',[
    body('name','Enter Valid name').isLength({min:3}),
    body('email','Enter valid email').isEmail(),
    body('password','password must be atleast 5 characters').isLength({min:5})
], async (req,res)=>{
    const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      try{
      let user = await User.findOne({email: req.body.email});
      if(user){
        return res.status(400).json({error: "Sorry user is already exist with this email"})
      }
    

      const salt =await bcrypt.genSalt(10);
      const SecurePassword = await bcrypt.hash(req.body.password,salt)

      //Create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: SecurePassword,
      })

      res.json(user)
      }catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured")
      }
})

module.exports = router