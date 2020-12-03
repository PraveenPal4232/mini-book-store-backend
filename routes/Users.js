const router = require("express").Router();
let User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
require('dotenv').config({ path: '../.env' })

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/register").post((req, res) => {
  User.find({email:req.body.email})
  .exec()
  .then(user => {
    if(user.length >= 1){
      return res.status(409).json({
        message:"Mail Exists"
      });
    }
    else{
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
          return res.status(500).json({
            error:err
          });
        }
        else{
          const name = req.body.name;
          const email = req.body.email;
          const password = hash;
          const bio = req.body.bio;
          const profile = req.body.profile;
          const isAuthor = req.body.isAuthor;
    
          const newUser = new User({
            name,
            email,
            password,
            bio,
            profile,
            isAuthor
          });
        
          newUser
            .save()
            .then(() => res.json("User Added!"))
            .catch((err) => res.status(400).json("Error: " + err));
        }
    
        });
    }
  });
  });

  router.route("/login").post((req, res) => {
    User.find({email:req.body.email})
      .exec()
      .then(user => {
        if (user.length < 1){
          return res.status(401).json({
            message:'Auth Failed'
          });
        }
        bcrypt.compare(req.body.password, user[0].password,(err, result) => {
          if(err){
            return res.status(401).json({
              message:'Auth Failed'
            });
          }
          if(result) {
            const token = jwt.sign({
              email:user[0].email,
              userId:user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn:"1h"
            });
            return res.status(200).json({
              message:'Auth successful',
              token:token
            });
          }
          res.status(401).json({
            message:'Auth Fail'
          });
         });
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });

  router.route("/:id").get((req, res) => {
    User.findById(req.params.id)
      .then((user) => res.json(user))
      .catch((err) => res.status(400).json("Error: " + err));
  });
  
  router.route("/:id").delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
      .then(() => res.json("User Deleted!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
  


module.exports = router;