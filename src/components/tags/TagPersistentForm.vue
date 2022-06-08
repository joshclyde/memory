<script setup lang="ts">
import { reactive, watch } from "vue";

import TagForm from "./TagForm.vue";

const props = defineProps<{ tagId?: string }>();
const tags = reactive(props.tagId ? { [props.tagId]: true } : {});

watch(
  () => props.tagId,
  () => {
    if (props.tagId) {
      tags[props.tagId] = true;
    }
  }
);
</script>

<template>
  <TagForm :class="$attrs.class" v-show="props.tagId == null" />
  <template v-for="id in Object.keys(tags)" :key="id">
    <TagForm
      :class="$attrs.class"
      v-show="props.tagId === id"
      :initialTagId="id"
    />
  </template>
</template>
