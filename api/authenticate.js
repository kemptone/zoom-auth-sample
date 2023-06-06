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

  const mn = 97666006188

  const zak = `eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6IkhjdFZvbmgtU0syYjZfMHBDMTFVMFEiLCJpc3MiOiJ3ZWIiLCJzayI6IjAiLCJzdHkiOjk5LCJ3Y2QiOiJhdzEiLCJjbHQiOjAsIm1udW0iOiI5NzY2NjAwNjE4OCIsImV4cCI6MTY5Mzc4MDA0NiwiaWF0IjoxNjg2MDA0MDQ2LCJhaWQiOiJDbm1BeXhPM1FZdU84YnZEQy1aWV93IiwiY2lkIjoiIn0.haTIUzCoEWxuNtuvGWRNgOS9OKMxzqftymlBo8-k1YE`

  const oPayload = {
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
    // mn: req.body.meetingNumber,
    mn,
    role: req.body.role,
    // role: 0,
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
    , meetingNumber : mn
    , sdkKey : process.env.ZOOM_MEETING_SDK_KEY
    , zak : Number(req.body.role) === 1 ? zak : ''
  })
}

export default allowCors(handler)