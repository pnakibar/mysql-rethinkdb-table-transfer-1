


function sumObjects (original, toAdd) {
  for (tag in toAdd) {
    if (original[tag]) {
      original[tag] += toAdd[tag]
    } else {
      original[tag] = toAdd[tag]
    }
  }
  return original
}

function sizeOfTable (tableName, knex) {
  return knex(tableName).count('id_' + tableName)
}

function queryTable (tableName, offset, limit, knex) {
  return knex(tableName).select('ds_matia').limit(limit).offset(offset)
}

function generateQueryTable (tableName, knex, sizeOfBuffer, total) {
  'use strict'
  var arrOfFunctions = []
  var iterations = (total / sizeOfBuffer) | 0
  var i = 0

  if ((total % sizeOfBuffer) > 0) {
    let promiseFoo = () => {
      return queryTable(tableName, sizeOfBuffer * iterations, total, knex)
    }
    promiseFoo.offset = sizeOfBuffer * iterations
    promiseFoo.limit = total
    arrOfFunctions.push(promiseFoo)
  }

  for (i; i < iterations; i++) {
    var offset = sizeOfBuffer * i
    var limit = sizeOfBuffer * (i + 1)
    var promiseFoo = () => {
      return queryTable(tableName, offset, limit, knex)
    }
    promiseFoo.offset = offset
    promiseFoo.limit = limit
    arrOfFunctions.push(promiseFoo)
  }

  console.log(arrOfFunctions)
  return arrOfFunctions
}

const db_host = process.argv[2]
const db_user = process.argv[3]
const db_password = process.argv[4]
const db_database = process.argv[5]

const Promise = require('bluebird')

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_database
  }
})

function extractTags (str) {
  var re = /(<.*?>)/g
  return str.match(re)
}

function countTags (arr) {
  if (arr == null) return {}
  var tagCentral = {}
  arr.forEach((tag) => {
    if (tagCentral[tag])
      tagCentral[tag]++
    else
      tagCentral[tag] = 1
  })
  return tagCentral
}

function countRows (rows) {
  return rows.reduce((previous, row, currentIndex, original) => {
    if (row.ds_matia == null) {
      return previous
    }
    var tags = extractTags(row.ds_matia)
    var countedTags = countTags(tags)
    return sumObjects(previous, countedTags)
  }, {})
}

//queryTable('matia', 0, 500, knex).then((res) => console.log(res))
var sizeOfBuffer = 100

var promiseList = sizeOfTable('matia', knex)
  .then((total) => {
    return total[0]['count(`id_matia`)']
  })
  .then((total) => {
    console.log('size of table is: ')
    console.log(total)
    // gerar lista de funções que retornam promises
    return generateQueryTable('matia', knex, sizeOfBuffer, total)
  })

var queriesExecuted = 0

Promise.reduce(
    promiseList,
    (total, curr) => {
      return curr().then((rows) => {
        console.log('executing from offset=' + curr.offset + ' limit=' + curr.limit)
        var countedRows = countRows(rows)
        return countedRows
      }).then((rowsCounted) => {
        queriesExecuted++
        return sumObjects(total, rowsCounted)
      })
    },
    {}
  ).then((finalValue) => {
    console.log(finalValue)
    console.log('queries executed: ' + queriesExecuted)
    var fs = require('fs')
    var stringOut = ''
    for (tag in finalValue) {
      stringOut += tag + ' , ' + finalValue[tag] + '/n'
    }
    fs.writeFile('output.csv', stringOut)
    process.exit(0)
  }).catch((err) => {
    console.err(err)
    process.exit(1)
  })
