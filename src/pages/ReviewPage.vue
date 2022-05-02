<script setup lang="ts">
import { useTagsStore } from "src/stores/tags";
import ReviewCardVue from "src/components/ReviewCard.vue";

const tagsStore = useTagsStore();
</script>

<template>
  <h1>Review</h1>
  <ReviewCardVue
    v-for="tagId in tagsStore.tagIds"
    :key="tagId"
    :tag-id="tagId"
    class="q-my-md"
  ></ReviewCardVue>
</template>
