console.log('Tendon module available in global scope')
const tendon = function(model) {
  this.model = model
  console.log('Tendon init')
  window.test = {
    data: model
  }
}

tendon.prototype.update = function(obj) {
  // Too specific? 
  this.model.get('containers').add(obj)
}

tendon.prototype.fetch = function(key) { 
  return this.model.get(key).toJSON()
}

tendon.prototype.fetchModel = function() {
  return this.model
}