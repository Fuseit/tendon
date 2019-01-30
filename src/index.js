/**
 * Module responsible for handling data integration of sidebar app and the grid
 * app. It Handles this by publishing and subscribing to different events, as
 * well as hooking up application data handlers on these events.
 *
 * Some context here:
 * The single source of truth of the data lives in the monolith. Considering the
 * complexity it would take to move that over to our new stack, we've decided to
 * leave the data there for now and use this mechanism to handle the
 * complexities of this data integration between the two applications.
 */

import * as Events from './topics';
import handlers from './handlers';

class Tendon {
  constructor(PubSub, model) {
    this.PubSub = PubSub;
    this.model = model;

    // set up the topic handler mechanisms.
    this._setupPubsubHandlers();
    this._setupBackboneHandlers();
  }

  _setupPubsubHandlers() {
    // Listens for an application wants to modify the data.
    this.PubSub.subscribe(Events.DATA_MODIFY, (msg, data) => {
      handlers.updateContainersCollection(data, this.model);
    });

    // Specifically used for HMR in sidebar application
    this.PubSub.subscribe(Events.DATA_REFRESH, () => {
      handlers.broadcastData(this.PubSub, this.toRawData());
    });
  }

  // Handlers specifically used with backbone events.
  _setupBackboneHandlers() {
    const containers = this.model.get('containers');

    containers.on('sync', () => {
      handlers.broadcastData(this.PubSub, this.toRawData());
    });

    containers.on('destroy', () => {
      handlers.broadcastData(this.PubSub, this.toRawData());
    });
  }

  /**
   * Marshalls the model data into a raw JS object
   * TODO: move out?
   */
  toRawData() {
    const modelData = Object.assign(
      this.model.toJSON(),
      { containers: this.model.get('containers').toJSON() },
      { available_widgets: this.model.get('available_widgets').toJSON() }
    );
    return modelData;
  }
}

export default Tendon;
