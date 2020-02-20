const express= require('express');
const router = express.Router();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({accessToken: process.env.API_KEY});

router.get('/results', (req, res) => {
    geocodingClient.forwardGeocode({query: req.query.name + " " + req.query.state})
    .send().then(response => {
        // send an array of places
        let places = response.body.features.filter(result => {
            if (result['place_type'][0] === 'place') {
                return true;
            }
        }).map( city => {
            return {
                name: city['place_name'].split(', ')[0],
                state: city['place_name'].split(', ')[1],
                lat: city.center[1],
                long: city.center[0]
            }
        })
        res.send(places);
    })
})


router.get('/:id', (req, res) => {
    // let places;
    geocodingClient.forwardGeocode({
        query: req.params.id
    }).send().then(response => {
        // send an array of places
        let places = response.body.features.filter(result => {
            if (result['place_type'][0] === 'place') {
                return true;
            }
        }).map( city => {
            return {
                name: city['place_name'].split(', ')[0],
                state: city['place_name'].split(', ')[1],
                lat: city.center[1],
                long: city.center[0]
            }
        })
        res.send(places);
    });
})

module.exports = router;