import dotenv, { config } from 'dotenv';
import {v2} from 'cloudinary';
import { compareDesc } from 'date-fns'

// init dotenv
dotenv.config();

const {
  CLOUD_NAME,
  API_KEY,
  API_SECRET
} = process.env;

v2.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
})

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  v2.api.resources({
    type: 'upload',
    prefix: 'wpb',
    max_results: 999 
  }, (error, result) => {
    if (error) res.error

    res.json({
      images: result.resources
        .map(img => {
          return {
            uuid: img.asset_id,
            url: img.secure_url,
            date: new Date(img.created_at)
          }
        })
        .sort((a,b) => compareDesc(a.date, b.date))
    })
  })
};
