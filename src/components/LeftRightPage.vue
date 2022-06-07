<script setup lang="ts">
import { computed } from "vue";

/*
  LEFT  = only the left component is shown
  RIGHT = only the right component is shown, as well as a back
          button 

  If the width of the screen is greater than or equal to 768px,
  then both the left and the right component will be shown
  regardless of the value of displayStatus. Also, the back button
  will not be displayed.
*/
const props = defineProps<{
  displayStatus: "LEFT" | "RIGHT";
  setDisplayStatus: (displayStatus: "LEFT" | "RIGHT") => void;
}>();

const isLeft = computed(() => props.displayStatus === "LEFT");
const isRight = computed(() => props.displayStatus === "RIGHT");
</script>

<template>
  <div class="container-responsive-page">
    <div class="container-left-side">
      <slot name="left"></slot>
    </div>
    <div class="container-right-side">
      <q-btn
        padding="none"
        flat
        round
        color="primary"
        icon="r_arrow_back"
        class="back-button"
        @click="() => setDisplayStatus('LEFT')"
      ></q-btn>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped>
.container-responsive-page {
  display: flex;
  flex-direction: row;
}

.container-left-side {
  display: v-bind('isLeft ? undefined: "none"');
}

.container-right-side {
  display: v-bind('isRight ? undefined : "none"');
}

.back-button {
  margin-bottom: 8px;
}

@media screen and (min-width: 768px) {
  .container-left-side {
    display: initial;
    margin-right: 32px;
  }
  .container-right-side {
    display: initial;
  }

  .back-button {
    display: none;
  }
}
</style>
