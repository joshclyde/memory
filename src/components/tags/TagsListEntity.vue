<script lang="ts" setup>
import { computed } from "vue";
import { useTagsStore } from "src/stores/tags";
import { getLastModifiedMessage } from "src/utils/time";

const props = defineProps<{
  tagId: string;
  onClick: (tagId: string) => void;
}>();
const tagsStore = useTagsStore();
const tag = computed(() => {
  return tagsStore.getTagById(props.tagId);
});

const label = computed(() => {
  return getLastModifiedMessage(new Date(tag.value.lastModified));
});
</script>

<template>
  <q-item clickable @click="() => props.onClick(props.tagId)">
    <q-item-section>
      <q-item-label>{{ tag.name }}</q-item-label>
      <q-item-label caption> Last Modified: {{ label }} </q-item-label>
    </q-item-section>
  </q-item>
</template>
