'use strict'
let rp = require('request-promise')
let cxenseapiUrl = 'https://api.cxense.com'
// let resultFields = ['url', 'id', 'title', 'description', 'dominantthumbnail', 'dominantthumbnaildimensions', 'createtime', 'score']
let sortFields = [{
  type: 'time',
  'order': 'descending',
  field: 'createtime' },
  {type: 'score',
  'order': 'descending'}]

var crypto = require('crypto')

// let siteId = process.env.cxensesiteid
let username = process.env.cxenseusername
let apiKey = process.env.cxenseapikey

/*
export let generateHeader = function (username, secret, date) {
  let hex = crypto.createHmac('sha256', secret).update(date).digest('hex')
  return 'username=' + username + ' date=' + date.toISOString() + ' hmac-sha256-hex=' + hex
}
*/

let postProfileURL = function (url) {
  let cxenseapiUrl = 'https://api.cxense.com/profile/content/push'
  
  var date = new Date().toISOString()
  var hmac = crypto.createHmac('sha256', apiKey).update(date).digest('hex')

  return rp.post({
    url: cxenseapiUrl,
    headers: {'X-cXense-Authentication': 'username=' + username + ' date=' + date + ' hmac-sha256-hex=' + hmac},
    body: {'url': url},
    json: true
  }).then((resp) => {
    return resp
  }).catch((error) => {
    return error
  })
}

let callSearch = (site, args, count, page) => {
  let start = count * (page - 1) + 1
  var date = new Date().toISOString()
  var hmac = crypto.createHmac('sha256', apiKey).update(date).digest('hex')

  return rp.post({
    url: cxenseapiUrl + '/document/search',
    headers: {'X-cXense-Authentication': 'username=' + username + ' date=' + date + ' hmac-sha256-hex=' + hmac},
    body: {'query': 'query(\"' + args + '\")', siteIds: [site], sort: sortFields, count: count, start: start, logQuery: args},
    json: true
  }).then((resp) => {
    return resp
  }).catch((error) => {
    return error
  })
}

module.exports = {
  postProfileURL: postProfileURL,
  callSearch: callSearch
}
