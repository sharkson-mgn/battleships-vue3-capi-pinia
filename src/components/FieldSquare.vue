<template>
  <div class="square field" :x="x" :y="y" :class="[
      'field-'+ player.playerId +'-' + x + '-' + y,
      player.playerId,
      (player.findField(x,y).isHover ? 'field-hover' : ''),
      (player.findField(x,y).isOver ? 'field-correct' : ''),
      (player.findField(x,y).isMargin ? 'field-margin' : ''),
      (player.colision ? 'colision' : ''),
      (player.shipAt(x,y) !== false ? 'shipped' : ''),
      (player.findField(x,y).isMissed ? 'field-missed' : ''),
      (player.findField(x,y).isHitted ? 'field-hitted' : '')
    ]
  ">&nbsp;</div>
</template>

<script setup>
const { onMounted } = require("vue-demi");
const $ = require("jquery");
const { default: battleships }=require("@/battleships");


const props = defineProps(['player', 'x', 'y']);

onMounted(() => {

  $('.field.' + props.player.playerId).mouseover(function () {
    props.player.mouseEnter(this);
  }).mouseout(function () {
    props.player.mouseOut(this);
  });

  if (props.player.playerId == 'player2') {
    $('.field.' + props.player.playerId).click(function () {
      return;
    })
  }

  if (props.player.playerId == 'player1' && Object.keys(props.player.ships).length < 10) {

    $('.field-' + props.player.playerId + '-' + props.x + '-' + props.y).droppable({
      over: function (event, ui) { return props.player.droppableFieldOver(event, ui, this) },
      deactivate: function () {
        props.player.clearFields([
          'over', 'wrong', 'correct', 'margin'
        ])
      },
      drop: function (event, ui) { return props.player.droppableFieldDrop(event, ui, this) }
    });

    $('.field-' + props.player.playerId + '-' + props.x + '-' + props.y).draggable({
      revert: function (droppable) { return (droppable === false || props.player.colision); },
      helper: props.player.draggableHelper,
      cancel: '.empty-field'
    });
  }

  if (props.player.playerId == 'player2') {
    $('.field-' + props.player.playerId + '-' + props.x + '-' + props.y).click(function(){
      let [cx,cy] = battleships.getCoordsFromEl(this);
      props.player.hit(cx,cy);
    })
  }

});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field {
  border: 1px #eef solid;
  border-radius: 0.2em;
  background-color: #ddf;
  cursor: default;
  display: inline-block;
  width: 10%;
  height: 10%;
}

.field-hover {
  background-color: #bdf;
}

.field-correct {
  background-color: #5ce7ff;
}

.field-correct.colision {
  background-color: #fdd;
}

.field-margin {
  background-color: #ccd;
}

.field-margin.colision {
  background-color: #ffabab;
}

.player1.shipped {
  background-color: #ddd;
  border: 1px grey solid;
  border-radius: 0.2em;
  display: inline-block;
  width: 10%;
  height: 10%;
}

.field-missed {
  background-color: #ccc;
}
.field-hitted {
  background-color: red !important;
}
</style>
