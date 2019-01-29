import debounce from 'lodash.debounce';
import Event from './event';
import { attachEvents, setupHandlers } from './handlers';

class tendon {
  constructor(model, containersKey) {
    this.model = model;
    this.containers = this.model.get(containersKey);

    this.modelUpdateEvent = new Event(this);
    this.modelFetchEvent = new Event(this);
    this.viewUpdateEvent = new Event(this);

    setupHandlers(this);
    attachEvents(this);

    // Debounced as to not cause unnecessary re-renders
    this.debouncedFetchEvent = debounce(
      event => this.modelFetchEvent.notify(event),
      1500, // Debounce time
      true,
    ); // Result may not need to be passed
  }

  update(obj, destination) {
    this.model.get(destination).add(obj);
    this.modelFetchEvent.notify({
      type: 'FETCH',
      payload: {
        keys: ['available_widgets', 'containers'],
      },
    }); // Result may not need to be passed
  }

  fetch({ payload: { keys } }) {
    let res = {};
    keys.forEach(key => {
      res = {
        ...res,
        [key]: [...this.model.get(key).toJSON()],
      };
    });

    // The React component will use this to trigger an update
    this.viewUpdateEvent.notify(res);
    return res;
  }

  fetchModel() {
    return this.model.toJSON();
  }

  handleModelUpdate(event) {
    console.log(
      '%cThe model was updated!',
      'color: green; font-size: large; background-color: lightBlue;',
      event,
    );
    this.debouncedFetchEvent({
      type: 'FETCH',
      payload: {
        keys: ['available_widgets', 'containers'],
      },
    }); // Result may not need to be passed))
  }
}

export default tendon;
