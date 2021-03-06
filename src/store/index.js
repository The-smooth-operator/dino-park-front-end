import Vuex from 'vuex';
import Vue from 'vue';
import { DISPLAY_PROFILE } from '@/queries/profile';
import Scope from '@/assets/js/scope';
import Onboarding from '@/assets/js/onboarding';
import { client } from '@/server';
import user from './user.store';
import scope from './scope.store';
import accessGroup from './access-group.store';
import accessGroups from './access-groups.store';
import features from './features.store';

async function fetchUser(commit) {
  try {
    const { data } = await client.query({
      query: DISPLAY_PROFILE,
      variables: { username: null },
    });
    commit('setUser', data.profile);
    return true;
  } catch (e) {
    const {
      graphQLErrors: [{ message }],
    } = e;
    if (message === 'wait_for_profile') {
      console.log('creating');
    }
    commit('setUser', { loggedIn: true });
    return false;
  }
}

async function retryFetchUser(commit, retries = 120) {
  if (!(await fetchUser(commit)) && retries > 0) {
    setTimeout(() => retryFetchUser(commit, retries - 1), 1000);
  }
}

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    userV2: user,
    scopeV2: scope,
    features,
    accessGroup,
    accessGroups,
  },
  state: {
    user: null,
    scope: new Scope(),
    org: null,
    error: false,
    loading: false,
    onboarding: new Onboarding(),
  },
  actions: {
    // TODO: Create error handling for this action
    async fetchUser({ commit }) {
      await retryFetchUser(commit);
    },
    setLoading({ commit }) {
      commit('setLoading', true);
    },
    completeLoading({ commit }) {
      commit('setLoading', false);
    },
  },
  mutations: {
    setUser(state, userContent) {
      state.user = userContent;
      state.scope.update(userContent);
      if (
        (state.features?.onboarding || window.location.hash === '#tour') &&
        state.scope.firstTime
      ) {
        state.onboarding.enable();
      }
    },
    setOrg(state, org) {
      state.org = org;
    },
    setLoading(state, loadingState) {
      state.loading = loadingState;
    },
  },
  getters: {
    getLoading(state) {
      return state.loading;
    },
  },
});

export function fetchBase(store) {
  return [
    [() => store.dispatch('features/fetch'), () => store.dispatch('fetchUser')],
    [() => {}, () => {}],
  ];
}

export function fetchMembers(store, groupname) {
  return [
    [() => store.dispatch('accessGroup/fetchMembers', groupname)],
    [(data) => {}],
  ];
}

export function fetchProfile(store) {
  return Promise.all([
    store.dispatch('userV2/fetchProfile'),
    store.dispatch('userV2/fetchInvitations'),
    store.dispatch('userV2/fetchRequests'),
  ]);
}

export function fetchAccessGroup(store, groupname) {
  return [
    [() => store.dispatch('accessGroup/fetchGroup', groupname)],
    [(data) => {}],
  ];
}
export function fetchAccessGroups(store) {
  return [[() => store.dispatch('accessGroups/fetchList')], [(data) => {}]];
}
export function fetchTerms(store) {
  return [[() => store.dispatch('accessGroup/fetchTerms')], [(data) => {}]];
}

export function fetchInvitationsAndRequests(store) {
  return [
    [
      () => store.dispatch('accessGroup/fetchInvitations'),
      () => store.dispatch('accessGroup/fetchRequests'),
    ],
    [(data) => {}, (data) => {}],
  ];
}

export async function resolvePromisesSerially(promises, resolvers) {
  try {
    for (let i = 0, len = promises.length; i < len; i += 1) {
      resolvers[i](await promises[i]());
    }
  } catch (e) {
    console.error(e.message);
    throw new Error(e.message);
  }
}
