<script setup lang="ts">
import FlashcardFormVue from "src/components/FlashcardForm.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const flashcardId = route.params.flashcardId as string;
</script>

<template>
  <h1>Edit Flashcard</h1>
  <FlashcardFormVue :id="flashcardId" />
</template>
