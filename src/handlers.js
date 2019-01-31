/**
 * Module containing the topic handlers. These are the functions that implement
 * the details of how the data should be shared between the applications. (i.e.
 * details of how backbone data structures should be updated and how this is
 * shared with other applications)
 */

import * as Topics from './topics';

const updateContainersCollection = (data, model) => {
  const gridId = model.get('id');
  model.get('containers').add({ ...data, grid_id: gridId });
};

const broadcastData = (PubSub, data) => {
  PubSub.publish(Topics.DATA_CHANGE, data);
};

export default {
  updateContainersCollection,
  broadcastData
};
