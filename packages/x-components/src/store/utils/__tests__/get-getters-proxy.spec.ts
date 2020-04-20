import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { AnyXStoreModule, RootXStoreState } from '../../store.types';
import { getGettersProxy, getGettersProxyFromModule } from '../get-getters-proxy';

const getter1Spy = jest.fn();
const getter2Spy = jest.fn();

const storeModuleTest: AnyXStoreModule = {
  state: () => ({
    state1: 'state1',
    state2: 'state2'
  }),
  getters: {
    getter1(state: any) {
      getter1Spy();
      return state.state1 + '_modified';
    },
    getter2(state: any) {
      getter2Spy();
      return state.state2 + '_modified';
    }
  },
  namespaced: true
} as any;

const localVue = createLocalVue();
localVue.use(Vuex);
const storeMock = new Store<RootXStoreState>({
  modules: {
    x: {
      modules: {
        searchBox: storeModuleTest
      },
      namespaced: true
    }
  }
});

describe('testing getGettersProxy util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an object with getters proxies for all the real getters', () => {
    const gettersProxy = getGettersProxy(storeMock.getters, 'searchBox');

    expect(gettersProxy).toEqual({ getter1: 'state1_modified', getter2: 'state2_modified' });
  });

  it('not invokes the getter on proxy creation', () => {
    getGettersProxy(storeMock.getters, 'searchBox');
    expect(getter1Spy).not.toHaveBeenCalled();
  });
});

describe('testing getGettersProxyFromModule util', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an object with getters proxies for all the real getters', () => {
    const gettersProxy = getGettersProxyFromModule(storeMock.getters, 'searchBox', storeModuleTest);

    expect(gettersProxy).toEqual({ getter1: 'state1_modified', getter2: 'state2_modified' });
  });

  it('not invokes the getter on proxy creation', () => {
    getGettersProxyFromModule(storeMock.getters, 'searchBox', storeModuleTest);

    expect(getter2Spy).not.toHaveBeenCalled();
  });
});
