<script setup lang="ts">
import TagForm from "src/components/TagForm.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tagId = route.params.tagId as string;
</script>

<template>
  <h1>Edit Tag</h1>
  <TagForm :id="tagId"></TagForm>
</template>
