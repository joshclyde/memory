import { reactive } from "vue";

export type MultiStateKey = string | symbol;

export const useMultiState = <Entity>(
  createEntityState: (key: MultiStateKey) => Entity
) => {
  const states: Record<MultiStateKey, Entity> = reactive({});

  function addState(key: MultiStateKey) {
    if (states[key] == null) {
      states[key] = createEntityState(key);
    }
  }
  return { states, addState };
};
