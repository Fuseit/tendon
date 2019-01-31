const defaultModelData = {
  containers: [],
  available_widgets: []
};

const defaultMocks = {
  onMock: () => {}
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

    get: key => {
      // TODO: make this more dynamic.
      if (key === 'containers') {
        return {
          on: mocks.onMock,
          toJSON: () => mockData.containers
        };
      }
      return {
        toJSON: () => mockData.available_widgets
      };
    }
  };
};

export default { generateMockBackboneModel };
