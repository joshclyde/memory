<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string;
  onClickIcon: () => void;
  icon: string;
  label: string;
}>();
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const searchTerm = computed({
  get() {
    return props.modelValue;
  },
  set(value: string) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <div class="top-line">
    <q-input
      class="search-input"
      v-model="searchTerm"
      :label="label"
      outlined
      dense
    />
    <q-btn round color="primary" :icon="icon" @click="onClickIcon" />
  </div>
</template>

<style scoped>
.top-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
}
.search-input {
  flex-grow: 1;
  margin-right: 8px;
}
</style>
