// todo
// melhorar o fluxo de saida em caso de erros
// implementar saida forçada em caso de erros continuos.

(function() {

    'use strict';
    const _ = require( 'lodash' );
    const fs = require( 'fs' );
    const ejs2html = require( './services/ejs2html' );
    let cxense = require( './services/cxense' );
    let rUtils = require( './services/rethinkUtils' );
    let models = require( './model/materia' );
    let shortid = require( 'shortid' );
    let Promise = require( 'bluebird' );
    let clean = require( './services/cleanText' );

    // shortid conf
    shortid.characters( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$!' );

    // args
    const INTEGRATION_NAME = process.argv[2];
    const SQL_FILE = 'sqls/' + INTEGRATION_NAME + '.sql';
    const SQL_FILE_ALTER = 'sqls/gazetaonline_alter.sql';
    const RETHINK_TABLE = process.argv[3];

    const LOWER_BOUND = process.argv[4] ? process.argv[4] : null;
    const UPPER_BOUND = process.argv[5] ? process.argv[5] : null;

    let sendToCxEnse = ( row, rooturl ) => {
        cxense.publish( rooturl + row.old_materia_path )
          .then( ( response ) => {
              // resposta do cxense
              console.log( 'inserido no cxense: ' + row.old_materia_id );
              console.log( 'resposta cxense: ' );
              console.log( response );

          } );
    };




    let transform = ( row ) => {

        let data = models.persistData;

        data.sourceData = row;
        data.sourceType = INTEGRATION_NAME;
        data.sourceId = row.old_materia_cd;
        data.friendlyId = shortid.generate();
        data.cxResponse = {};

        let preencheAutores = ( autor ) => {
            let xret = {};

            xret.nome = autor.nm_autor;
            xret.email = autor.ds_autor_email;
            xret.facebook = autor.ds_autor_faceb;
            xret.instagram = null;
            xret.twitter = autor.ds_autor_twite;
            xret.endEletronicoPessoal = null;

            return xret;
        };

        let preencheImagens = ( imagem ) => {
            let xret = {};
            xret.url = imagem.link;
            xret.default = ( imagem.is_default === 1 );
            xret.caption = null;
            xret.width = imagem.width;
            xret.height = imagem.height;

            return xret;
        };

        let str = row.old_materia_path.replace( '/_conteudo', '' );

        // tratando o endereço antigo.
        let rexp_path = str.match( /(?=[A-Za-z0-9.-]+\.[A-Za-z0-9.-]{3,4}$).+/g );
        let rexp_file =  _.head( _.tail( _.last( rexp_path ).match( /(.+?)(\.[^.]*$|$)/i ) ) );
        let rexp_suffix = _.last( _.last( rexp_path ).match( /(.+?)(\.[^.]*$|$)/i ) );

        let taxonomia = str.replace( rexp_file + rexp_suffix, '' );
        let file = rexp_file + '-' + data.friendlyId + rexp_suffix;

        data.materia = {
            'taxonomia': taxonomia,
            'file':      file,
            'autor':     row.autores.map( ( d ) => preencheAutores( d ) ),
            'imagens':   row.imagens.map( ( d ) => preencheImagens( d ) ),
            'tag':       row.old_materia_palavra ? row.old_materia_palavra.split( ',' ) : [],
            //'imagem':    {
            //  'url':     '', // aguardar email de deuclerio da analise do midia
            //  'caption': row.old_materia_midia
            //},
            'materia':   {
                'id':                   row.old_materia_id,
                'dataInclusao':         row.old_materia_data_inclusao,
                'dataPublicacao':       row.old_materia_data_publicacao,
                'assunto':              row.old_materia_assunto,
                'titulo':               row.old_materia_titulo,
                'conteudo':             {
                    'subTitulo': row.old_materia_chape, 'newsContent': row.old_materia_ds
                },
                'chamada':              row.old_materia_chape,
                'endEletronico':        row.old_materia_path,
                'endEletronicoCompart': row.old_materia_path_encurtado,
                'impresso':             {
                    'edicao': row.old_jornal_cd + ' ' + row.old_jornal_ds, 'ehPaga': false
                },
                'podeComentar':         true,
                'geolocalizacao':       {
                    'latitude': 0, 'longitude': 0
                },
                tipo:                   row.old_materia_assunto
            },
            'fonte':     {
                'nome':          row.old_noticia_nm_fonte ? row.old_noticia_nm_fonte : null,
                'endEletronico': row.old_noticia_ds_fonte_url ? row.old_noticia_ds_fonte_url : null
            }

        };

        return data;
    };

    let writeRowRethink = ( row, conn ) => {

        try {

            return rUtils.r.table( RETHINK_TABLE ).insert( row ).run( conn )
              .then( ( resp ) => {
                  console.log( resp );
                  return resp;
              } )
              .catch( ( error ) => {
                  // tratar erro , a principio o erro de linha não para o processo.
                  console.error( 'error on ' + row.old_materia_id + ':' );
                  console.error( error );

              } );

        } catch ( err ) {
            throw err;
        }

    };


    let readRowRethink = ( row, conn, code, integration ) => {
        try {

            return rUtils.r.table( RETHINK_TABLE ).filter( { 'sourceId': code, 'sourceType': integration } )
              .then( ( resp ) => {
                  console.log( resp );
                  return resp;
              } )
              .catch( ( error ) => {
                  // tratar erro , a principio o erro de linha não para o processo.
                  console.error( 'error on ' + row.old_materia_id + ':' );
                  console.error( error );

              } );

        } catch ( err ) {
            throw err;
        }

    };




    let assemblySQLAlter = ( value , sqlpath ) => {
        const sqlString = fs.readFileSync( sqlpath ).toString();
        // conforme escopo , deve seguir do maior + 1
        return sqlString + ' AND ma.cd_matia = ' + value

    };

    let getMySQLdata = ( sql, mysqlconn ) => mysqlconn.raw( sql );

    // ler arquivo sql
    let getAutores = ( cd_matia, mysqlconn ) => {
        console.info( 'obtendo autor para a materia ' + cd_matia );


        return mysqlconn
          .select( '*' )
          .from( 'autmt' )
          .innerJoin( 'autor', 'autmt.cd_autor', 'autor.cd_autor' )
          .where( 'cd_matia', '=', cd_matia );
    };

    // ler arquivo sql
    let getImagens = ( cd_matia, mysqlconn ) => {
        console.info( 'obtendo midias para a materia ' + cd_matia );

        let select_str = `ds_midia_credi as credito,
	     ds_midia_link as link ,
       nm_midia_inter_thumb1 as thumb1,
       nm_midia_inter_thumb2 as thumb2,
       nm_midia_inter_thumb3 as thumb3,
       ds_midma_legen as caption,
       id_midma_princ as is_default,
       cd_midia_h as height,
       cd_midia_w as width`;

        return mysqlconn.select( select_str )
          .from( 'midma' )
          .innerJoin( 'midia', 'midma.cd_midia', 'midia.cd_midia' )
          .where( 'midma.cd_matia', '=', cd_matia );
    };

    let insere_autores = ( row, mysqlconn ) => {

        let xret = row;

        return getAutores( xret.old_materia_cd, mysqlconn )
          .then( ( autores ) => {
              // adiciona coluna autores no json
              console.info( 'obtido numero de autores da materia ' + xret.old_materia_cd + ':' + autores.length );
              xret.autores = autores;
              return xret;
          } ).catch( ( err ) => {
              console.error( 'erro obtendo autores da materia = ', xret.old_materia_cd );
          } );

    };


    let insere_imagens = ( row, mysqlconn ) => {

        let xret = row;

        return getImagens( xret.old_materia_cd, mysqlconn )
          .then( ( imagens ) => {
              // adiciona coluna autores no json
              console.log(xret);
              console.info( 'obtido numero de imagens da materia ' + xret.old_materia_cd + ':' + imagens.length );
              xret.imagens = imagens;
              return xret;
          } ).catch( (err) => {
              console.error( 'erro obtendo imagens da materia = ', xret.old_materia_cd );
          } );

    };

    rUtils.getConfig( 'gazetaonline_filme' )
      .then( ( config ) => {
          const knex = require( 'knex' )( {
              client: 'mysql', connection: {
                  host: config.db.dbhost,
                  user: config.db.dbuser,
                  password: config.db.dbpass,
                  database: config.db.dbname,
                  charset: 'latin1' //config.charset
              }
          } );

          return knex;
      } )
      .then( ( knex ) => Promise.all( [ knex, rUtils.getConnection ] ) )
      //todo testar o fluxo
      .then( ( result ) => {
          // implementar range para simular stream com _.range([start=0], end, [step=1])
          let knex = result[0];
          let conn = result[1];
          let dados = callMaxValue( conn )
            .then( ( maxValue ) => getMySQLdata( assemblySQL( maxValue, LOWER_BOUND, UPPER_BOUND, SQL_FILE ), knex ) )
            .then( ( response ) => _.head( response ) );

          /*aplicando transformacoes e gravando linha a linha e cascateando em promise*/
          dados.then( ( linhas ) => {
              let promises = [];

              linhas.forEach( ( row ) => {
                  let promise = insere_autores( row, knex )
                  //todo enfileirar a operacao de gravar no cxense e processar o html da materia aqui
                    .then( ( row_with_authors ) => insere_imagens( row_with_authors , knex ) )
                    .then( ( row_with_authors_images ) => {
                        let wdata = transform( row_with_authors_images );
                        return ejs2html.ejs2html( 'template.ejs', __dirname + '/model', wdata.materia.file, __dirname + '/out/' + wdata.materia.taxonomia, { noticia : wdata.materia } )
                          .then( () => wdata );
                    } )
                    .then( ( wdata ) => {
                        return writeRowRethink( wdata, conn );
                    } )
                    .catch( ( err ) => console.error( err.message ) );

                  // enfileirando promise
                  promises.push( promise );
              } );

              /*aguardando o final para que todas as promises processem*/
              Promise.all( promises ).then( () => {
                  console.info( 'processo finalizado com sucesso' );
                  process.exit( 0 );
              } );

          } ).catch( ( err ) => {
              console.log( err.message );
              process.exit( -1 );
          } );

      } )
      .catch( ( err ) => {
          console.error( err.message );

          /* fonte
           * http://stackoverflow.com/questions/5266152/how-to-exit-in-node-js
           * */
          process.exit( -1 );

      } );

}());
