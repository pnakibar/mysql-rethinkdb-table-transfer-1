module.exports = (row, integrationName) => {
  'use strict'

  let models = require('../model/materia')
  let shortid = require('shortid')
  const _ = require('lodash')

  let data = models.persistData

  data.sourceData = row
  data.sourceType = integrationName
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
