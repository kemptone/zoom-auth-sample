// require('dotenv').config()
// const express = require('express')
// const bodyParser = require('body-parser')
// const crypto = require('crypto')
// const cors = require('cors')
const KJUR = require('jsrsasign')

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

function handler(req, res) {

  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2

  const oHeader = { alg: 'HS256', typ: 'JWT' }

  // console.log("////////////////////")
  // console.log("////////////////////")
  // console.log("////////////////////")
  // console.log("////////////////////")
  // console.log("////////////////////")
  // console.log("////////////////////")
  // console.log("////////////////////")
  // console.log(req.body)
  // console.log("||||||||||||||||||||")
  // console.log("||||||||||||||||||||")
  // console.log("||||||||||||||||||||")
  // console.log("||||||||||||||||||||")
  // console.log("||||||||||||||||||||")
  // console.log("||||||||||||||||||||")
  // console.log("||||||||||||||||||||")
  // console.log(process.env.ZOOM_MEETING_SDK_KEY)
  // console.log(process.env.ZOOM_MEETING_SDK_SECRET)

  // res.json({
  //   message: 'Hello World!'
  //   , SDK : process.env.ZOOM_MEETING_SDK_KEY
  //   , body : req.body
  // })


  const oPayload = {
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
    appKey: process.env.ZOOM_MEETING_SDK_KEY,
    tokenExp: iat + 60 * 60 * 2
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_MEETING_SDK_SECRET)

  res.json({
    signature: signature
  })
}

export default allowCors(handler)