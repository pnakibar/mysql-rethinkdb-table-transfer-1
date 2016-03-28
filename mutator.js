const mutations = {
  'id_matia': 'id_materia'
}

module.exports = function (original) {
  var mutated = {}

  for (var key in original) {
    if (mutations[key]) {
      mutated[mutations[key]] = original[key]
    } else {
      mutated[key] = original[key]
    }
  }

  return mutated
}
