<script setup lang="ts">
import { useTagsStore } from "src/stores/tags";
import { useFlashcardsStore } from "src/stores/flashcards";
import { learnTagUrl } from "src/utils/url";

defineProps<{ tagId: string }>();

const tagsStore = useTagsStore();
const flashcardsStore = useFlashcardsStore();
</script>

<template>
  <q-item :to="learnTagUrl(tagId)">
    <q-item-section>
      <q-item-label>{{ tagsStore.tags[tagId].name }}</q-item-label>
      <q-item-label caption>
        {{ flashcardsStore.tagSizes[tagId] }} memories
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
