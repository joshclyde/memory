<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { useFlashcardsStore } from "src/stores/flashcards";
import { useTagsStore } from "src/stores/tags";

const props = defineProps<{ id: string }>();
const flashcardsStore = useFlashcardsStore();
const tagsStore = useTagsStore();

const flashcard = computed(() => {
  return flashcardsStore.flashcards[props.id];
});
const captionText = computed(() => {
  return Object.keys(tagsStore.tags)
    .filter((tagId) => flashcard.value.tags.includes(tagId))
    .reduce(
      (value, tagId) =>
        value
          ? `${value}, ${tagsStore.tags[tagId].name}`
          : tagsStore.tags[tagId].name,
      ""
    );
});
</script>

<template>
  <q-item :to="`/flashcard/edit/${props.id}`">
    <q-item-section>
      <q-item-label>{{ flashcard.front }}</q-item-label>
      <q-item-label caption>
        <q-icon name="sell"></q-icon>
        {{ captionText }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
