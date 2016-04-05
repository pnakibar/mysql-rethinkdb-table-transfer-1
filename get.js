(function () {
    "use strict";
    const _ = require('lodash');
    const fs = require('fs');
    let cxense = require('./services/cxense');
    let rUtils = require('./services/rethinkUtils');
    let models = require('./model/materia');


    // args
    const INTEGRATION_NAME = process.argv[2];
    const SQL_FILE = INTEGRATION_NAME + '.sql';
    const RETHINK_TABLE = process.argv[3];
    const LOWER_BOUND = process.argv[4] ? process.argv[4] : null;
    const UPPER_BOUND = process.argv[5] ? process.argv[5] : null;


    let assemblySQL = (maxValue,lowerBound,upperBound,sqlpath) => {
        const sqlString = fs.readFileSync(sqlpath).toString();


        // conforme escopo , deve seguir do maior + 1
        let min = 0;
        if (maxValue){
            min = lowerBound ? lowerBound : maxValue.old_materia_cd + 1;
        }


        if (min && upperBound) {
            console.info('migração começando de: ' + min + ' e indo até: ' + upperBound);
            return sqlString + ' AND ma.cd_matia >= ' + min + ' AND ma.cd_matia <= ' + upperBound
        } else{
            console.info('migração começando de: ' + min);
            return sqlString + ' AND ma.cd_matia >= ' + min
        }


    };


    let sendToCxEnse = (row,rooturl) => {
        cxense.publish(rooturl + row.old_materia_path)
            .then((response) => {
                // resposta do cxense
                console.log('inserido no cxense: ' + row.old_materia_id);
                console.log('resposta cxense: ');
                console.log(response)

            });
    };

    let transform = (row) => {




        let data = models.persistData;

        //data.sourceData = row;
        data.sourceType = INTEGRATION_NAME;
        data.sourceId = row.old_materia_cd;
        data.cxResponse = {};


        let preencheAutores =  (autor) => {
            let xret = {};

            xret.nome = autor.nm_autor;
            xret.email = autor.ds_autor_email;
            xret.facebook  = autor.ds_autor_faceb;
            xret.instagram  = null ;
            xret.twitter  = autor.ds_autor_twite ;
            xret.endEletronicoPessoal  = null;

            return xret;
        };

        data.materia = {
            "autor" : row.autores.map(d=> preencheAutores(d)),
            "tag": row.old_materia_palavra ? row.old_materia_palavra.split(','): [],
            "sessao": "",
            "local": "",
            "imagem": {
                "url": "",
                "caption": ""
            },
            "materia": {
                "id": row.old_materia_id,
                "dataInclusao": row.old_materia_data_inclusao,
                "dataPublicacao": row.old_materia_data_publicacao,
                "assunto": row.old_materia_assunto,
                "titulo": row.old_materia_titulo,
                "conteudo": {
                    "subTitulo": "",
                    "newsContent": row.old_materia_ds
                },
                "chamada": row.old_materia_chape,
                "endEletronico": row.old_materia_path,
                "endEletronicoCompart": row.old_materia_path_encurtado,
                "impresso": {
                    "edicao": row.old_jornal_cd + ' ' + row.old_jornal_ds,
                    "ehPaga": false
                },
                "podeComentar": true,
                "geolocalizacao": {
                    "latitude": 0,
                    "longitude": 0
                },
                tipo: row.old_materia_assunto,
                //"tipo": {
                //    "video": false,
                //    "audio": false,
                //    "entrevista": false,
                //    "artigo": false,
                //    "materiaEspecial": false,
                //    "transito": false
                //},
                "dataValidade": null,
                "humor" : null,
                //"humor": {
                //    "feliz": false,
                //    "neutro": false,
                //    "triste": false
                //},
                "relevanciaEditorial": null
            },
            "fonte": {
                "nome": row.old_noticia_nm_fonte ? row.old_noticia_nm_fonte : null ,
                "endEletronico": row.old_noticia_ds_fonte_url ? row.old_noticia_ds_fonte_url : null
            }

        };





        //data.data = {
        //    id : row.old_materia_id,
        //    autor: row.autores.map(d=> preencheAutores(d)),
        //    tag : row.old_materia_palavra ? row.old_materia_palavra.split[',']: null,
        //    dataInclusao : row.old_materia_data_inclusao,
        //    dataPublicacao: row.old_materia_data_publicacao,
        //    assunto: row.old_materia_assunto,
        //    titulo : row.old_materia_titulo,
        //    conteudo : row.old_materia_ds,
        //    chamada : row.old_materia_chape,
        //    endEletronico : row.old_materia_path,
        //    endEletronicoCompart: row.old_materia_path_encurtado,
        //    impresso: row.old_jornal_cd + ' ' + row.old_jornal_ds,
        //    geolocalizacao: null, // duvida (obs.: Desenvolvi webservice que retorna a geolocalização conforme endereço informado)
        //    tipo: row.old_materia_assunto,
        //    dataValidade: null,
        //    humor: null,
        //    relevanciaEditorial: null,
        //    fonte: row.nm_notia_fonte ?   row.nm_notia_fonte  + ' ' + row.old_noticia_ds_fonte_url : null
        //};

        return data;
    };



    let writeRowRethink = (row,conn) => {

        try {
            let wdata = transform(row);

            return rUtils.r.table(RETHINK_TABLE).insert(wdata).run(conn)
                .then((resp) => {
                    console.log(resp);
                })
                .catch((error) => {
                    // tratar erro , a principio o erro de linha não para o processo.
                    console.error('error on ' + row.old_materia_id + ':');
                    console.error(error);

                });

        }catch (err) {
            throw err;
        }




    };


    let callMaxValue = (conn) => {
        console.info('parte 1 - obtendo o old_materia_cd');

        return rUtils.r.table(RETHINK_TABLE)
            .max('sourceId')
            .run(conn)
            .catch((err) => {
                if (err) {
                    console.warn('rethinkdb está vazio!');
                    return {old_materia_cd: -1}
                }
            })
    };

    rUtils.getConfig('gazetaonline_filme')
        .then((config) => {
            const knex = require('knex')({
                client: 'mysql',
                connection: {
                    host: config.db.dbhost,
                    user: config.db.dbuser,
                    password: config.db.dbpass,
                    database: config.db.dbname,
                    charset: 'latin1' //config.charset
                }
            });

            let getMySQLdata = (sql) => knex.raw(sql);

            // ler arquivo sql
            let getAutores = (cd_matia) => {
                console.info('obtendo autor para a materia ' + cd_matia);
                return knex.select('*')
                    .from('autmt')
                    .innerJoin('autor', 'autmt.cd_autor', 'autor.cd_autor')
                    .where('cd_matia', '=', cd_matia)
            };


            let insere_autores = (row) => {

                let xret = row;

                return getAutores(xret.old_materia_cd)
                    .then((autores) => {
                        // adiciona coluna autores no json
                        console.info('obtido numero de autores da materia '+ xret.old_materia_cd + ':' + autores.length );
                        xret.autores = autores;
                        return xret;
                    }).catch((err) => {
                        console.error('erro obtendo autores da materia = ', xret.old_materia_cd);
                    });

            };


            rUtils.getConnection
                .then((conn) => {

                    let dados =  callMaxValue(conn)
                        .then((maxValue) =>   getMySQLdata(assemblySQL(maxValue,LOWER_BOUND,UPPER_BOUND,SQL_FILE)) )
                        .then((response) => _.head(response));

                    /*aplicando transformacoes e gravando linha a linha e cascateando em promise*/
                    dados.then((linhas) => {
                        let promises = [];

                        linhas.forEach((row) => {
                            let promise = insere_autores(row)
                            //todo enfileirar a operacao de gravar no cxense e processar o html da materia aqui
                                .then((row) => {
                                    return writeRowRethink(row,conn)
                                }).catch((err) => console.error(err.message));

                            // enfileirando promise
                            promises.push(promise);
                        });

                        /*aguardando o final para que todas as promises processem*/
                        Promise.all(promises).then(() => {
                            console.info('processo finalizado com sucesso');
                            process.exit(0);
                        })

                    })


                })
                .catch((err) => {
                    console.error(err.message);

                    /* fonte
                     * http://stackoverflow.com/questions/5266152/how-to-exit-in-node-js
                     * */
                    process.exit(-1);

                } );

    });











}());


