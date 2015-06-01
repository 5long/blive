module.exports = function(source, proxy, events) {
  if (!Array.isArray(events)) {
    events = [events]
  }

  events.forEach(function(e) {
    source.on(e, proxy.emit.bind(proxy, e))
  })
}
