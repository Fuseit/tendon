const defaultModelData = {
  id: undefined,
  containers: [],
  available_widgets: []
};

const defaultMocks = {
  onMock: () => {},
  addMock: () => {}
};

/**
 * Generates an object that mocks a backbone model. Takes in dynamic data and
 * mock functions to enable custom mock behaviour per instance.
 * @param {Object} mockData Data contained inside this mock backbone model.
 * @param {Object} mocks    Object of mocks that allows for custom mock behaviour per mock instance
 */
const generateMockBackboneModel = (
  mockData = defaultModelData,
  mocks = defaultMocks
) => {
  return {
    toJSON: () => {
      return {
        ...mockData
      };
    },

    // TODO: clean this up. Possibly use mocks.getMock
    // Not great, this is too tied to the implementation.
    get: key => {
      if (key === 'containers') {
        return {
          on: mocks.onMock,
          add: mocks.addMock,
          toJSON: () => mockData.containers
        };
      }

      if (key === 'id') {
        return mockData.id;
      }

      return {
        toJSON: () => mockData.available_widgets
      };
    }
  };
};

export default { generateMockBackboneModel };
