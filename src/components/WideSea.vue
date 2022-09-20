<template>
  <div
    :class="[
        'sea',
        player.playerId,
        (player.isCurrent ? 'player-active' : '')
      ]">
    <div class="field-row" v-for="y in 10" :key="y" :y="y">
      <FieldSquare v-for="x in 10" :y="y" :x="x" :key="x" :player=player />
    </div>
  </div>
</template>

<script setup>
import FieldSquare from "./FieldSquare.vue";

defineProps(['player']);

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sea {
  border-radius: 0.3em;
  padding: 0.3em;
  border: 1px transparent solid;
}

.player-active {
  border: 1px red solid;
}
</style>
