const express = require("express");
const streamRouter = express.Router();
const Stream = require("../models/stream");
const axios = require("axios");

streamRouter.route("/")
.get((req, res) => {
    Stream.find(req.query, (err, streams) => {
        if (err) res.status(500).send(err);
        res.send(streams);
    });
})
.post((req, res) => {
    let url = 'https://waterservices.usgs.gov/nwis/iv/?format=json&sites=';
    let site = req.body.site;
    let param = '&parameterCd=00060';
    console.log(url+site+param)

    axios.get(url+site+param).then((response) => {
        console.log("the response", response.data);
        console.log("known title", req.body.knownTitle)
        let knownTitle;
        if (!req.body.knownTitle){
            knownTitle = response.data.value.timeSeries[0].sourceInfo.siteName
        } else {
            knownTitle = req.body.knownTitle
        }

        let newStream = {
            apiTitle: response.data.value.timeSeries[0].sourceInfo.siteName,
            knownTitle,
            apiId: response.data.value.timeSeries[0].sourceInfo.siteCode[0].value
        }

        let stream = new Stream(newStream);

        stream.save((err, newStream) => {
            if (err) res.status(500).send(err);
            res.status(201).send(newStream);
        })

    }).catch((error) => {
        console.log(error)
    });
});

streamRouter.route("/:streamId")
.put((req, res) => {
    Stream.findByIdAndUpdate(req.params.streamId, req.body, {new: true}, (err, stream) => {
        if (err) res.status(500).send(err);
        res.send(stream);
    });
})
.delete((req, res) => {
    Stream.findByIdAndRemove(req.params.streamId, (err, stream) => {
        if (err) res.status(500).send(err);
        res.send(stream);
    })
});



module.exports = streamRouter;
