<script setup lang="ts">
import { reactive, watch } from "vue";

import FlashcardForm from "./FlashcardForm.vue";

const props = defineProps<{ flashcardId?: string }>();
const flashcards = reactive(
  props.flashcardId ? { [props.flashcardId]: true } : {}
);

watch(
  () => props.flashcardId,
  () => {
    if (props.flashcardId) {
      flashcards[props.flashcardId] = true;
    }
  }
);
</script>

<template>
  <FlashcardForm :class="$attrs.class" v-show="props.flashcardId == null" />
  <template v-for="id in Object.keys(flashcards)" :key="id">
    <FlashcardForm
      :class="$attrs.class"
      v-show="props.flashcardId === id"
      :initialFlashcardId="id"
    />
  </template>
</template>
