<script setup lang="ts">
import TagsListEntity from "./TagsListEntity.vue";

defineProps<{ tagIds: Array<string>; onClickTag: (tagId: string) => void }>();
</script>

<template>
  <q-list bordered separator>
    <TagsListEntity
      v-for="tagId in tagIds"
      :tagId="tagId"
      :key="tagId"
      :onClick="onClickTag"
    ></TagsListEntity>
  </q-list>
</template>
