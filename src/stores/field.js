import { defineStore, acceptHMRUpdate } from 'pinia';

export const useFieldStore = (playerName, x, y) => {
    return defineStore({
        id: 'field_' + playerName + '_' + x + '_' + y,
        state: () => ({
            x: x,
            y: y,
            board: false,
            ship: null,
            isHover: false,
            isOver: false,
            isMargin: false,
            isWrong: false,
            isShipped: false,
            isMissed: false,
            isHitted: false,
            owner: playerName || null,
        }),
        actions: {
            isEmpty() {
                return !(this.isMargin || this.isShipped || this.isMissed || this.isHitted);
            },
            setCoord(x, y) {
                this.x = x;
                this.y = y;
            },
            getInfo() {
                return [this.$id, this.x, this.y];
            },
            hover() {
                this.$patch({ isHover: true });
            },
            leave() {
                this.$patch({ isHover: false, isOver: false, isMargin: false });
            },
            over() {
                this.$patch({ isOver: true });
            },
            margin() {
                this.$patch({ isMargin: true });
            },
            correct() {
                this.$patch({ isWrong: false });
            },
            wrong() {
                this.$patch({ isWrong: true });
            },
            missed() {
                this.$patch({ isMissed: true});
            },
            hitted() {
                this.$patch({ isHitted: true});
            },
            togglePatch(state) {
                let toUnpatch = {};
                state = 'is' + state.charAt(0).toUpperCase() + state.slice(1);
                toUnpatch[state] = !this[state];
                this.$patch(toUnpatch);
            },
        },
    })();
};

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFieldStore, import.meta.hot));
}
