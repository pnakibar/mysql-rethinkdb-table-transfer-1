/**
 * definição de todos os modelos de modelagem
 */
(function() {
  'use strict';
  let autor = {
    'nome':                 '',
    'email':                '',
    'facebook':             '',
    'instagram':            '',
    'twitter':              '',
    'endEletronicoPessoal': ''
  };

  let materia = {
    'friendlyId':  '', 'autor': [], 'tema': {
      'nome': ''
    }, 'tag':      [], 'sessao': '', 'local': '', 'imagens': [ {
      'url': '', 'default': '', 'caption': '', 'width': '', 'height': ''
    } ], 'materia': {
      'id':                   0,
      'dataInclusao':         '',
      'dataPublicacao':       '',
      'assunto':              '',
      'titulo':               '',
      'conteudo':             {
        'subTitulo': '', 'newsContent': ''
      },
      'chamada':              '',
      'endEletronico':        '',
      'endEletronicoCompart': '',
      'impresso':             {
        'edicao': '', 'ehPaga': false
      },
      'podeComentar':         true,
      'geolocalizacao':       {
        'latitude': 0, 'longitude': 0
      },
      'dataValidade':         ''
    }, tipo:       '', 'fonte': {
      'nome': '', 'endEletronico': ''
    }
  };

  let persistData = {
    sourceType: '', sourceData: {}, sourceId: '', materia: materia, cxResponse: {}
  };

  module.exports = {
    materia: materia, autor: autor, persistData: persistData
  };

}());
