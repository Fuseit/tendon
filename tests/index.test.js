import MockUtils from './mockUtils';
import Tendon from '../src/index';
import * as Events from '../src/topics';

let mockPubSub; // Mock of our pub sub mechanism.
let mockModel; // Mock of the backbone model.
let tendon;

beforeEach(() => {
  mockPubSub = {
    subscribe: jest.fn()
  };
});

describe('Tendon instance', () => {
  const onMock = jest.fn(); // Mock used to spy on the 'on' backbone collection method

  beforeEach(() => {
    const mocks = {
      onMock
    };
    mockModel = MockUtils.generateMockBackboneModel(undefined, mocks);
    tendon = new Tendon(mockPubSub, mockModel);
  });

  test('correctly sets up the topic subscriptions', () => {
    // see here if confused about mock.calls[0][0] syntax
    // https://jestjs.io/docs/en/mock-function-api#mockfnmockcalls
    expect(mockPubSub.subscribe.mock.calls[0][0]).toBe(Events.DATA_MODIFY);
    expect(mockPubSub.subscribe.mock.calls[1][0]).toBe(Events.DATA_REFRESH);
  });

  test('correctly sets up the backbone event listeners', () => {
    expect(onMock.mock.calls[0][0]).toBe('sync');
    expect(onMock.mock.calls[1][0]).toBe('destroy');
  });

  describe('.toRawData() method', () => {
    beforeEach(() => {
      // setup of the mocked backbone model and what data it should contain.
      const modelData = { foo: 1 };
      const containersData = [{ bar: 2 }];
      const availableWidgetsData = [{ baz: 3 }];

      // this is the data we are passing into the backbone mock and what we will
      // expect in a raw data in the assertion.
      const mockModelData = {
        ...modelData,
        containers: containersData,
        available_widgets: availableWidgetsData
      };

      mockModel = MockUtils.generateMockBackboneModel(mockModelData);
      tendon = new Tendon(mockPubSub, mockModel);
    });

    test('correctly converts a backbone data structure to a raw JS object', () => {
      expect(tendon.toRawData()).toEqual({
        foo: 1,
        containers: [{ bar: 2 }],
        available_widgets: [{ baz: 3 }]
      });
    });
  });
});
