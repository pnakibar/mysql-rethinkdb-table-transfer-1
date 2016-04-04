(function () {
    "use strict";

    /**
     * importante
     *
     * configuracao base da integracao
     *
     * a primeira linha refere ao nome da integracao
     * a segunda é o criterio das integracoes que tenho que buscar o maior valor para fazer integracoes
     * @type {string}
     */
    const name = 'gazetaonline_filme';
    const integracoes_criteria =  ['gazetaonline_filme','gazetaoneline_noticia'];



    const tipos = require('../tipos');


    const _ = require('lodash');
    const fs = require('fs');
    var r = require('rethinkdb');
    var rethinkUtils = require('../../services/rethinkUtils');

    // args
    const SQL_FILE = 'filmes.sql';
    const LOWER_BOUND = process.argv[2] ? process.argv[3] : null;
    const UPPER_BOUND = process.argv[2] ? process.argv[3] : null;





    // ler arquivo sql
    let getAutores = (cd_matia,knex) => {
        console.info('obtendo autor para a materia ' + cd_matia);
        return knex.select('*')
            .from('autmt')
            .innerJoin('autor', 'autmt.cd_autor', 'autor.cd_autor')
            .where('cd_matia', '=', cd_matia)
    };

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





    let getMySQLdata = (sql,knex) => knex.raw(sql);




    /**
     * funcao que retorna uma lista de promises linha a linha para aplicar operadores na parte funcional da integracao
     */
    let getRows = () => {
        let rconn = rethinkUtils.getConnection;
        let knex = rethinkUtils.getConfig(name)
            .then((config) => {
                if (config && config.db){

                    return require('knex')({
                        client: config.db.type,
                        connection: {
                            host: config.db.dbhost,
                            port: config.db.dbport,
                            user: config.db.dbuser,
                            password: config.db.dbpass,
                            database: config.db.dbname,
                            charset: config.db.dbencoding
                        }
                    });


                } else {
                    return null;
                }

            });

        rconn
            .then((conn) => {
                return Promise.all(rethinkUtils.getMax(conn,[name,integracoes_criteria]),knex);
            })
            .then((arrResp) => {
                if (arrResp[1]){
                    return getMySQLdata(assemblySQL(arrResp[0],LOWER_BOUND,UPPER_BOUND,SQL_FILE),arrResp[1]);
                }else{
                    return [[]];
                }

            })
            .then((response) => _.head(response))
            .then((linhas) => {
                let promises = [];

                linhas.forEach((row) => {
                    let promise = insere_autores(row);
                    // enfileirando promise
                    promises.push(promise);
                });

                return promises;
            });

    }



}());


