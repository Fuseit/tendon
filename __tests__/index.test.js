import MockUtils from './mockUtils';
import Tendon from '../src/index';
import * as Events from '../src/topics';

let mockPubSub; // Mock of our pub sub mechanism.
let mockModel; // Mock of our backbone model.
let onMock; // Mock backbone collection 'on' method.
let tendon;

beforeEach(() => {
  mockPubSub = {
    subscribe: jest.fn()
  };

  onMock = jest.fn(); // used to spy on the 'on' backbone coollection method
  mockModel = {
    get: () => ({
      on: onMock
    })
  };

  tendon = new Tendon(mockPubSub, mockModel);
});

describe('Tendon instance', () => {
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
      onMock = jest.fn();
      mockModel = {
        toJSON: () => ({ foo: 1 }),
        get: key => {
          if (key === 'containers') {
            return {
              on: onMock,
              toJSON: () => [{ bar: 2 }]
            };
          }
          return {
            toJSON: () => [{ baz: 3 }]
          };
        }
      };

      tendon = new Tendon(mockPubSub, mockModel);
    });

    test('correctly marshalls a backbone data structure to a raw JS object', () => {
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
      tendon.model = mockModel;

      expect(tendon.toRawData()).toEqual({
        foo: 1,
        containers: [{ bar: 2 }],
        available_widgets: [{ baz: 3 }]
      });
    });
  });
});
