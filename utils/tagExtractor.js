module.exports = (text) => {
  'use strict'
  let regex = /<(?!br|b|spam|a|div|iframe|strong|em|p|\/a|\/div|\/p|\/iframe|\/b|\/strong|\/em|\/spam).*?>/g
  return text.replace(regex, '')
}
