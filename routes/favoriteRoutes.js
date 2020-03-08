const express = require("express");
const favoriteRouter = express.Router();
const User = require("../models/user");
const Stream = require("../models/stream")
const jwt = require("jsonwebtoken");
const config = require("../config");

favoriteRouter.route("/param/:which/:streamId")
    .put(function(req, res){
        User.findById(req.user._id, (err, user) => {
            let stream = user.favoriteStreams.id(req.params.streamId);
            console.log(stream);
            stream[req.params.which] = req.body.param
            user.save(function (err, savedUser) {
                if (err) return res.status(500).send(err);
                console.log("Successfull matched stream id's")

                return res.status(201).send(savedUser);
            });
        })
    })

favoriteRouter.route("/")
    .get((req, res) => {

        User.findById(req.user._id)
            .populate("favoriteStreams.stream")
            .exec((err, user)=>{
                console.log("user", user)

                if (err) return res.status(500).send(err);
                return res.send(user);
            })
    })
    .post((req, res) => {
      User.findById(
        req.user._id
      )
      .populate("favoriteStreams.stream")
      .exec((err, user)=>{
          if (err) return res.status(500).send(err);
          let found = user.favoriteStreams.some(favorite=>favorite.stream._id.equals(req.body._id))
          if (found){
            return res.status(400).send({"msg": "River Already Added"})
          } else {
            Stream.findById(req.body._id, (err, stream)=>{
              console.log(stream)
              user.favoriteStreams.push({stream, lowerParam: 0, upperParam: 100000})
              user.save((err, savedUser)=>{
                if (err) return res.status(500).send(err);
                return res.send(user);
              })

            })
          }

      })
    })
    .delete((req, res) => {
      User.findByIdAndUpdate(
        req.user._id,
        {$pull: {"favoriteStreams": {stream: req.body._id}}},
        {new: true}
      )
          .populate("favoriteStreams.stream")
          .exec((err, user)=>{
              if (err) return res.status(500).send(err);
              return res.send(user);
          })
    })


module.exports = favoriteRouter;
