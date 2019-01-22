const tendon = function(dataHash) {
  this.dataHash = dataHash
  console.log('Tendon init')
  window.test = {
    data: dataHash
  }

  return test
}

tendon.prototype.update = function(key, value) {
  this.dataHash.set(key, value)
}