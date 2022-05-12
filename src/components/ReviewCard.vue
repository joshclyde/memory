<script setup lang="ts">
import { computed } from "vue";
import { useTagsStore } from "src/stores/tags";
import { useFlashcardsStore } from "src/stores/flashcards";
import { reviewTagUrl, learnTagUrl, editTagByIdUrl } from "src/utilities/url";

const props = defineProps<{ tagId: string }>();
const tagsStore = useTagsStore();
const flashcardsStore = useFlashcardsStore();

const tag = tagsStore.getTagById(props.tagId);
const count = flashcardsStore.getIdsByTagId(props.tagId).length;
const textCount = computed(() => {
  if (count === 0) {
    return `0 flashcards`;
  }
  if (count === 1) {
    return `1 flashcard`;
  }
  return `${count} flashcards`;
});
</script>

<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">
        {{ tag.name }}
      </div>
      <div>{{ textCount }}</div>
    </q-card-section>
    <q-separator />
    <q-card-actions>
      <q-btn flat :to="reviewTagUrl(props.tagId)">Review</q-btn>
      <q-btn flat :to="learnTagUrl(props.tagId)">Learn</q-btn>
      <q-btn flat :to="editTagByIdUrl(props.tagId)">Edit</q-btn>
    </q-card-actions>
  </q-card>
</template>
