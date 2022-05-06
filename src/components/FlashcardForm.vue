<script setup lang="ts">
import { reactive } from "vue";
import { useTagsStore } from "stores/tags";
import { useFlashcardsStore } from "stores/flashcards";

const props = defineProps<{ id?: string }>();

const tagsStore = useTagsStore();
const tagFormOptions = tagsStore.formOptions;
const flashcardsStore = useFlashcardsStore();
const flashcard = props.id && flashcardsStore.flashcards[props.id];

const state = reactive<{
  front: string;
  back: string;
  tags: Array<string>;
  pending: boolean;
  error: null | string;
  success: Record<string, string>;
}>({
  front: !flashcard ? "" : flashcard.front,
  back: !flashcard ? "" : flashcard.back,
  tags: !flashcard ? [] : flashcard.tags,
  pending: false,
  error: null,
  success: {},
});

const regular = async () => {
  if (!props.id) {
    await flashcardsStore.create({
      front: state.front,
      back: state.back,
      tags: state.tags,
    });
  } else {
    await flashcardsStore.update({
      id: props.id,
      front: state.front,
      back: state.back,
      tags: state.tags,
    });
  }
  const timeoutId = String(
    setTimeout(() => {
      delete state.success[timeoutId];
    }, 3000)
  );
  if (!props.id) {
    state.success[timeoutId] = `Successfully created.`;
  } else {
    state.success[timeoutId] = `Successfully edited.`;
  }
};

const longWait = () => {
  const promise = new Promise<void>((resolve) => {
    setTimeout(async () => {
      resolve();
    }, 3000);
  });
  return promise;
};

const onSubmit = async () => {
  if (!state.pending) {
    state.pending = true;
    state.error = null;
    try {
      // await longWait();
      await regular();
      if (!props.id) {
        /*
          Only when adding a new flashcard, I want to clear the
          contents of the flashcard after a successful submission,
          but the selected tags I want to stay the same.
        */
        state.front = "";
        state.back = "";
      }
    } catch (error) {
      console.log(error);
      state.error = "Error happened when submitting.";
    }
    state.pending = false;
  }
};
</script>

<template>
  <q-form @submit="onSubmit">
    <q-option-group
      v-model="state.tags"
      type="checkbox"
      :options="tagFormOptions"
    >
    </q-option-group>
    <q-input
      filled
      v-model="state.front"
      type="textarea"
      label="Front"
      :loading="state.pending"
      :readonly="state.pending"
      lazy-rules="ondemand"
      :rules="[(val) => !!val || 'Field is required']"
    >
    </q-input>
    <q-input
      filled
      v-model="state.back"
      type="textarea"
      label="Back"
      :loading="state.pending"
      :readonly="state.pending"
      lazy-rules="ondemand"
      :rules="[(val) => !!val || 'Field is required']"
    >
    </q-input>
    <p v-if="state.error">{{ state.error }}</p>
    <span v-for="(value, key) in state.success" :key="key">
      <p>{{ value }}</p>
    </span>
    <q-btn
      label="Submit"
      type="submit"
      color="primary"
      :loading="state.pending"
    />
  </q-form>
</template>
