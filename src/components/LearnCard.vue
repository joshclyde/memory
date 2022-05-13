<!-- 

This currently goes through all flashcards that have a specifc tagId.

Things to improve.
• Going between flashcards can be jumpy
• Front of next flashcard doesn't appear until animation finishes
  but the index of what flashcard I'm on changes immediately.
• Last flashcard abrubtly dissapears and finish message appears

Potential ways to improve
• Don't have an animation that changes the height when viewing the
  back of the flashcard.

-->

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFlashcardsStore } from "src/stores/flashcards";

const expanded = ref(false);
const props = defineProps<{ tagId: string }>();

const flashcardsStore = useFlashcardsStore();
const flashcardIds = flashcardsStore.getIdsByTagId(props.tagId);

const currentIndex = ref(0);

function thumbsDown() {
  expanded.value = false;
  currentIndex.value += 1;
}

function thumbsUp() {
  expanded.value = false;
  currentIndex.value += 1;
}

const finished = computed(() => !flashcardIds[currentIndex.value]);
const count = computed(() => flashcardIds.length);
const textCurrentFlashcard = computed(
  () => `${currentIndex.value + 1} / ${count.value}`
);

const flashcardId = computed(() => flashcardIds[currentIndex.value]);

const flashcard = computed(() => flashcardsStore.flashcards[flashcardId.value]);
const front = ref(flashcard.value.front);
const back = ref(flashcard.value.back);

function postHide() {
  front.value = flashcardsStore.flashcards[flashcardId.value].front;
  back.value = flashcardsStore.flashcards[flashcardId.value].back;
}
</script>

<template>
  <div v-if="finished">You finished!</div>
  <template v-else>
    <p>{{ textCurrentFlashcard }}</p>
    <q-card flat bordered>
      <q-card-section>{{ front }}</q-card-section>

      <q-slide-transition>
        <div v-show="!expanded">
          <q-card-actions>
            <q-space />

            <q-btn
              color="grey"
              round
              flat
              dense
              :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="expanded = !expanded"
            />
          </q-card-actions>
        </div>
      </q-slide-transition>

      <q-slide-transition @hide="postHide">
        <div v-show="expanded">
          <q-separator></q-separator>
          <q-card-section>
            {{ back }}
            <q-space></q-space>
          </q-card-section>
          <q-card-actions>
            <q-btn flat round color="dark" icon="edit"></q-btn>
            <q-btn flat round color="dark" icon="delete"></q-btn>
            <q-space></q-space>
            <q-btn
              flat
              round
              color="negative"
              icon="thumb_down"
              @click="thumbsDown"
            ></q-btn>
            <q-btn
              flat
              round
              color="positive"
              icon="thumb_up"
              @click="thumbsUp"
            ></q-btn>
          </q-card-actions>
        </div>
      </q-slide-transition>
    </q-card>
  </template>
</template>
