console.log('Tendon module available in global scope')
const tendon = function(dataHash) {
  this.dataHash = dataHash
  console.log('Tendon init')
  window.test = {
    data: dataHash
  }
}

tendon.prototype.update = function(obj) {
  // Too specific? 
  this.dataHash.get('containers').add(obj)
}

tendon.prototype.fetch = function(key) { 
  return this.dataHash.get(key).toJSON()
}

tendon.prototype.fetchModel = function() {
  return this.dataHash
}