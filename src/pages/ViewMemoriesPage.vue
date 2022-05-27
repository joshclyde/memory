<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useTagsStore } from "src/stores/tags";
import { useFlashcardsStore } from "src/stores/flashcards";
import ViewMemoriesListItem from "src/components/ViewMemoriesListItem.vue";
import NewFlashcardForm from "src/components/NewFlashcardForm.vue";

const tagStore = useTagsStore();
const flashcardsStore = useFlashcardsStore();
const chipModel = reactive(tagStore.mapWithKeyValue(false));

const sortedTags = computed(() => {
  return [...tagStore.formOptions].sort((a, b) => (a.label > b.label ? 1 : -1));
});

const searchTerm = ref("");

const selectedChips = computed(() => {
  const selected: Array<string> = [];
  Object.keys(chipModel).forEach((chipKey) => {
    if (chipModel[chipKey]) {
      selected.push(chipKey);
    }
  });
  return selected;
});

const results = computed(() => {
  const retValue: Array<string> = [];
  Object.entries(flashcardsStore.flashcards).forEach(
    ([flashcardId, flashcard]) => {
      if (
        selectedChips.value.length &&
        !flashcard.tags.some((value) => selectedChips.value.includes(value))
      ) {
        return;
      }
      if (
        searchTerm.value &&
        ![flashcard.front, flashcard.back].some((value) =>
          value.includes(searchTerm.value)
        )
      ) {
        return;
      }
      retValue.push(flashcardId);
    }
  );
  return retValue;
});

const selectedFlashcardId = ref<string | undefined>();

function onClickListItem(flashcardId: string) {
  selectedFlashcardId.value = flashcardId;
}

function onClickCreateFlashcard() {
  selectedFlashcardId.value = undefined;
}
</script>

<template>
  <div class="container-view-memories-page">
    <div class="search-container">
      <div class="top-line">
        <q-input
          class="search-input"
          v-model="searchTerm"
          label="Search Memories"
          outlined
          dense
        />
        <q-btn
          outline
          flat
          round
          color="primary"
          icon="r_note_add"
          :onClick="onClickCreateFlashcard"
        />
      </div>
      <q-chip
        v-for="item in sortedTags"
        :key="item.value"
        v-model:selected="chipModel[item.value]"
        :class="{ 'selected-chip': chipModel[item.value] }"
        :text-color="chipModel[item.value] ? 'white' : undefined"
        dense
        square
      >
        {{ item.label }}
      </q-chip>
      <!-- TODO: don't have this be as long. slowing down page for sure -->
      <q-list class="item-list" bordered separator>
        <ViewMemoriesListItem
          v-for="flashcardId in results"
          :id="flashcardId"
          :key="flashcardId"
          :onClick="onClickListItem"
        ></ViewMemoriesListItem>
      </q-list>
    </div>
    <NewFlashcardForm :id="selectedFlashcardId" class="new-flashcard-form" />
  </div>
</template>

<style scoped>
.container-view-memories-page {
  display: flex;
  flex-direction: row;
}

.search-container {
  max-width: 512px;
  margin-left: 32px;
  margin-right: 32px;
}

.new-flashcard-form {
  min-width: 512px;
  margin-right: 32px;
}

.selected-chip {
  background-color: var(--q-secondary);
}

.item-list {
  margin-top: 16px;
}

.top-line {
  display: flex;
  flex-direction: row;
}

.search-input {
  flex-grow: 1;
  margin-right: 8px;
}
</style>
