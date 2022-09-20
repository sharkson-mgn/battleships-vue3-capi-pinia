import { defineStore, acceptHMRUpdate } from 'pinia';
import bs from '../battleships';

export const useShipStore = (player,namestore, x, y, long, vert) => {
    const ship = defineStore({
        id: 'ship_'+ player + '_' + namestore,
        state: () => ({
            x: x || null,
            y: y || null,
            long: long || null,
            vert: vert || false,
            id: parseInt(namestore),
            hittedField: []
        }),
        getters: {},
        actions: {
            setCoord(x, y) {
                this.x = x;
                this.y = y;
            },
            calcFields(withMargin = false) {
                return bs.calcFields(this.x,this.y,this.vert,this.long,withMargin);
            },
            calcRange(withMargin = false) {
                return bs.calcRange(this.x,this.y,this.vert,this.long,withMargin);
            },
            hitField(x,y) {
                this.$patch({ hittedField: [...this.hittedField,[x,y]]});
            },
            isDestroyed() {
                return this.long <= this.hittedField.length;
            }
        },
    })();
    ship.$patch({
        x: x || null,
        y: y || null,
        long: long || null,
        vert: vert || false,
        id: parseInt(namestore),
    });
    return ship;
};

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useShipStore, import.meta.hot));
}
