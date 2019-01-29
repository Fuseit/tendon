const setupHandlers = tendonInstance => {
  const { modelUpdateEvent, containers } = tendonInstance;

  // Backbone events
  containers.on('sync', collection => {
    modelUpdateEvent.notify({ type: 'SYNC', collection });
  });

  containers.on('destroy', () => {
    modelUpdateEvent.notify({ type: 'DESTROY' });
  });
};

const attachEvents = tendonInstance => {
  const {
    modelFetchEvent,
    modelUpdateEvent,
    handleModelUpdate,
    fetch,
  } = tendonInstance;

  modelUpdateEvent.attach(handleModelUpdate.bind(tendonInstance));
  modelFetchEvent.attach(fetch.bind(tendonInstance));
};

export { setupHandlers, attachEvents };
