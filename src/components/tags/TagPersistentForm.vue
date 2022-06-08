<script setup lang="ts">
import { computed } from "vue";
import { useTagsStore } from "stores/tags";
import { StateTagUserInput } from "stores/types";
import {
  useFormMultiState,
  isStatusPending,
} from "src/composables/useFormMultiState";
import { useWatchMultiState } from "src/composables/useWatchMultiState";

const props = defineProps<{ tagId?: string }>();
const createSymbol = Symbol("create");
const currentTagId = computed(() => {
  return props.tagId == null ? createSymbol : props.tagId;
});

const tagsStore = useTagsStore();

const { states, addState, onSubmit } = useFormMultiState<StateTagUserInput>(
  (tagId) => ({
    name: typeof tagId === "string" ? tagsStore.tags[tagId].name : "",
  }),
  async (tagId) => {
    if (typeof tagId === "string") {
      await tagsStore.update(tagId, states[tagId].values);
    } else {
      await tagsStore.create(states[tagId].values);
      states[tagId].values.name = "";
    }
    return typeof tagId === "string"
      ? `Successfully edited.`
      : `Successfully created.`;
  }
);
useWatchMultiState(currentTagId, addState);

const currentState = computed(() => {
  return states[currentTagId.value];
});

const loading = computed(() => isStatusPending(currentState.value.status));
</script>

<template>
  <q-form @submit="() => onSubmit(currentTagId)">
    <q-input
      filled
      v-model="currentState.values.name"
      label="Tag"
      :loading="loading"
      :readonly="loading"
      lazy-rules="ondemand"
      :rules="[
        (val) => !!val || 'Field is required',
        (val) => val.length < 64 || 'Please use less than 64 characters',
      ]"
    >
      <template v-slot:prepend>
        <q-icon name="r_sell" />
      </template>
    </q-input>
    <p v-if="currentState.error">{{ currentState.error }}</p>
    <span v-for="(value, key) in currentState.success" :key="key">
      <p>{{ value }}</p>
    </span>
    <q-btn
      :label="typeof tagId === 'string' ? 'Submit' : 'Create new tag'"
      type="submit"
      color="primary"
      :loading="loading"
    />
  </q-form>
</template>
