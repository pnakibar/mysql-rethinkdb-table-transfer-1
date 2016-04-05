/**
 * definição de todos os modelos de modelagem
 */
(function () {
    'use strict';
    let autor = {
        "nome": "",
        "email": "",
        "facebook": "",
        "instagram": "",
        "twitter": "",
        "endEletronicoPessoal": ""
    };



    let materia = {
        "autor": [],
        "tema": {
            "nome": ""
        },
        "tag": [],
        "sessao": "",
        "local": "",
        "imagem": {
            "url": "",
            "caption": ""
        },
        "materia": {
            "id": 0,
            "dataInclusao": "",
            "dataPublicacao": "",
            "assunto": "",
            "titulo": "",
            "conteudo": {
                "subTitulo": "",
                "newsContent": ""
            },
            "chamada": "",
            "endEletronico": "",
            "endEletronicoCompart": "",
            "impresso": {
                "edicao": "",
                "ehPaga": false
            },
            "podeComentar": true,
            "geolocalizacao": {
                "latitude": 0,
                "longitude": 0
            },
            "tipo": {
                "video": false,
                "audio": false,
                "entrevista": false,
                "artigo": false,
                "materiaEspecial": false,
                "transito": false
            },
            "dataValidade": "",
            "humor": {
                "feliz": true,
                "neutro": false,
                "triste": false
            },
            "relevanciaEditorial": 100
        },
        "fonte": {
            "nome": "",
            "endEletronico": ""
        }
    };


    let persistData = {
        sourceType : "" ,
        sourceData : {} ,
        sourceId : "",
        materia : materia,
        cxResponse : {}
    };




    module.exports = {
        materia : materia,
        autor : autor,
        persistData : persistData
    };


}());
