<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useTagsStore } from "src/stores/tags";
import { useFlashcardsStore } from "src/stores/flashcards";
import MemoriesListItem from "src/components/MemoriesListItem.vue";
import NewFlashcardForm from "src/components/NewFlashcardForm.vue";
import LeftRightPage from "src/components/LeftRightPage.vue";

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

const displayStatus = ref<"LEFT" | "RIGHT">("LEFT");

function setDisplayStatus(value: "LEFT" | "RIGHT") {
  displayStatus.value = value;
}

function onClickListItem(flashcardId: string) {
  selectedFlashcardId.value = flashcardId;
  setDisplayStatus("RIGHT");
}

function onClickCreateFlashcard() {
  selectedFlashcardId.value = undefined;
  setDisplayStatus("RIGHT");
}
</script>

<template>
  <LeftRightPage
    :displayStatus="displayStatus"
    :setDisplayStatus="setDisplayStatus"
  >
    <template #left>
      <div class="top-line">
        <q-input
          class="search-input"
          v-model="searchTerm"
          label="Search Memories"
          outlined
          dense
        />
        <q-btn
          round
          color="primary"
          icon="r_note_add"
          @click="onClickCreateFlashcard"
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
        <MemoriesListItem
          v-for="flashcardId in results"
          :id="flashcardId"
          :key="flashcardId"
          :onClick="onClickListItem"
        ></MemoriesListItem>
      </q-list>
    </template>
    <template #right>
      <NewFlashcardForm
        :id="selectedFlashcardId"
        class="new-flashcard-form-class"
      />
    </template>
  </LeftRightPage>
</template>

<style scoped>
.selected-chip {
  background-color: var(--q-secondary);
}

.item-list {
  margin-top: 16px;
}

.top-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
}

@media screen and (min-width: 768px) {
  .new-flashcard-form-class {
    min-width: 512px;
  }
}

.search-input {
  flex-grow: 1;
  margin-right: 8px;
}
</style>
