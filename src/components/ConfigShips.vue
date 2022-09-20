<template>
  <div class="container-flow">
    <div class="row">
      <div class="col sea">
        <WideSea :player="game.board.player1" />
      </div>
      <div class="col">
        <div class="container border rounded">
          <div class="row d-flex shipbox">
            <div class="col">
              <div v-for="(ship,index) in game.shipList" :key="index" class="d-inline-flex shipsel m-1"
                :class="[
                  'long-' + ship.long,
                  'ship-' + index,
                  (game.board.player1.ships[index] !== undefined ? 'hidden' : ''),
                  (game.board.player1.configHorizontal ? '' : 'vertical')
                ]" :ship="index" :long="ship.long">&nbsp;</div>
            </div>
          </div>
          <div class="row justify-content-between">
            <div class="col-auto align-self-start">
              <button class="btn btn-sm btn-secondary my-1" @click="addRotate">Rotate</button>
            </div>
            <div class="col-auto align-self-end">
              <button class="btn btn-sm btn-secondary my-1 mx-1" @click="resetPos">Reset</button>
              <button class="btn btn-sm btn-secondary my-1" @click="randomPos">Random</button>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-auto">
              <button
                class="btn btn-success my-2"
                :disabled="Object.keys(game.board.player1.ships).length < 10"
                @click="game.$patch({start: true})"
              >Start</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import $ from "jquery";
import 'jqueryui';
import WideSea from './WideSea.vue';

const props = defineProps(['game']);

function randomPos() {
  props.game.board.player1.clearBoard();
  props.game.board.player1.addRandomShips();
}

function resetPos() {
  props.game.board.player1.clearBoard();
}

function addRotate() {
  props.game.board.player1.$patch({
    configHorizontal: !props.game.board.player1.configHorizontal
  });
  $('.shipsel').each(function() {
    let attr = {
      width: ($('.field').eq(0).innerWidth() * (!props.game.board.player1.configHorizontal ? 1 : $(this).attr('long'))) + 'px',
      height: ($('.field').eq(0).innerHeight() * (props.game.board.player1.configHorizontal ? 1 : $(this).attr('long'))) + 'px',
    }
    let firstAttr = {};
    let secondAttr = {};
    let first = Object.keys(attr)[+ props.game.board.player1.configHorizontal];
    let second = Object.keys(attr)[+ (!props.game.board.player1.configHorizontal)];
    firstAttr[first] = attr[first];
    secondAttr[second] = attr[second];

    $(this).stop().animate(firstAttr,400,'easeOutSine',function(){
      $(this).stop().animate(secondAttr,400,'easeInSine');
    });
  })
}

onMounted(() => {

  if (Object.keys(props.game.board.player1.fields).length == 0)
    props.game.board.player1.createFields();

  $('.shipsel').draggable({
    revert: true
  }).css({
    'height': $('.field').eq(0).innerHeight() + 'px',
  }).each(function () {
    $(this).css({
      width: ($('.field').eq(0).innerWidth() * parseInt($(this).attr('long'))) + 'px',
    });
  });

  $('.shipbox').droppable({
    accept: '.field',
    drop: function(event,ui) {
      let ship = $(ui.helper).attr('ship');
      props.game.board.player1.removeShip(ship);
    }
  });

  if (props.game.debug && process.env.NODE_ENV === 'development') {
    props.game.board.player1.addRandomShips();
    props.game.$patch({start:true});
  }

});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.shipsel {
  border: 1px grey solid;
  border-radius: 0.2em;
  cursor: move;
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
.player1.shipped {
  cursor: move !important;
}
</style>
