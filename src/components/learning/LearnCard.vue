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
import { useReviewsStore } from "src/stores/reviews";
import FlashcardForm from "../memories/FlashcardForm.vue";

const expanded = ref(false);
const props = defineProps<{ tagId: string }>();

const flashcardsStore = useFlashcardsStore();
const flashcardIds = flashcardsStore.getIdsByTagId(props.tagId);

const reviewsStore = useReviewsStore();

const currentIndex = ref(0);

function next() {
  expanded.value = false;
  currentIndex.value += 1;
}

function thumbsDown(memoryId: string) {
  reviewsStore.create({
    memoryId,
    result: "BAD",
  });
  next();
}

function thumbsNeutral() {
  next();
}

function thumbsUp(memoryId: string) {
  reviewsStore.create({
    memoryId,
    result: "GOOD",
  });
  next();
}

function deleteMemory(memoryId: string) {
  flashcardsStore.delete(memoryId);
  next();
}

const count = computed(() => flashcardIds.length);
const textCurrentFlashcard = computed(
  () => `${currentIndex.value + 1} / ${count.value}`
);

const flashcardId = computed(() => flashcardIds[currentIndex.value]);
const finished = computed(() => !flashcardId.value);

const flashcard = computed(() => flashcardsStore.flashcards[flashcardId.value]);
const front = ref(flashcard.value.front);
const back = ref(flashcard.value.back);

function postHide() {
  front.value = flashcardsStore.flashcards[flashcardId.value].front;
  back.value = flashcardsStore.flashcards[flashcardId.value].back;
}

const isEditing = ref(false);
function edit() {
  isEditing.value = true;
}
function finishEdit() {
  isEditing.value = false;
  /*
    If I decide to go to the next flashcard after editing, then make
    sure to call postHide.
  */
}
</script>

<template>
  <div v-if="finished">You finished!</div>
  <div v-else-if="isEditing">
    <q-btn
      padding="none"
      flat
      round
      color="primary"
      icon="r_arrow_back"
      class="back-button"
      @click="finishEdit"
    ></q-btn>
    <FlashcardForm :initialFlashcardId="flashcardId" />
  </div>
  <template v-else>
    <p>{{ textCurrentFlashcard }}</p>
    <q-card flat bordered class="flashcard-text">
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
              :icon="expanded ? 'r_keyboard_arrow_up' : 'r_keyboard_arrow_down'"
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
            <q-btn
              flat
              round
              color="dark"
              icon="r_delete"
              @click="deleteMemory(flashcardId)"
            ></q-btn>
            <q-space></q-space>
            <q-btn flat round color="dark" icon="r_edit" @click="edit"></q-btn>
            <q-btn
              flat
              round
              color="dark"
              icon="r_skip_next"
              @click="thumbsNeutral"
            ></q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="r_thumb_down"
              @click="thumbsDown(flashcardId)"
            ></q-btn>
            <q-btn
              flat
              round
              color="positive"
              icon="r_thumb_up"
              @click="thumbsUp(flashcardId)"
            ></q-btn>
          </q-card-actions>
        </div>
      </q-slide-transition>
    </q-card>
  </template>
</template>

<style scoped>
.flashcard-text {
  white-space: pre-line;
}
</style>
