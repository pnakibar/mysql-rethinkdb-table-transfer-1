;(function () {
  'use strict'

  const _ = require('lodash')
  const r = require('rethinkdb')
  const RETHINK_HOST = process.env['RETHINK_HOST']
  const RETHINK_DB = process.env['RETHINK_DB']
  const RETHINK_DB_CONFIG = process.env['RETHINK_DB_CONFIG']

  let rconn = r.connect({
    host: RETHINK_HOST,
    db: RETHINK_DB
  })

  let rconn_config = r.connect({
    host: RETHINK_HOST,
    db: RETHINK_DB_CONFIG
  })

  /**
   * obtem os parametros de configuracao da integracao
   * @param name
   */
  let getConfig = (name) => {
    return rconn_config
      .then((conn) => {
        return r.table('config').filter({name: name}).run(conn)
      })
      .then((cursor) => {
        return cursor.toArray()
      })
      .then((rows) => {
        return _.head(rows)
      })
      .catch((err) => {
        console.error('erro fechando conexao no config')
        throw err
      })
  }

  /**
   * obtem o maior id com base no criterio da integracao
   * @param conn = conexao
   * @param integrations = lista de integracoes para fazer filtro de criterio
   * @returns {Promise.<T>|Promise<U>}
   */
  let getMax = (conn, integrations) => {
    console.info('parte 1 - obtendo o sourceId')

    r.db('integration').table('config').filter(
      function (doc) {
        return r.expr(integrations)
          .contains(doc('name'))
      }
    ).max('sourceId').run(conn)
      .catch((err) => {
        if (err) {
          console.warn('rethinkdb está vazio!')
          return {sourceId: -1}
        }
      })
  }

  module.exports = {
    getConnection: rconn,
    getConfig: getConfig,
    getMax: getMax,
    r: r
  }
}())
