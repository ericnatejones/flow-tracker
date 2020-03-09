const express = require("express");
const favoriteRouter = express.Router();
const Favorite = require("../models/favorite");
const User = require("../models/user");

favoriteRouter.route("/param/:which/:favoriteId")
.put(function(req, res){
  Favorite.findById(req.params.favoriteId, (err, favorite)=>{
    if (err) return res.status(500).send(err)
    favorite[req.params.which] = req.body.param
    favorite.save((err, savedFavorite) => {
      if(err)return res.status(500).send(err)
      res.send(savedFavorite)
    })
  })
})

favoriteRouter.route("/")
.get((req, res) => {
  Favorite.find({user: req.user._id}, (err, user)=>{
    if (err) return res.status(500).send(err);
    return res.send(user);
  })
})
.post((req, res) => {
  if(err) return res.status(500).send(err)
  User.findByIdAndUpdate(
    req.user._id, 
    {$push: {"favoriteStreams": newFavorite._id}},
    {new: true})
  .exec((err, user) => {
    if(err) return res.status(500).send(err)
    return res.send({newFavorite, user: user._id})
  })    
})

.delete((req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {$pull: {"favoriteStreams": req.user._id}},
    {new: true}
  )
  .exec((err, user)=>{
      if (err) return res.status(500).send(err);
      return res.send(user);
  })
})


module.exports = favoriteRouter;
