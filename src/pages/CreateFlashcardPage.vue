<template>
  <h4>Create Flashcard</h4>
  <q-form @submit="onSubmit">
    <q-option-group v-model="tags" type="checkbox" :options="tagFormOptions">
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

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useTagsStore } from "stores/tags";
import { useFlashcardsStore } from "stores/flashcards";

const tagsStore = useTagsStore();
const tagFormOptions = tagsStore.formOptions;
const flashcardsStore = useFlashcardsStore();
const tags = ref<Array<string>>([]);
const state = reactive<{
  front: string;
  back: string;
  pending: boolean;
  error: null | string;
  success: Record<string, string>;
}>({ front: "", back: "", pending: false, error: null, success: {} });

const regular = async () => {
  await flashcardsStore.create({
    front: state.front,
    back: state.back,
    tags: tags.value,
  });
  const timeoutId = String(
    setTimeout(() => {
      delete state.success[timeoutId];
    }, 3000)
  );
  state.success[timeoutId] = `Successfully created.`;
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
      /*
        I want to clear the contents of the flashcard after a
        successful submission, but the selected tags I want to
        stay the same.
      */
      state.front = "";
      state.back = "";
    } catch (error) {
      console.log(error);
      state.error = "Error happened when submitting.";
    }
    state.pending = false;
  }
};
</script>
