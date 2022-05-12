<script setup>
import { ref } from "vue";

const expanded = ref(false);
</script>

<template>
  <q-card flat bordered>
    <q-card-section>This is the front</q-card-section>

    <q-slide-transition>
      <div v-show="!expanded">
        <q-card-actions>
          <q-space />

          <q-btn
            color="grey"
            round
            flat
            dense
            :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="expanded = !expanded"
          />
        </q-card-actions>
      </div>
    </q-slide-transition>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator></q-separator>
        <q-card-section>
          The back.
          <q-space></q-space>
        </q-card-section>
        <q-card-actions>
          <q-btn flat round color="dark" icon="edit"></q-btn>
          <q-btn flat round color="dark" icon="delete"></q-btn>
          <q-space></q-space>
          <q-btn flat round color="dark" icon="thumb_down"></q-btn>
          <q-btn flat round color="dark" icon="thumb_up"></q-btn>
        </q-card-actions>
      </div>
    </q-slide-transition>
  </q-card>
</template>
