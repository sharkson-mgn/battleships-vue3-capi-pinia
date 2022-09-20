import { defineStore, acceptHMRUpdate } from "pinia";
import { useBoardStore } from "./board";
import bs from '../battleships';

export const useGameStore = defineStore({
    id: 'game',
    state: () => ({
        difficulty: null,
        difficultyList: ['Easy','Medium','Hard'],
        playerName: null,
        start: false,
        board: {
            player1: useBoardStore('player1'),
            player2: useBoardStore('player2')
        },
        currentPlayer: null,
        debug: false
    }),
    getters: {
        shipList() {
            return bs.shipList();
        },
        stage() {
            if (this.difficulty == null)
                return 0;
            
            else if (this.difficulty !== null && (Object.keys(this.board.player1.ships) < 10 || !this.start))
                return 1;
            
            else if (this.start)
                return 2;
        }
    },
    actions: {
        reset() {
            this.board.player1.reset();
            this.board.player2.reset();
            this.$reset();
        },
        tick(hitted) {
            if (hitted == false)
                this.changePlayer();

            if (this.currentPlayer == 'player1'){
                let func = this.board[this.currentPlayer].randomHit;
                setTimeout(function(){
                    func();
                },1000);
            }
        },
        changePlayer() {
            let keys = Object.keys(this.board)
            let index = keys.indexOf(this.currentPlayer);
            this.setPlayer(keys[(1-index)]);
        },
        setPlayer(player) {
            this.$patch({currentPlayer: player});
            let keys = Object.keys(this.board)
            let index = keys.indexOf(player);
            this.board[keys[index]].$patch({isCurrent: true});
            this.board[keys[(1-index)]].$patch({isCurrent: false});
        },
        isStage(id) {
            return id == this.stage;
        },
        clearBoard() {
            return {};
        },

        setDifficulty(d) {
            this.$patch({ difficulty: d });
        },

        randomNumber(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },

        randomCoord() {
            return {
                x: this.randomNumber(1, 10),
                y: this.randomNumber(1, 10),
            };
        },
        setPlayerName(playerName) {
            if (typeof playerName !== 'string')
                return false;

            this.$patch({
               playerName: playerName 
            });
        }
    },
    watch: {
        currentPlayer(newVal,oldVal) {
            console.log(newVal,oldVal);
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
}