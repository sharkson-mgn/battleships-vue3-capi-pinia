<template>
  <button v-for="(difficulty,index) in game.difficultyList" :key="index" :difficulty="index"
    class="btn btn-sm btn-secondary m-1 d-block mx-auto" @click="setDifficulty">{{ difficulty }}</button>
</template>

<script setup>


const props = defineProps(['game']);

function setDifficulty(event) {
  props.game.setDifficulty(event.target.attributes.difficulty.value)
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
