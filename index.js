console.log('Tendon module available in global scope')

// Ripped debounce function,
// ideally this would come from an import
function debounce(func, wait, immediate) {
  var timeout

  return function executedFunction() {
    var context = this
    var args = arguments

    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    var callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}

// Custom event class
const Event = function(sender) {
  this._sender = sender
  this._handlers = []
}

Event.prototype.attach = function(handler) {
  this._handlers.push(handler)
}

Event.prototype.notify = function(...args) {
  const sender = this.sender
  this._handlers.forEach(function(handler) {
    return handler(...args, sender) // Do we really need the sender as it's only one event?
  })
}

const tendon = function(model, containersKey) {
  this.model = model
  this.containers = this.model.get(containersKey) 

  // For testing
  window.tendonInstance = {
    model: this.model,
    containers: this.containers
  }

  this.modelUpdateEvent = new Event(this)
  this.modelFetchEvent = new Event(this)
  this.viewUpdateEvent = new Event(this)

  this.setupHandlers()

  // Debounced as to not cause unnecessary re-renders
  this.debouncedFetchEvent = debounce(
    event => this.modelFetchEvent.notify(event),
    50,
    false
  ) // Result may not need to be passed
}

tendon.prototype.update = function(obj, destination) {
  console.log(obj, destination)
  this.model.get(destination).add(obj)
  this.modelFetchEvent.notify({
    type: 'FETCH',
    payload: {
      keys: ['available_widgets', 'containers']
    }
  }) // Result may not need to be passed
}

tendon.prototype.fetch = function({ payload: { keys } }) {
  let res = {}
  keys.forEach(key => {
    res = {
      ...res,
      [key]: [...this.model.get(key).toJSON()]
    }
  })

  // The React component will use this to trigger an update
  this.viewUpdateEvent.notify(res)
  return res
}

tendon.prototype.fetchModel = function() {
  return this.model.toJSON()
}

tendon.prototype.setupHandlers = function() {
  this.modelUpdateEvent.attach(this.handleModelUpdate.bind(this))
  this.modelFetchEvent.attach(this.fetch.bind(this))

  // Backbone events
  this.containers.on('sync', collection => {
    this.modelUpdateEvent.notify({ type: 'SYNC', collection })
  })

  this.containers.on('destroy', () => {
    this.modelUpdateEvent.notify({ type: 'DESTROY' })
  })
}

tendon.prototype.handleModelUpdate = function(event) {
  console.log(
    '%cThe model was updated!',
    'color: green; font-size: large; background-color: lightBlue;',
    event
  )
  this.debouncedFetchEvent({
    type: 'FETCH',
    payload: {
      keys: ['available_widgets', 'containers']
    }
  }) // Result may not need to be passed))
}
