<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useFlashcardsStore } from "src/stores/flashcards";

const route = useRoute();
const flashcardsStore = useFlashcardsStore();
const flashcardIds = flashcardsStore.getIdsByTagId(
  route.params.tagId as string
);

const currentIndex = ref(0);
const isFront = ref(true);

function flip() {
  isFront.value = !isFront.value;
}

function increment() {
  currentIndex.value += 1;
  isFront.value = true;
}
function decrement() {
  currentIndex.value -= 1;
  isFront.value = true;
}

const count = computed(() => flashcardIds.length);
const textCurrentFlashcard = computed(
  () => `${currentIndex.value + 1} / ${count.value}`
);

const currentFlashcard = computed(() => {
  return flashcardsStore.flashcards[flashcardIds[currentIndex.value]];
});
</script>

<template>
  <p>{{ textCurrentFlashcard }}</p>
  <q-card class="q-my-md q-pa-md card">
    <h6>{{ isFront ? "Front" : "Back" }}</h6>
    {{ isFront ? currentFlashcard.front : currentFlashcard.back }}
  </q-card>
  <div class="button-container">
    <q-btn v-if="currentIndex > 0" class="previous-button" @click="decrement"
      >Previous</q-btn
    >
    <q-btn class="flip-button" @click="flip">Flip</q-btn>
    <q-btn
      v-if="currentIndex + 1 < count"
      class="next-button"
      @click="increment"
    >
      Next
    </q-btn>
    <q-btn v-if="!(currentIndex + 1 < count)" class="next-button" to="/">
      Finish
    </q-btn>
  </div>
</template>

<style scoped>
.button-container {
  display: grid;
  grid-template-columns: [first] 128px [middle] 1fr [last] 128px;
  gap: 16px;
}

.previous-button {
  grid-column: 1;
}

.flip-button {
  grid-column: 2;
}

.next-button {
  grid-column: 3;
}

.card {
  min-height: 256px;
  white-space: pre-line;
}
</style>
