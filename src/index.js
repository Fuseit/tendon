/**
 * Module responsible for handling data integration of sidebar app and the grid
 * app. It Handles this by publishing and subscribing to different events, as
 * well as hooking up application data handlers on these events.
 *
 * Some context here:
 * The single source of truth of the data lives in the monolith. Considering the
 * complexity it would take to move that over to our new stack, we've decided to
 * leave the data there for now and use this mechanism to handle the
 * complexities of this data integration.
 */

import * as Events from './eventConstants';

class Tendon {
  constructor(PubSub, model, containersKey) {
    this.PubSub = PubSub;
    this.model = model;
    this.containers = this.model.get(containersKey);

    // set up the event handler mechanisms.
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

  // Handlers specifically used with backbone events.
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
