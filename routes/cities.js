const express= require('express');
const router = express.Router();
const db = require('../models');

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
        res.render('results', {results: places});
    })
})

router.post('/faves', (req, res) => {
    console.log(req.body);
    db.city.findOrCreate({
        where: {
            lat: req.body.lat,
            long: req.body.long
        }, defaults: {
            name: req.body.name,
            state: req.body.state
        }
    }).then(([city, created]) => {
        console.log(`City ${city.name} was ${created ? 'created' : 'found'}`)
        res.redirect('/faves');
    }).catch(err => console.log(err));
})



router.get('/search/:id', (req, res) => {
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
        res.render('results', {results: places});
    });
})

router.get('/faves', (req, res) => {
    // get all faves from db
    db.city.findAll().then(cities => {
        // send to front end
        console.log(cities);
        res.render('faves', {cities});
    }).catch(err => {
        console.log(err)
        res.render('404');
    })
})

module.exports = router;