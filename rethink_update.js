;(() => {
  'use strict'
  // var r = require('rethinkdb')
  let Promise = require('bluebird')
  let transform = require('./utils/transform')
  let getAutores = require('./utils/getautores')
  let sqlLoader = require('./sqls/raw_sql_loader')

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
  })

  let generateWhereIn = (ids) => {
    let formattedIds = ids.reduce(
      (prev, curr, index) => {
        if (index === 0)
          return curr
        else
          return prev + ', ' + curr
      },
      ''
    )
    return "AND ma.cd_matia IN (" + formattedIds + ')'
  }

  const logDeMateriasAtualizadas =
    sqlLoader(knex, './sqls/gazetaonline_alter.sql')
      .then((rows) => {
        return rows[0].map((row) => {
          return {
            idMateria: row.cd_matia,
            idLogfe: row.cd_logfe
          }
        })
      })

  const tabelaGeneric = (pathSql, ids) => sqlLoader(knex, pathSql, generateWhereIn(ids))
  const tabelaFilmes = (ids) => tabelaGeneric('./sqls/gazetaonline_filme.sql', ids)
  const tabelaNoticia = (ids) => tabelaGeneric('./sqls/gazetaonline_noticia.sql', ids)

  // inicio do processamento
  logDeMateriasAtualizadas.then((valoresAtualizados) => {
    return valoresAtualizados.map((valor) => ''+valor.idMateria)
  }).then((idMaterias) => {
    return tabelaNoticia(idMaterias)
  }).then((materiasSemAutor) => {
    return Promise.map(materiasSemAutor[0], (materia) => getAutores(materia, knex))
  }).then((materias) => {
    return materias.map((materia) => transform(materia, 'ATUALIZACAO_LOGFE'))
  }).then((materiasProntas) => {
    // TODO: inserir no rethinkdb atualizando
  }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
})()
