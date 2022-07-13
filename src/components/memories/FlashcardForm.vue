<script setup lang="ts">
import { computed, reactive } from "vue";
import { useTagsStore } from "stores/tags";
import { useFlashcardsStore } from "stores/flashcards";
import {
  useAsyncStatus,
  isStatusPending,
} from "src/composables/useAsyncStatus";

/*
  For now, I don't really want to have this form dynamically be able
  to change to different tags for now because I would have to handle
  what to do what to do when in a pending state.
*/
const props = defineProps<{ initialFlashcardId?: string }>();
// eslint-disable-next-line vue/no-setup-props-destructure
const flashcardId = props.initialFlashcardId;

const tagsStore = useTagsStore();
const flashcardsStore = useFlashcardsStore();

const values = reactive({
  front:
    typeof flashcardId === "string"
      ? flashcardsStore.flashcards[flashcardId].front
      : "",
  back:
    typeof flashcardId === "string"
      ? flashcardsStore.flashcards[flashcardId].back
      : "",
  tags:
    typeof flashcardId === "string"
      ? flashcardsStore.flashcards[flashcardId].tags
      : [],
});

const submitState = useAsyncStatus(async () => {
  if (typeof flashcardId === "string") {
    await flashcardsStore.update(flashcardId, values);
  } else {
    await flashcardsStore.create(values);

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
    values.front = "";
    values.back = "";
    values.tags = [];
  }
});
const deleteState = useAsyncStatus(async () => {
  if (flashcardId) {
    await flashcardsStore.delete(flashcardId);
  }
});

const submitPending = computed(() => isStatusPending(submitState.status.value));
const deletePending = computed(() => isStatusPending(deleteState.status.value));
const pending = computed(() => {
  return submitPending.value || deletePending.value;
});

const tagOptions = computed(() => {
  return [...tagsStore.formOptions].sort((a, b) =>
    a.label > b.label ? 1 : -1
  );
});
</script>

<template>
  <q-form @submit="submitState.wrapper">
    <q-option-group
      v-model="values.tags"
      type="checkbox"
      inline
      dense
      :options="tagOptions"
      class="option-group"
    >
    </q-option-group>
    <q-input
      filled
      v-model="values.front"
      type="textarea"
      label="Front"
      :loading="pending"
      :readonly="pending"
      lazy-rules="ondemand"
      :rules="[(val) => !!val || 'Field is required']"
    >
    </q-input>
    <q-input
      filled
      v-model="values.back"
      type="textarea"
      label="Back"
      :loading="pending"
      :readonly="pending"
      lazy-rules="ondemand"
      :rules="[(val) => !!val || 'Field is required']"
    >
    </q-input>
    <!--  -->
    <p v-if="submitState.error.value">{{ submitState.error }}</p>
    <div class="row q-gutter-sm">
      <q-space></q-space>
      <q-btn
        v-if="typeof flashcardId === 'string' && !submitPending"
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
        :label="typeof flashcardId === 'string' ? 'Save' : 'Add'"
        :icon-right="typeof flashcardId === 'string' ? 'r_save' : 'r_add'"
        type="submit"
      />
    </div>
  </q-form>
</template>
