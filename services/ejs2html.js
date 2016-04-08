


(function () {
    'use strict';
    /**
     * Created by clayton on 07/04/16.
     */
    let mkdirp = require('mkdirp');
    let fs = require('fs');
    let ejs = require("ejs");
    let Promise = require('bluebird');

    function ejs2html(file , inputPath, outputName , outputPath, information) {



        let _createdir = ((path) => {

            return new  Promise(function(resolve,reject){
                fs.readdir(path, function (err, files) {
                    if (err) {
                        mkdirp(path, function (err) {

                            if (err) {
                                reject(err);
                            }else{
                                resolve(true);
                            }


                        });
                    }else{
                        resolve(true);
                    }
                });
            });
        });


        let _create = ( (path,outpath) => {

            return new  Promise(function(resolve,reject){
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    try {
                        var ejs_string = data,
                            template = ejs.compile(ejs_string),
                            html = template(information);
                        resolve(html);
                    }catch (err) {
                        reject(err);
                    }
                })})
                .then(
                    (html) => new Promise((resolve,reject) => fs.writeFile(outputPath + '/' + outputName + '.html', html, function(err) {
                        if(err) {
                            reject(err);
                        }else{
                            resolve(true);
                        }

                    }))
                );




        });

        return _createdir(outputPath)
            .then((result) => _create(inputPath + '/' + file,outputPath));
    }



    module.exports = {
        ejs2html: ejs2html
    };


}());

