<script setup lang="ts">
import { useTagsStore } from "src/stores/tags";
import { useFlashcardsStore } from "src/stores/flashcards";
import { reactive, computed } from "vue";
import FlashcardListItemVue from "src/components/FlashcardListItem.vue";

const tagStore = useTagsStore();
const flashcardsStore = useFlashcardsStore();
const chipModel = reactive(tagStore.mapWithKeyValue(false));

const selectedFlashcards = computed(() => {
  return flashcardsStore.filterByTag(
    Object.keys(chipModel).filter((chipKey) => chipModel[chipKey])
  );
});
</script>

<template>
  <h1>Edit Flashcard</h1>
  <div>
    <q-chip
      v-for="item in tagStore.formOptions"
      :key="item.value"
      v-model:selected="chipModel[item.value]"
      :class="{ 'selected-chip': chipModel[item.value] }"
      :text-color="chipModel[item.value] ? 'white' : undefined"
    >
      {{ item.label }}
    </q-chip>
    <q-list class="item-list" bordered separator>
      <FlashcardListItemVue
        v-for="item in selectedFlashcards"
        :key="item"
        :id="item"
      >
        {{ item }}
      </FlashcardListItemVue>
    </q-list>
  </div>
</template>

<style scoped>
.selected-chip {
  background-color: var(--q-secondary);
}

.item-list {
  margin-top: 16px;
}
</style>
