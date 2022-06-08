import { Ref, watch } from "vue";
import { MultiStateKey } from "src/composables/useMultiState";

export const useWatchMultiState = (
  currentKey: Ref<MultiStateKey>,
  addState: (key: MultiStateKey) => void
) => {
  addState(currentKey.value); // setting state on initial render
  watch(currentKey, (key) => {
    addState(key); // setting state when the current flashcard id changes
  });
};
