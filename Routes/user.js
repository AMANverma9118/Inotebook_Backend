const express = require('express');
const router = express.Router();
const User = require('../Schemas/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/Fetchuser')

//Route number 1 :It create a user with the api /api/user/Createuser 
router.post('/Createuser', [
  body('name', 'Enter Valid name').isLength({ min: 3 }),
  body('email', 'Enter valid email').isEmail(),
  body('password', 'password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry user is already exist with this email" })
    }


    const salt = await bcrypt.genSalt(10);
    const SecurePassword = await bcrypt.hash(req.body.password, salt)

    //Create new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: SecurePassword,
    });

    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, process.env.JWT_SECRETE);


    res.json({ authToken: authToken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }
})


// Route number 2 :It login a user with the api /api/user/Login
router.post('/Login', [
  body('email', 'Enter valid email').isEmail(),
  body('password', 'password can not be blank').exists(),
], async (req, res) => {

  //If there are error then it return bad request and the error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }


  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, process.env.JWT_SECRETE);
    res.json({ authToken })


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

// Route number 3 :It login a user with the api /api/user/getuser
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router