<template>
  <h4>Create Tag</h4>
  <q-form @submit="onSubmit">
    <q-input
      filled
      v-model="state.text"
      label="Tag"
      :loading="state.pending"
      :readonly="state.pending"
      lazy-rules="ondemand"
      :rules="[
        (val) => !!val || 'Field is required',
        (val) => val.length < 64 || 'Please use less than 64 characters',
      ]"
    >
      <template v-slot:prepend>
        <q-icon name="sell" />
      </template>
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
import { reactive } from "vue";
import { useTagsStore } from "stores/tags";

const tagsStore = useTagsStore();
const state = reactive<{
  text: string;
  pending: boolean;
  error: null | string;
  success: Record<string, string>;
}>({ text: "", pending: false, error: null, success: {} });

const regular = async () => {
  await tagsStore.createTag({ name: state.text });
  const timeoutId = String(
    setTimeout(() => {
      delete state.success[timeoutId];
    }, 3000)
  );
  state.success[timeoutId] = `Tag ${state.text} was successfully created.`;
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
      await longWait();
      await regular();
      state.text = "";
    } catch (error) {
      console.log(error);
      state.error = "Error happened when submitting.";
    }
    state.pending = false;
  }
};
</script>
