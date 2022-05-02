<script setup lang="ts">
import { useTagsStore } from "src/stores/tags";

const props = defineProps<{ tagId: string }>();
const tagsStore = useTagsStore();
const tag = tagsStore.getTagById(props.tagId);
</script>

<template>
  <q-card>
    <q-card-section class="text-h6">
      {{ tag.name }}
    </q-card-section>
    <q-separator dark />
    <q-card-actions>
      <q-btn flat :to="`/review/${props.tagId}`">Start Review</q-btn>
    </q-card-actions>
  </q-card>
</template>
