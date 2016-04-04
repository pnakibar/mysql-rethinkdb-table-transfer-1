(function () {
    "use strict";
    const _ = require('lodash');
    const fs = require('fs');
    let cxense = require('./services/cxense.js');
    var r = require('rethinkdb');

    // args
    const db_host = process.argv[2];
    const db_user = process.argv[3];
    const db_password = process.argv[4];
    const db_database = process.argv[5];
    const SQL_FILE = process.argv[6];
    const RETHINK_HOST = process.argv[7];
    const RETHINK_DB = process.argv[8];
    const RETHINK_TABLE = process.argv[9];
    const LOWER_BOUND = process.argv[10] ? process.argv[10] : null;
    const UPPER_BOUND = process.argv[11] ? process.argv[11] : null;


    // env vars
    const ROOT_URL = process.env.cxenserooturl;


    // conexão por padrão tenta no localhost
    console.log('RETHINK HOST: ' + RETHINK_HOST);

    let rconn = r.connect({
        host: RETHINK_HOST,
        db: RETHINK_DB
    });


    const knex = require('knex')({
        client: 'mysql',
        connection: {
            host: db_host,
            user: db_user,
            password: db_password,
            database: db_database,
            charset: 'latin1'
        }
    });

    // ler arquivo sql
    let getAutores = (cd_matia) => {
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


    let sendToCxEnse = (row,rooturl) => {
        cxense.publish(rooturl + row.old_materia_path)
            .then((response) => {
                // resposta do cxense
                console.log('inserido no cxense: ' + row.old_materia_id);
                console.log('resposta cxense: ');
                console.log(response)

            });
    };


    let writeRowRethink = (row,conn) => {
        return r.table(RETHINK_TABLE).insert(row).run(conn)
            .then((resp) => {
                console.log(resp);
            })
            .catch((error) => {
                // tratar erro , a principio o erro de linha não para o processo.
                console.error('error on ' + row.old_materia_id + ':');
                console.error(error);

            });
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


        //Promise.all(promises).then(() => {
        //    console.info('processos executados com sucesso');
        //    process.exit(0);
        //})
    };





    let getMySQLdata = (sql) => knex.raw(sql);



    let callMaxValue = (conn) => {
        console.info('parte 1 - obtendo o old_materia_cd');

        return r.table(RETHINK_TABLE)
            .max('old_materia_cd')
            .run(conn)
            .catch((err) => {
                if (err) {
                    console.warn('rethinkdb está vazio!');
                    return {old_materia_cd: -1}
                }
            })
    };


    rconn
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
                        .then((row) => writeRowRethink(row,conn));

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









}());


