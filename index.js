const express = require("express")
const expressSession = require('express-session');
const countapi = require('countapi-js');
const moment = require('moment')

const fs = require('fs')
const os = require('os')
const path = require('path')

let {
    Main,
    main
} = require('./database/setup')

const API_KEYS_FILE = path.join(os.homedir(), '.apikeys');
if (!fs.existsSync(API_KEYS_FILE)) throw new Error('API key not generated, use the following command to generate: api key generate')
const apiKeys = fs.readFileSync(API_KEYS_FILE, 'utf-8').trim().split('\n');

async function save() {
    await main.save()
    main = Main.get('main')
}

async function searchVisits() {
    const dateToRemove = moment().subtract(7, 'day').format('MM/DD/YYYY')
    const array = []
    for (const [date, count] of Object.entries(main.visits)) {
        if (date == dateToRemove) {
            delete main.visits[date]

            await save()
        } else {
            array.push(count)
        }
    }

    return array
}

const app = express()
app.enable('trust proxy');
app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.get('/api/visit', async function (req, res) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (!apiKeys.includes(token)) return res.status(401).json({
            message: 'An API key is required in this request, please put it in the authorization header and retry this request.'
        })

        countapi.visits('testing123456437456').then(() => {
            main.totalVisits++

            const day = moment().format('MM/DD/YYYY')
            if (!main.visits[day]) {
                main.visits[day] = 0
            }

            main.visits[day]++
        });

        await save()
        res.json({
            visits: main.totalVisits
        });
    } else {
        res.status(401).json({
            message: 'An API key is required in this request, please put it in the authorization header and retry this request.'
        })
    }


});

app.get('/api/get/visits', async function (req, res) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (!apiKeys.includes(token)) return res.status(401).json({
            message: 'An API key is required in this request, please put it in the authorization header and retry this request.'
        })

        if (!req.query.type) req.query.type = 'totalVisits'

        if (req.query.type == 'totalVisits') {
            res.status(200).json({
                visits: main.totalVisits
            })
        } else {
            const array = await searchVisits()


            res.status(200).json({
                visits: array
            })
        }
    } else {
        res.status(401).json({
            message: 'An API key is required in this request, please put it in the authorization header and retry this request.'
        })
    }

})

app.listen(8080);