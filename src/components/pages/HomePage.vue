<script setup lang="ts">
import { computed } from "vue";
import { useTagsStore } from "src/stores/tags";
import { useFlashcardsStore } from "src/stores/flashcards";
import ChoosingReviewEntity from "src/components/learning/ChoosingReviewEntity.vue";

const tagsStore = useTagsStore();
const flashcardsStore = useFlashcardsStore();

const large = computed(() =>
  tagsStore.tagIds
    .filter((tagId) => flashcardsStore.tagSizes[tagId] > 50)
    .sort((tagA, tagB) =>
      tagsStore.tags[tagA].name > tagsStore.tags[tagB].name ? 1 : -1
    )
);

const medium = computed(() =>
  tagsStore.tagIds
    .filter((tagId) => flashcardsStore.tagSizes[tagId] > 10)
    .filter((tagId) => !large.value.includes(tagId))
    .sort((tagA, tagB) =>
      tagsStore.tags[tagA].name > tagsStore.tags[tagB].name ? 1 : -1
    )
);

const small = computed(() =>
  tagsStore.tagIds
    .filter(
      (tagId) => !large.value.includes(tagId) && !medium.value.includes(tagId)
    )
    .sort((tagA, tagB) =>
      tagsStore.tags[tagA].name > tagsStore.tags[tagB].name ? 1 : -1
    )
);
</script>

<template>
  <q-list bordered separator>
    <q-item-label header>Large</q-item-label>
    <ChoosingReviewEntity v-for="tagId in large" :key="tagId" :tagId="tagId" />
    <q-item-label header>Medium</q-item-label>
    <ChoosingReviewEntity v-for="tagId in medium" :key="tagId" :tagId="tagId" />
    <q-item-label header>Small</q-item-label>
    <ChoosingReviewEntity v-for="tagId in small" :key="tagId" :tagId="tagId" />
  </q-list>
</template>
