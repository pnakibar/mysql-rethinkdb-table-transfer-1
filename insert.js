// todo
// melhorar o fluxo de saida em caso de erros
// implementar saida forçada em caso de erros continuos.

;(function () {
  'use strict'
  const _ = require('lodash')
  const fs = require('fs')
  const ejs2html = require('./services/ejs2html')
  let cxense = require('./services/cxense')
  let rUtils = require('./services/rethinkUtils')
  let models = require('./model/materia')
  let shortid = require('shortid')
  let Promise = require('bluebird')

  // shortid conf
  shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$!')

  // args
  const INTEGRATION_NAME = process.argv[2]
  const SQL_FILE = 'sqls/' + INTEGRATION_NAME + '.sql'
  const RETHINK_TABLE = process.argv[3]
  const LOWER_BOUND = process.argv[4] ? process.argv[4] : null
  const UPPER_BOUND = process.argv[5] ? process.argv[5] : null

  let sendToCxEnse = (row, rooturl) => {
    cxense.publish(rooturl + row.old_materia_path)
      .then((response) => {
        // resposta do cxense
        console.log('inserido no cxense: ' + row.old_materia_id)
        console.log('resposta cxense: ')
        console.log(response)
      })
  }

  let transform = (row) => {

    let data = models.persistData

    data.sourceData = row
    data.sourceType = INTEGRATION_NAME
    data.sourceId = row.old_materia_cd
    data.friendlyId = shortid.generate()
    data.cxResponse = {}

    let preencheAutores = (autor) => {
      let xret = {}

      xret.nome = autor.nm_autor
      xret.email = autor.ds_autor_email
      xret.facebook = autor.ds_autor_faceb
      xret.instagram = null
      xret.twitter = autor.ds_autor_twite
      xret.endEletronicoPessoal = null

      return xret
    }

    let str = row.old_materia_path

    // tratando o endereço antigo.
    let rexp_path = str.match(/(^[^_]*_conteudo)|(?=[A-Za-z0-9.-]+\.[A-Za-z0-9.-]{3,4}$).+/g)
    let rexp_file = _.tail(_.head(str.match(/((?=[A-Za-z.-]+\.[A-Za-z0-9.-]{3,4}$).+)/g)))

    let taxonomia = ''
    rexp_path.forEach((el) => {
      taxonomia = str.replace(el, '')
    })

    let file = rexp_file + '-' + data.friendlyId

    data.materia = {
      'taxonomia': taxonomia,
      'file': file,
      'autor': row.autores.map(d => preencheAutores(d)),
      'tag': row.old_materia_palavra ? row.old_materia_palavra.split(',') : [],
      'sessao': '',
      'local': '',
      'imagem': {
        'url': '', // aguardar email de deuclerio da analise do midia
        'caption': row.old_materia_midia
      },
      'materia': {
        'id': row.old_materia_id,
        'dataInclusao': row.old_materia_data_inclusao,
        'dataPublicacao': row.old_materia_data_publicacao,
        'assunto': row.old_materia_assunto,
        'titulo': row.old_materia_titulo,
        'conteudo': {
          'subTitulo': row.old_materia_chape,
          'newsContent': row.old_materia_ds
        },
        'chamada': row.old_materia_chape,
        'endEletronico': row.old_materia_path,
        'endEletronicoCompart': row.old_materia_path_encurtado,
        'impresso': {
          'edicao': row.old_jornal_cd + ' ' + row.old_jornal_ds,
          'ehPaga': false
        },
        'podeComentar': true,
        'geolocalizacao': {
          'latitude': 0,
          'longitude': 0
        },
        tipo: row.old_materia_assunto,
        // "tipo": {
        //    "video": false,
        //    "audio": false,
        //    "entrevista": false,
        //    "artigo": false,
        //    "materiaEspecial": false,
        //    "transito": false
        // },
        'dataValidade': null,
        'humor': null,
        // "humor": {
        //    "feliz": false,
        //    "neutro": false,
        //    "triste": false
        // },
        'relevanciaEditorial': null
      },
      'fonte': {
        'nome': row.old_noticia_nm_fonte ? row.old_noticia_nm_fonte : null,
        'endEletronico': row.old_noticia_ds_fonte_url ? row.old_noticia_ds_fonte_url : null
      }

    }

    return data
  }

  let writeRowRethink = (row, conn) => {

    try {
      return rUtils.r.table(RETHINK_TABLE).insert(row).run(conn)
        .then((resp) => {
          console.log(resp)
          return resp
        })
        .catch((error) => {
          // tratar erro , a principio o erro de linha não para o processo.
          console.error('error on ' + row.old_materia_id + ':')
          console.error(error)
        })
    } catch (err) {
      throw err
    }
  }

  let callMaxValue = (conn) => {
    console.info('parte 1 - obtendo o old_materia_cd')
    return rUtils.r.table(RETHINK_TABLE)
      .filter({sourceType: INTEGRATION_NAME})
      .max('sourceId')
      .run(conn)
      .catch((err) => {
        if (err) {
          console.warn('rethinkdb está vazio!')
          return {sourceId: -1}
        }
      })
  }

  let assemblySQL = (maxValue, lowerBound, upperBound, sqlpath) => {
    const sqlString = fs.readFileSync(sqlpath).toString()

    // conforme escopo , deve seguir do maior + 1
    let min = 0
    if (maxValue) {
      min = lowerBound ? lowerBound : maxValue.sourceId + 1
    }

    if (min && upperBound) {
      console.info('migração começando de: ' + min + ' e indo até: ' + upperBound)
      return sqlString + ' AND ma.cd_matia >= ' + min + ' AND ma.cd_matia <= ' + upperBound
    } else {
      console.info('migração começando de: ' + min)
      return sqlString + ' AND ma.cd_matia >= ' + min
    }
  }

  let getMySQLdata = (sql, mysqlconn) => mysqlconn.raw(sql)

  // ler arquivo sql
  let getAutores = (cd_matia, mysqlconn) => {
    console.info('obtendo autor para a materia ' + cd_matia)
    return mysqlconn.select('*')
      .from('autmt')
      .innerJoin('autor', 'autmt.cd_autor', 'autor.cd_autor')
      .where('cd_matia', '=', cd_matia)
  }

  let insere_autores = (row, mysqlconn) => {

    let xret = row

    return getAutores(xret.old_materia_cd, mysqlconn)
      .then((autores) => {
        // adiciona coluna autores no json
        console.info('obtido numero de autores da materia ' + xret.old_materia_cd + ':' + autores.length)
        xret.autores = autores
        return xret
      }).catch((err) => {
      console.error('erro obtendo autores da materia = ', xret.old_materia_cd)
    })
  }

  rUtils.getConfig('gazetaonline_filme')
    .then((config) => {
      const knex = require('knex')({
        client: 'mysql',
        connection: {
          host: config.db.dbhost,
          user: config.db.dbuser,
          password: config.db.dbpass,
          database: config.db.dbname
        }
      })

      return knex
    })
    .then((knex) => Promise.all([knex, rUtils.getConnection]))
    // todo testar o fluxo
    .then((result) => {
      // implementar range para simular stream com _.range([start=0], end, [step=1])

      let knex = result[0],conn = result[1]
      let dados = callMaxValue(conn)
        .then((maxValue) => getMySQLdata(assemblySQL(maxValue, LOWER_BOUND, UPPER_BOUND, SQL_FILE), knex))
        .then((response) => _.head(response))

      /*aplicando transformacoes e gravando linha a linha e cascateando em promise*/
      dados.then((linhas) => {
        let promises = []

        linhas.forEach((row) => {
          let promise = insere_autores(row, knex)
            // todo enfileirar a operacao de gravar no cxense e processar o html da materia aqui
            .then((row) => {
              let wdata = transform(row)
              return ejs2html.ejs2html('template.ejs', __dirname + '/model', wdata.file, __dirname + wdata.taxonomia, wdata)
                .then((result) => wdata)
            })
            .then((wdata) => {
              return writeRowRethink(wdata, conn)
            })
            .catch((err) => console.error(err.message))

          // enfileirando promise
          promises.push(promise)
        })

        /*aguardando o final para que todas as promises processem*/
        Promise.all(promises).then(() => {
          console.info('processo finalizado com sucesso')
          process.exit(0)
        })
      }).catch((err) => {
        console.log(err.message)
        process.exit(-1)
      })
    })
    .catch((err) => {
      console.error(err.message)

      /* fonte
       * http://stackoverflow.com/questions/5266152/how-to-exit-in-node-js
       * */
      process.exit(-1)
    })
}())
