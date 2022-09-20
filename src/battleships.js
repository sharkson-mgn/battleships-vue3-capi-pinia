import { useShipStore } from './stores/ship';

export default {
    playerShipList: () => {
        let shipList = {};
        for (let s in this.shipList()) {
            shipList[s] = useShipStore(s);
        }
    },
    shipList: () => {
        let ships = [];
        for (let i = 1; i < 5; i++) {
            for (let g = 1; g <= i; g++) {
                ships.push({
                    long: 5 - i,
                    id: ships.length,
                });
            }
        }
        return ships;
    },

    calcFields(x, y, vert, long, withMargin = false) {
        let range = this.calcRange(x, y, vert, long, withMargin);
        let fields = [];
        for (let y = range.absolute.y.from; y < range.absolute.y.to; y++) {
            for (let x = range.absolute.x.from; x < range.absolute.x.to; x++) {
                fields.push({ x: x, y: y });
            }
        }
        return fields;
    },

    calcFieldsRelative(x, y, vert, long, withMargin = false) {
        let range = this.calcRange(x, y, vert, long, withMargin);
        let fields = [];
        for (let y = range.relative.y.from; y < range.relative.y.to; y++) {
            for (let x = range.relative.x.from; x < range.relative.x.to; x++) {
                fields.push({ x: x, y: y });
            }
        }
        return fields;
    },

    calcRange(x, y, vert, long, withMargin = false) {
        let ret = {};
        ret.absolute = {
            x: {
                from: 0 - (withMargin ? 1 : 0),
                to: (vert ? 1 : long) + (withMargin ? 1 : 0),
            },
            y: {
                from: 0 - (withMargin ? 1 : 0),
                to: (vert ? long : 1) + (withMargin ? 1 : 0),
            },
        };
        ret.relative = {
            x: {
                from: x + ret.absolute.x.from,
                to: x + ret.absolute.x.to,
            },
            y: {
                from: y + ret.absolute.y.from,
                to: y + ret.absolute.y.to,
            },
        };

        return ret;
    },

    getCoordsFromEl(el) {
        return /field-player\d-(\d+)-(\d+)/
            .exec(el.classList.value)
            .slice(1)
            .map((x) => {
                return parseInt(x);
            });
    },

    getShip(id) {
        return this.shipList()[id];
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

    randomShip(ships) {
        let keys = Object.keys(ships);
        let allShips = ['0','1','2','3','4','5','6','7','8','9'];
        allShips = allShips.filter( function( el ) {
            return !keys.includes( el );
          } );
        return allShips[this.randomNumber(0,allShips.length-1)];
    },

    removeFromArr(arr) {
        var what,
            a = arguments,
            L = a.length,
            ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    },
};
