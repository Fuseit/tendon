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

export default Event;