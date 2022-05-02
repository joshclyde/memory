<script setup lang="ts">
import { useTagsStore } from "src/stores/tags";
import ReviewCardVue from "src/components/ReviewCard.vue";

const tagsStore = useTagsStore();
</script>

<template>
  <h4>Review</h4>
  <ReviewCardVue
    v-for="tagId in tagsStore.tagIds"
    :key="tagId"
    :tag-id="tagId"
  ></ReviewCardVue>
</template>
