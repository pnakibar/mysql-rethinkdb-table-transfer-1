(function () {
    'use strict';
    let rp = require('request-promise');
    let cxenseapiUrl = 'https://api.cxense.com';
    const crypto = require('crypto');
    const ROOT_URL = process.env['cxenserooturl'];


    // let resultFields = ['url', 'id', 'title', 'description', 'dominantthumbnail', 'dominantthumbnaildimensions', 'createtime', 'score']
    let sortFields = [{
        type: 'time',
        'order': 'descending',
        field: 'createtime'
    },
        {
            type: 'score',
            'order': 'descending'
        }];


    // let siteId = process.env.cxensesiteid
    let username = process.env.cxenseusername;
    let apiKey = process.env.cxenseapikey;

    /*
     export let generateHeader = function (username, secret, date) {
     let hex = crypto.createHmac('sha256', secret).update(date).digest('hex')
     return 'username=' + username + ' date=' + date.toISOString() + ' hmac-sha256-hex=' + hex
     }
     */

    let ops = {
        push: 'push',
        delete: 'delete',
        fetch: 'fetch'
    };


    let _callContent = function (url, op) {
        let cxenseapiUrl = cxenseapiUrl + '/profile/content/' + ops[op];

        var date = new Date().toISOString();
        var hmac = crypto.createHmac('sha256', apiKey).update(date).digest('hex');

        return rp.post({
            url: cxenseapiUrl,
            headers: {'X-cXense-Authentication': 'username=' + username + ' date=' + date + ' hmac-sha256-hex=' + hmac},
            body: {'url': url},
            json: true
        }).then((resp) => {
            return resp;
        });
    };

    let exists = (url) => {
        return _callContent(url, ops.fetch)
            .then(resp => (!!resp.httpStatus && resp.httpStatus == 200 ))
            .catch((err) => false)
    };

    /*
     fluxo
     1 - verifica se está publicado
     2 - remove se sim , faz nada se não
     3 - publica novamente
     */
    let publish = (url) => {
        return exists(url)
            .then((exist) => exists ? _callContent(url, ops.delete) : exist)
            .then(() => _callContent(url, ops.push))

    };


    /*
     fluxo
     1 - verifica existencia
     2 - remove se existr
     3 - retorna boolean se conseguiu , no catch ele fala false
     */
    let unpublish = (url) => {
        return exists(url)
            .then((exist) => exists ? _callContent(url, ops.delete) : true)
            .then(() => true)
            .catch((err) => false)

    };

    module.exports = {
        publish: publish,
        unpublish: unpublish
    };


}());

