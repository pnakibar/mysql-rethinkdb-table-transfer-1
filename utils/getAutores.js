module.exports = (materia, knex) => {
  'use strict'
  var cd_matia = materia.cd_matia
  return knex.select('*')
    .from('autmt')
    .innerJoin('autor', 'autmt.cd_autor', 'autor.cd_autor')
    .where('cd_matia', '=', cd_matia).then((autores) =>{
      let newMateria = materia
      newMateria.autores = autores
      return materia
    })
}
