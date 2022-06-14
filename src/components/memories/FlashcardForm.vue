<script setup lang="ts">
import { reactive, computed, watch } from "vue";
import { useTagsStore } from "stores/tags";
import { useFlashcardsStore } from "stores/flashcards";
import { StateFlashcardUserInput } from "stores/types";

const props = defineProps<{ id?: string }>();

const tagsStore = useTagsStore();
const flashcardsStore = useFlashcardsStore();

const createSymbol = Symbol("create");
type StatesKey = symbol | string;

interface StatesEntity {
  form: StateFlashcardUserInput;
  pending: null | "PENDING" | "COMPLETE";
  success: Record<string, string>;
  error: null | string;
}

// TODO: Set this as a Partial with StatesKey being typeof createSymbol
const states = reactive<Record<StatesKey, StatesEntity>>({});

function addState(flashcardId: StatesKey) {
  if (states[flashcardId] == null) {
    if (typeof flashcardId === "string") {
      states[flashcardId] = {
        form: {
          front: flashcardsStore.flashcards[flashcardId].front,
          back: flashcardsStore.flashcards[flashcardId].back,
          tags: flashcardsStore.flashcards[flashcardId].tags,
        },
        pending: null,
        success: {},
        error: null,
      };
    } else {
      states[flashcardId] = {
        form: {
          front: "",
          back: "",
          tags: [],
        },
        pending: null,
        success: {},
        error: null,
      };
    }
  }
}
const currentFlashcardId = computed(() => {
  return props.id == null ? createSymbol : props.id;
});
addState(currentFlashcardId.value); // setting state on initial render
watch(currentFlashcardId, (flashcarId) => {
  addState(flashcarId); // setting state when the current flashcard id changes
});

const tagOptions = computed(() => {
  return [...tagsStore.formOptions].sort((a, b) =>
    a.label > b.label ? 1 : -1
  );
});

function isExistingFlashcard(flashcardId: StatesKey): flashcardId is string {
  return typeof flashcardId === "string";
}

const regular = async (flashcardId: StatesKey) => {
  const exists = isExistingFlashcard(flashcardId);
  if (exists) {
    await flashcardsStore.update(flashcardId, states[flashcardId].form);
  } else {
    await flashcardsStore.create(states[flashcardId].form);
  }
  const timeoutId = String(
    setTimeout(() => {
      delete states[flashcardId].success[timeoutId];
    }, 3000)
  );

  states[flashcardId].success[timeoutId] = exists
    ? `Successfully edited.`
    : `Successfully created.`;
};

function isPending(state: StatesEntity) {
  return state.pending === "PENDING";
}

const onSubmit = async () => {
  const flashcardId = currentFlashcardId.value;
  if (!isPending(states[flashcardId])) {
    states[flashcardId].pending = "PENDING";
    states[flashcardId].error = null;
    try {
      await regular(flashcardId);
      if (flashcardId === createSymbol) {
        /*
           When adding a new flashcard, I want to clear the
           front and back of the flashcard after a successful
           submission. However, I want to keep the selected tags
           the same.

           When a user is creating many flashcards at once, they
           will not want the front and back to persist for the next
           flashcard. But 9 times out of 10, the user will want the
           tags to be the same because they are reading through some
           documentation and creating many flashcards for the same
           subject.
         */
        states[flashcardId].form.front = "";
        states[flashcardId].form.back = "";
      }
    } catch (e) {
      console.error(
        `An error occured when submitting a create/edit flashcard: ${e}`
      );
      states[flashcardId].error = "Error!!"; // TODO: better error message
    }
    states[flashcardId].pending = "COMPLETE"; // TODO: what should I do when the submission is complete?
  }
};

const currentFormState = computed(() => {
  return states[currentFlashcardId.value];
});
</script>

<template>
  <q-form class="container-flashcard-form" @submit="onSubmit">
    <q-option-group
      v-model="currentFormState.form.tags"
      type="checkbox"
      inline
      dense
      :options="tagOptions"
      class="option-group"
    >
    </q-option-group>
    <q-input
      filled
      v-model="currentFormState.form.front"
      type="textarea"
      label="Front"
      :loading="isPending(currentFormState)"
      :readonly="isPending(currentFormState)"
      lazy-rules="ondemand"
      :rules="[(val) => !!val || 'Field is required']"
    >
    </q-input>
    <q-input
      filled
      v-model="currentFormState.form.back"
      type="textarea"
      label="Back"
      :loading="isPending(currentFormState)"
      :readonly="isPending(currentFormState)"
      lazy-rules="ondemand"
      :rules="[(val) => !!val || 'Field is required']"
    >
    </q-input>
    <p v-if="currentFormState.error">{{ currentFormState.error }}</p>
    <span v-for="(value, key) in currentFormState.success" :key="key">
      <p>{{ value }}</p>
    </span>
    <div class="row q-gutter-sm">
      <q-space></q-space>
      <q-btn
        color="primary"
        :loading="isPending(currentFormState)"
        :label="typeof currentFlashcardId === 'string' ? 'Save' : 'Add'"
        :icon-right="
          typeof currentFlashcardId === 'string' ? 'r_save' : 'r_add'
        "
        type="submit"
      />
    </div>
  </q-form>
</template>

<style scoped>
.container-flashcard-form {
  max-width: 768px;
}
.option-group {
  margin-bottom: 16px;
}
</style>
