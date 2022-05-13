<script setup lang="ts">
import LearnCard from "src/components/LearnCard.vue";

import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tagId = computed(() => route.params.tagId as string);
</script>

<template>
  <LearnCard :tagId="tagId"> </LearnCard>
</template>
