<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { useFlashcardsStore } from "src/stores/flashcards";
import { useTagsStore } from "src/stores/tags";
import { editFlashcardByIdUrl } from "src/utils/url";

const props = defineProps<{ id: string }>();
const flashcardsStore = useFlashcardsStore();
const tagsStore = useTagsStore();

const flashcard = computed(() => {
  return flashcardsStore.flashcards[props.id];
});

const tags = computed(() => {
  return Object.entries(tagsStore.tags).filter(([tagId]) =>
    flashcard.value.tags.includes(tagId)
  );
});
</script>

<template>
  <q-item :to="editFlashcardByIdUrl(props.id)">
    <q-item-section>
      <q-item-label>{{ flashcard.front }}</q-item-label>
      <q-item-label caption>
        <template v-for="(item, index) in tags" :key="item[0]">
          <q-icon name="r_sell"></q-icon>
          {{ `${item[1].name}${index + 1 < tags.length ? " " : ""}` }}
        </template>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
