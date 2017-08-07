import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import sql from 'mssql'
import path from 'path'

import jwt from 'jsonwebtoken'
import { UserModel } from './models/user'
import middleware from './middleware'
import { config, configAccessHeader, data } from './config'
import md5 from 'md5'

import fs from 'fs'
import multer from 'multer'

import os from 'os-utils'

import {
    MasterProvince,
    MasterAmphur,
    MasterDistrict,
    MasterSourceType,
    MasterChannelType,
    MasterBusinessType,
    MasterInterestingProduct,
    MasterOpportunityCustomer,
    MasterPresentProductType,
    MasterBusinessPrefix,
    MasterAppointmentReason,
    MasterPrefix,

    MasterBranchTemporary,
    MasterRegion,
    MasterArea,
    MasterBranch,
    MasterTargetMarketProvince,
    GetNanoMarkerMap,
    GetNanoMarketInformation,
    GetNanoBranchInformation,
    GetNanoCAInformation,
    GetNanoComplititorProvince,
    GetNanoComplititor,

    GetNanoProductPerformance,
    GetNanoTotalSummary,
    GetNanoGroupBySummary
} from './Master'

const app = express()
const apiRoutes = express.Router()

import mongoose from 'mongoose'
import bluebird from 'bluebird'

mongoose.Promise = bluebird

const mongo = mongoose.connect(config.MONGO_ENDPOINT, config.MONGO_OPTIONS, (err, result) => {
    if (err)
        console.log(err)
})


// app.set('trust proxy', '127.0.0.1');

app.set('skey', config.SECRET_KEY)

app.use(configAccessHeader)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(morgan('dev'))
app.use('/api/', apiRoutes)

apiRoutes.use(middleware(app, jwt))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'my_files'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
}).any()

app.use(upload)

//Master
app.get('/master/province', MasterProvince)
app.get('/master/amphur', MasterAmphur)
app.get('/master/district', MasterDistrict)
app.get('/master/sourcetype', MasterSourceType)
app.get('/master/channeltype', MasterChannelType)
app.get('/master/businesstype', MasterBusinessType)
app.get('/master/interestingproduct', MasterInterestingProduct)
app.get('/master/opportunitycustomer', MasterOpportunityCustomer)
app.get('/master/presentproducttype', MasterPresentProductType)
app.get('/master/businessprefix', MasterBusinessPrefix)
app.get('/master/appointmentreason', MasterAppointmentReason)
app.get('/master/prefix', MasterPrefix)

app.get('/master/region', MasterRegion)
app.get('/master/area', MasterArea)
app.get('/master/branch', MasterBranch)
app.get('/master/target/market/province', MasterTargetMarketProvince)
app.get('/master/calist', GetNanoCAInformation)
app.get('/master/complititor/province', GetNanoComplititorProvince)
app.post('/master/complititor', GetNanoComplititor)
app.post('/nano/marker', GetNanoMarkerMap)
app.get('/nano/market/:MarketCode', GetNanoMarketInformation)
app.get('/nano/branch/:BranchCode', GetNanoBranchInformation)
app.get('/temp/branch', MasterBranchTemporary)

app.post('/nano/product/performance', GetNanoProductPerformance)
app.post('/nano/total/summary', GetNanoTotalSummary)
app.post('/nano/groupby/summary', GetNanoGroupBySummary)

app.get('/gridAssignment', (req, res) => {
    res.json(data.gridAssignment)
})

app.get('/assignmentChart', (req, res) => {
    res.json(data.assignmentChart)
})

app.post('/temp/branch', (req, res) => {
    console.log(req.body)
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .input("Region", sql.NVarChar, req.body.Region)
                .input("Province", sql.NVarChar, req.body.Province)
                .input("Market", sql.NVarChar, req.body.Market)
                .input("Amphur", sql.NVarChar, req.body.Amphur)
                .input("Address", sql.NVarChar, req.body.Address)
                .input("Latitude", sql.NVarChar, req.body.Latitude)
                .input("Longitude", sql.NVarChar, req.body.Longitude)
                .input("GMarket", sql.NVarChar, req.body.GMarket)
                .input("GAddress", sql.NVarChar, req.body.GAddress)
                .input("MayBeRight", sql.NVarChar, req.body.MayBeRight)
                .input("GIcon", sql.NVarChar, req.body.GIcon)
                .input("GRating", sql.NVarChar, req.body.GRating)
                .execute("TempInsertMap")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
})

apiRoutes.post('/authenticate', (req, res) => {
    UserModel.findOne({
        name: req.body.name
    }, (err, user) => {
        if (err) throw err

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            })
        }
        else {
            if (md5(user.password) != req.body.password) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                })
            }
            else {

                const token = jwt.sign(user, app.get('skey'), {
                    expiresIn: 60 * 60 * 24
                })

                res.json({
                    success: true,
                    message: "Authentication success. that's your token key",
                    token: token
                })
            }
        }
    })
})

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        if (err) {
            console.log(err)
        }
        else {
            res.json(req.files)
        }
    })
})

app.listen(config.API_PORT, (error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log(`listen on port ${config.API_PORT}`)
    }
})

os.cpuUsage(v => {
    console.log(`CPU Usage (%) : ${v}`)
})

