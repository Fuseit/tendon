/**
 * Module responsible for handling integration data integration of sidebar app
 * main app. Handles this by publishing and subscribing to different events, as
 * well as hooking up application data handlers on these events.
 */

import * as Events from './eventConstants';

class Tendon {
  constructor(PubSub, model, containersKey) {
    this.PubSub = PubSub;
    this.model = model;
    this.containers = this.model.get(containersKey);

    this.setupPubsubHandlers();
    this.setupBackboneHandlers();
  }

  setupPubsubHandlers() {
    this.PubSub.subscribe(Events.DATA_MODIFY, (msg, data) => {
      const gridId = this.model.get('id');
      this.model.get('containers').add({ ...data, grid_id: gridId });
    });

    // Specifically used for HMR in sidebar application
    this.PubSub.subscribe(Events.DATA_REFRESH, () => {
      this.PubSub.publish(Events.DATA_CHANGE, this.toRawData());
    });
  }

  setupBackboneHandlers() {
    this.containers.on('sync', () => {
      this.PubSub.publish(Events.DATA_CHANGE, this.toRawData());
    });

    this.containers.on('destroy', () => {
      this.PubSub.publish(Events.DATA_CHANGE, this.toRawData());
    });
  }

  /**
   * Marshalls the model data into a raw JS object
   */
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
