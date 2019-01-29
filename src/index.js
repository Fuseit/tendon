/**
 * Module responsible for handling integration data integration of sidebar app
 * main app.
 */

import debounce from 'lodash.debounce';

class Tendon {
  constructor(PubSub, model, containersKey) {
    this.PubSub = PubSub;
    this.model = model;
    this.containers = this.model.get(containersKey);

    this.setupPubsubHandlers();
    this.setupBackboneHandlers();

    // Debounced as to not cause unnecessary re-renders
    this.debouncedFetchEvent = debounce(
      event => this.modelFetchEvent.notify(event),
      1500, // Debounce time
      true,
    ); // Result may not need to be passed
  }

  setupPubsubHandlers() {
    this.PubSub.subscribe('data.update', (msg, data) => {
      const gridId = this.model.get('id');
      this.model.get('containers').add({ ...data, grid_id: gridId });
      console.log(
        '%cThe model was updated!',
        'color: green; font-size: large; background-color: lightBlue;',
        data,
      );
    });

    this.PubSub.subscribe('data.refresh', () => {
      this.PubSub.publish('data.changed', this.toRawData());
    });
  }

  setupBackboneHandlers() {
    // Backbone events hookup
    this.containers.on('sync', () => {
      this.PubSub.publish('data.changed', this.toRawData());
    });

    this.containers.on('destroy', () => {
      this.PubSub.publish('data.changed', this.toRawData());
    });
  }

  // TODO: make backbone data marshalling service.make module.
  // to hand over a raw JS object
  toRawData() {
    const modelData = Object.assign(
      this.model.toJSON(),
      { containers: this.model.get('containers').toJSON() },
      { available_widgets: this.model.get('available_widgets').toJSON() },
    );
    return modelData;
  }
}

export default Tendon;
