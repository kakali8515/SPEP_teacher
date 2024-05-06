import { reactive, readonly } from 'vue';

const state = reactive({});

const mutations = {
    remove() {
        state.value = null;
    },
}

const getters = {
    getState(routeName) {
        return state[routeName] ?? null;
    },
    getQueryString(routeName) {
        return state[routeName]?.queryString ?? null;
    },
    getAllState() {
        return state ?? null;
    }
}

const setters = {
    setState(routeName, option) {
        state[routeName] = mergeObject(state[routeName], option);
    },
    setQueryString(routeName, option) {
        state[routeName] ||= { queryString: {} };
        Object.assign(state[routeName].queryString, option);
    },
    resetQueryString(routeName) {
        state[routeName] ||= { queryString: {} };
        state[routeName].queryString = { page: 1, limit: 8 };
    },
}

/**
 * This function will accept the two objects as arguments and return the object of deeply 
 * merged with nested properties.
 * @param {object} targetObject objects containing the properties to be merged with source.
 * @param {object} sourceObject objects containing the properties you want to apply.
 * @return {object} return the deeply merged objects
 */
function mergeObject(targetObject = {}, sourceObject = {}) {
    // clone the source and target objects to avoid the mutation
    const copyTargetObject = JSON.parse(JSON.stringify(targetObject));
    const copySourceObject = JSON.parse(JSON.stringify(sourceObject));
    // Iterating through all the keys of source object
    Object.keys(copySourceObject).forEach((key) => {
      if (!!copySourceObject[key] && typeof copySourceObject[key] === "object" && !Array.isArray(copySourceObject[key])) {
        // If property has nested object, call the function recursively
        copyTargetObject[key] = mergeObject(
          copyTargetObject[key],
          copySourceObject[key]
        );
      } else {
        // else merge the object source to target
        copyTargetObject[key] = copySourceObject[key];
      }
    });
  
    return copyTargetObject;
}

export default {
    state: readonly(state),
    mutations,
    getters,
    setters,
};