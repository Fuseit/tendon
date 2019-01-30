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

  onMock = jest.fn();
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
      mockPubSub = {
        subscribe: jest.fn()
      };

      onMock = jest.fn();
      mockModel = {
        get: key => ({
          on: onMock,
          toJSON: () => ({ bar: 2 })
        }),
        toJSON: () => ({ foo: 1 })
      };

      tendon = new Tendon(mockPubSub, mockModel);
    });

    test('correctly marshalls a backbone data structure to a raw JS object', () => {
      expect(tendon.toRawData()).toEqual({
        foo: 1,
        containers: [{ bar: 2 }],
        available_widgets: [{ baz: 3 }]
      });
    });
  });
});
