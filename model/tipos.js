/**
 * definição de todos os modelos de modelagem
 *
 * o objeto tem a finalidade somente de mapear
 *
 */
(function() {

  let integracoes = {
    gazetaonline_filme:   require( './gazetaonline_filme/integration' ),
    gazetaonline_noticia: require( './gazetaonline_noticia/integration' )
  };

  let arr = [ 'gazetaonline_filme', 'gazetaonline_noticia' ];

  module.exports = {
    integracoes: integracoes, arr: arr
  };

}());



