const db_host = process.argv[2]
const db_user = process.argv[3]
const db_password = process.argv[4]
const db_database = process.argv[5]
const SQL_FILE = process.argv[6]
const RETHINK_HOST = process.argv[7]
const RETHINK_DB = process.argv[8]
const RETHINK_TABLE = process.argv[9]
const LOWER_BOUND = process.argv[10] ? process.argv[10] : null
const UPPER_BOUND = process.argv[11] ? process.argv[11] : null

const fs = require('fs')
const rooturl = process.env.cxenserooturl
var cxense = require('./cxense.js')
var r = require('rethinkdb')
// conexão por padrão tenta no localhost
console.log('RETHINK HOST: ' + RETHINK_HOST)
var rconn = r.connect({
  host: RETHINK_HOST,
  db: RETHINK_DB
})


const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_database
  }
})

// ler arquivo sql


function getAutores (id_materia) {
  return knex.select('*')
      .from('autmt')
      .innerJoin('autor', 'autmt.cd_autor', 'autor.cd_autor')
      .where('cd_matia', '=', id_materia)
}


rconn.then((conn) => {
  return r.table(RETHINK_TABLE).max('old_materia_cd').run(conn)
}).catch((err) => {
  if (err) {
    console.log('rethinkdb está vazio!')
    return {old_materia_cd: -1}
  }
}).then((val) => {
  // tratar o arquivo.sql
  const sqlString = fs.readFileSync(SQL_FILE).toString()  // .wrap('(', ') temp_table')

  if (LOWER_BOUND && LOWER_BOUND <= val.old_materia_cd) {
    console.warn('nesta migração irá acontecer sobre-escrita de dados!')
  }

  if (LOWER_BOUND && UPPER_BOUND) {
    console.log('migração começando de: ' + LOWER_BOUND + ' e indo até: ' + UPPER_BOUND)
    return sqlString + ' AND ma.cd_matia >= ' + LOWER_BOUND + ' AND ma.cd_matia <= ' + UPPER_BOUND
  } else if (LOWER_BOUND) {
    console.log('migração começando de: ' + LOWER_BOUND)
    return sqlString + ' AND ma.cd_matia >= ' + LOWER_BOUND
  } else {
    // retornar promise com as linhas do banco
    console.log('continuando a migração a partir de: ' + val.old_materia_cd)
    return sqlString + ' AND ma.cd_matia > ' + val.old_materia_cd
  }
}).then((queryString) => {
    return knex.raw(queryString)
}).then((response) => {
  // processar as linhas do banco
  response[0].forEach((row) => {
    getAutores(row.old_materia_cd).then((autores) => {
        // adiciona coluna autores no json
        console.log('autores: ')
        console.log(autores)
        row.autores = autores
        return row
    }).then((fRow) => {
      console.log(fRow)
      return rconn.then((conn) => {
        return r.table(RETHINK_TABLE).insert(fRow).run(conn)
      })
    }).then(() => {
      console.log('inserted: ' + row.old_materia_id)
    }).then(() => {
      // inserir no cxense
      console.log('cxense in: ' + row.old_materia_path)
      return cxense.postProfileURL(rooturl + row.old_materia_path)
    }).then((response) => {
      // resposta do cxense
      console.log('inserted on cxense: ' + row.old_materia_id)
      console.log('response: ')
      console.log(response)
    }).catch((error) => {
      // tratar erro
      console.log('error on ' + row.old_materia_id + ':')
      console.log(error)
    })
  })
}).then(() => {
	console.log('terminou!')
})
