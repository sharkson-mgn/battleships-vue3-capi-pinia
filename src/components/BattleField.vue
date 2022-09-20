<template>
  <div class="container-flow">
    <div class="row">
      <div class="col sea">
        <h3>{{ game.board.player1.playerId }}</h3>
        <WideSea :player="game.board.player1" />
      </div>
      <div class="col sea">
        <h3>CPU</h3>
        <WideSea :player="game.board.player2" />
      </div>
    </div>
    <div class="row">
      <div class="col">Destroyed {{ game.board.player1.destroyed }}/10</div>
      <div class="col">Destroyed {{ game.board.player2.destroyed }}/10</div>
    </div>
    <div class="row justify-content-center">
      <button class="btn btn-sm btn-primary col-2" @click="game.reset()">New game</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import WideSea from './WideSea.vue';

const props = defineProps(['game']);

onMounted(() => {

  if (Object.keys(props.game.board.player2.fields).length == 0) {
    props.game.board.player2.createFields();
  }
  
  props.game.board.player2.addRandomShips();
  props.game.setPlayer(Math.random() < 0.5 ? 'player1' : 'player2');

  props.game.tick();

});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.shipsel {
  border: 1px grey solid;
  border-radius: 0.2em;
  cursor: default !important;
  background-color: #ddd;
}

.shipsel.hidden {
  visibility: hidden;
}

.shipsel.vertical {
  border-color: red;
}
</style>

<style>
.field.player2 {
  cursor: pointer !important;
}
.field.player1 {
  cursor: default !important;
}
</style>