module.exports = (knex, sqlPath, additionalSql) => {
  additionalSql = additionalSql || ''
  console.log(sqlPath)
  var fs = require('fs')
  const sqlString = fs.readFileSync(sqlPath).toString() + additionalSql
  console.log(sqlString)
  return knex.raw(sqlString)
}
