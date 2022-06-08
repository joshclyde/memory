<script setup lang="ts">
import { computed, reactive } from "vue";
import { useTagsStore } from "stores/tags";
import {
  useAsyncStatus,
  isStatusPending,
} from "src/composables/useAsyncStatus";

/*
  For now, I don't really want to have this form dynamically be able
  to change to different tags for now because I would have to handle
  what to do what to do when in a pending state.
*/
const props = defineProps<{ initialTagId?: string }>();
// eslint-disable-next-line vue/no-setup-props-destructure
const tagId = props.initialTagId;

const tagsStore = useTagsStore();

const values = reactive({
  name: typeof tagId === "string" ? tagsStore.tags[tagId].name : "",
});

const submitState = useAsyncStatus(async () => {
  if (typeof tagId === "string") {
    await tagsStore.update(tagId, values);
  } else {
    await tagsStore.create(values);
    values.name = "";
  }
});
const deleteState = useAsyncStatus(async () => {
  if (tagId) {
    await tagsStore.delete(tagId);
  }
});

const submitPending = computed(() => isStatusPending(submitState.status.value));
const deletePending = computed(() => isStatusPending(deleteState.status.value));
const pending = computed(() => {
  return submitPending.value || deletePending.value;
});
</script>

<template>
  <q-form @submit="submitState.wrapper">
    <q-input
      filled
      v-model="values.name"
      label="Tag"
      :loading="pending"
      :readonly="pending"
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
    <p v-if="submitState.error.value">{{ submitState.error }}</p>
    <div class="row q-gutter-sm">
      <q-space></q-space>
      <q-btn
        v-if="typeof tagId === 'string' && !submitPending"
        color="negative"
        :loading="deletePending"
        label="Delete"
        icon-right="r_delete"
        @click="deleteState.wrapper"
      />
      <q-btn
        v-if="!deletePending"
        color="primary"
        :loading="submitPending"
        :label="typeof tagId === 'string' ? 'Save' : 'Add'"
        :icon-right="typeof tagId === 'string' ? 'r_save' : 'r_add'"
        type="submit"
      />
    </div>
  </q-form>
</template>
