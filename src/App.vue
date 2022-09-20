<script setup>
import { useGameStore } from './stores/game'

import DifficultyMenu from './components/DifficultyMenu.vue';
import ConfigShips from './components/ConfigShips.vue';
import BattleField from './components/BattleField.vue';

const game = useGameStore()

game.$subscribe(()=>{

}, )

if (game.debug && process.env.NODE_ENV === 'development')
  game.$patch({ difficulty: 0 });


</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <div class="container-flow">
    <div class="row justify-content-center">
      <div class="col-6">

        <div class="container-flow">
          <div class="row">
            <div class="col">
              <h1>:&gt;&gt; BattleShips v2 &lt;&lt;:</h1>
              <h3 v-if="!game.isStage(2)">.-=: Using Vue3/CAPI/Pinia :=-.</h3>
              <span v-if="game.isStage(0)">
                <h5>...and fully using props and store...</h5>
                ...for represent states.
              </span>
              <span v-else>
                Difficulty: {{ game.difficultyList[game.difficulty] }}

              </span>
            </div>
          </div>
          <div class="row">
            <div class="col mt-3">
              <DifficultyMenu :game="game" v-if="game.isStage(0)" />
              <ConfigShips :game="game" v-if="game.isStage(1)" />
              <BattleField :game="game" v-if="game.isStage(2)" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
#app {
  text-align: center;
}

.shipped {
  background-color: #ddd;
  border: 1px grey solid;
  border-radius: 0.2em;
  cursor: move;
  display: inline-block;
  width: 10%;
  height: 10%;
}

.shipsel-warring {
  background-color: #faa;
}

.sea-field-hover {
  background-color: #bdf;
}

/* # #eef <> #bdf */
.sea-field-margin {
  background-color: #ccd;
}

.sea-field-warring {
  background-color: #fdd;
}

.shipbox-hover {
  border-color: yellow;
}
</style>
