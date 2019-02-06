import MockUtils from './mockUtils';
import handlers from '../src/handlers';
import * as Topics from '../src/topics';

describe('Topic/Event handlers', () => {
  describe('updateContainersCollection handler', () => {
    test('should make backbone method calls to get the containers model and a widget to it', () => {
      const mockData = { foo: 1 };
      const mockModelData = {
        id: 2
      };
      const mocks = {
        addMock: jest.fn()
      };
      const mockModel = MockUtils.generateMockBackboneModel(
        mockModelData,
        mocks
      );

      handlers.updateContainersCollection(mockData, mockModel);
      expect(mocks.addMock).toBeCalledWith({
        foo: 1,
        grid_id: 2
      });
    });
  });

  describe('broadcastData handler', () => {
    test('correctly broadcasts the data to all listeners ', () => {
      const mockPubSub = {
        publish: jest.fn()
      };
      const mockData = {
        foo: 'hello'
      };

      handlers.broadcastData(mockPubSub, mockData);
      expect(mockPubSub.publish).toBeCalledWith(Topics.DATA_CHANGE, mockData);
    });
  });
});
