module.exports = (text) => {
  'use strict'
  // remove tags que NÃO estão espeficadas abaixo
  let regex = /<(?!br|b|spam|a|div|iframe|strong|em|p|\/a|\/div|\/p|\/iframe|\/b|\/strong|\/em|\/spam|i|\/i).*?>/g
  return text.replace(regex, '')
}
