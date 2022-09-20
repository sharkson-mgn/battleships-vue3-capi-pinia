<template>
  <div class="field-row" :key="y">
    <FieldSquare v-for="x in 10" :y="y" :x="x" :key="x" :player=player />
  </div>
</template>

<script setup>
import FieldSquare from "./FieldSquare.vue";

defineProps(['player','y']);

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
