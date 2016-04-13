function extractTags(str) {
  var re = /(<.*?>)/g
  return str.match(re)
}

function countTags(arr) {
  var tagCentral = {}
  arr.forEach((tag) => {
    if (tagCentral[tag])
      tagCentral[tag]++
    else
      tagCentral[tag] = 1
  })
  return tagCentral
}

function sumObjets(original, toAdd) {
  for (tag in toAdd) {
    if (original[tag]) {
      original[tag] += toAdd[tag]
    }
    else {
      original[tag] = toAdd[tag]
    }
  }
  return original
}

const db_host = process.argv[2]
const db_user = process.argv[3]
const db_password = process.argv[4]
const db_database = process.argv[5]

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_database
  }
});

knex.select()
  .from('matia')
  .then((rows) => {
    return rows.reduce((previous, row, currentIndex, original) => {
      var tagsCounted = countTags(extractTags(row['ds_matia']))
      return sumObjets(previous, tagsCounted)
    }, {})
  }).then((tagsCounted) => {
    console.log('Contagem de tags:')
    console.log('Tag\tQuantidade')
    for (tag in tagsCounted){
        console.log(tag + '\t' + tagsCounted[tag])
    }
    process.exit(0)
  })
