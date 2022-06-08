<script setup lang="ts">
import { computed, ref } from "vue";
import { useTagsStore } from "src/stores/tags";
import LeftRightPage from "src/components/LeftRightPage.vue";
import TagPersistentForm from "src/components/tags/TagPersistentForm.vue";
import TagsList from "src/components/tags/TagsList.vue";
import SearchInput from "src/components/SearchInput.vue";

const searchTerm = ref("");

const displayStatus = ref<"LEFT" | "RIGHT">("LEFT");
function setDisplayStatus(value: "LEFT" | "RIGHT") {
  displayStatus.value = value;
}

const selectedTagId = ref<string | undefined>();
function onSetTagId(tagId: string | undefined) {
  selectedTagId.value = tagId;
  setDisplayStatus("RIGHT");
}

const tagsStore = useTagsStore();
const tagIds = computed(() => {
  return Object.entries(tagsStore.tags)
    .filter(([, tag]) => {
      if (
        searchTerm.value &&
        ![tag.name].some((value) => value.includes(searchTerm.value))
      ) {
        return false;
      }
      return true;
    })
    .sort(([, tag1], [, tag2]) => (tag1.name > tag2.name ? 1 : -1))
    .map(([tagId]) => tagId);
});
</script>

<template>
  <LeftRightPage
    :displayStatus="displayStatus"
    :setDisplayStatus="setDisplayStatus"
  >
    <template #left>
      <SearchInput
        :onClickIcon="() => onSetTagId(undefined)"
        icon="r_add"
        v-model="searchTerm"
        label="Search Tags"
      />
      <TagsList :tagIds="tagIds" :onClickTag="onSetTagId" />
    </template>
    <template #right>
      <TagPersistentForm
        :tagId="selectedTagId"
        class="tag-persistent-form-container"
      />
    </template>
  </LeftRightPage>
</template>

<style scoped>
@media screen and (min-width: 768px) {
  .tag-persistent-form-container {
    min-width: 512px;
  }
}
</style>
