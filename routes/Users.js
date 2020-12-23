const router = require("express").Router();
let User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' })
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination:function(req, file, cb){
    cb(null, './uploads/users');
  },
  filename:function(req, file, cb){
    cb(null, file.originalname);
  }
});

const upload = multer({storage:storage, limits:{
  fileSize: 1024 * 1024 * 2
}}); 

const fileFIlter = (req, file,cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/register").post(upload.single('profile'), (req, res) => {
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
          const profile = req.file.path;
          const isAuthor = req.body.isAuthor;
          const myBooks = req.body.myBooks;
          const wishlist = req.body.wishlist;
    
          const newUser = new User({
            name,
            email,
            password,
            bio,
            profile,
            isAuthor,
            myBooks,
            wishlist
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
              token:token,
              id:user[0]._id,
              isAuthor:user[0].isAuthor

            });
          }
          res.status(401).json({
            message:'Auth Fail'
          });
         });
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });

  router.route("/update/:id").post( checkAuth, upload.single('profile'), (req, res) => {
    User.findById(req.params.id)
    .then(user => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
          return res.status(500).json({
            error:err
          });
        }
        else{
          user.name = req.body.name;
          user.email = req.body.email;
          user.password = hash;
          user.bio = req.body.bio;
          user.profile = req.file.path;
          user.isAuthor = req.body.isAuthor;
          user.myBooks = req.body.myBooks;
          user.wishlist = req.body.wishlist;

          user
            .save()
            .then(() => res.json("User Updated!"))
            .catch((err) => res.status(400).json("Error: " + err));
        }
    
        });
    });
    });

    router.route("/wishlist/:id").put( checkAuth, upload.single('profile'), (req, res) => {
      User.findById(req.params.id)
      .then(user => {

      user.wishlist = req.body.wishlist;
  
            user
              .save()
              .then(() => res.json("Wishlist Updated!"))
              .catch((err) => res.status(400).json("Error: " + err));

          });
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