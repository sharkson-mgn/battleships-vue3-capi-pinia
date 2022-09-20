import { defineStore, acceptHMRUpdate } from 'pinia';
import { useFieldStore } from './field';
import $ from 'jquery';
import bs from '../battleships';
import { useShipStore } from './ship';
import { useGameStore } from './game';

export const useBoardStore = (namestore) => {
    return defineStore('board_' + namestore, {
        state: () => ({
            fields: {},
            ships: {},
            configHorizontal: true,
            changed: {},
            colision: false,
            playerId: namestore,
            destroyed: 0,
            isCurrent: null,
        }),

        actions: {
            reset() {
                for (let f in this.fields) 
                    this.fields[f].$reset();
                for (let s in this.ships) 
                    this.ships[s].$reset();
                this.$reset();
            },
            tick(hitted){
                let game = useGameStore();
                game.tick(hitted);
            },
            randomHit() {
                let el,random;
                do {
                    random = bs.randomCoord();
                    el = this.findField(random.x,random.y);
                } while(!el.isEmpty());
                this.hit(random.x,random.y);
            },
            hit(cx,cy) {
                let field = this.findField(cx, cy);
                if (field.isMissed == true || field.isHitted == true || !this.isCurrent || this.destroyed == 10) {
                    return true;
                }
                let ship = this.shipAt(cx, cy);
                if (ship) {
                    field.hitted();
                    ship.hitField(cx, cy);
                    if (ship.isDestroyed()) {
                        this.addMarginShip(ship.id);
                        this.$patch({destroyed: this.destroyed + 1 });
                    } else {
                        this.addCorners(cx, cy);
                    }
                    if (this.destroyed < 10)
                        this.tick(true);
                } else {
                    field.missed();
                    this.tick(false);
                }
            },
            addMargin(xs, ys) {
                for (let y = ys - 1; y <= ys + 1; y++) {
                    for (let x = xs - 1; x <= xs + 1; x++) {
                        let field = this.findField(x, y);
                        if (field && field.isEmpty()) {
                            field.missed();
                        }
                    }
                }
            },

            addMarginShip(shipId) {
                let ship = this.ships[shipId];
                let fields = bs.calcFieldsRelative(ship.x, ship.y, ship.vert, ship.long, false);
                for (let f of fields) {
                    this.addMargin(f.x, f.y);
                }
            },

            addCorners(xs, ys) {
                for (let y = ys - 1; y <= ys + 1; y++) {
                    for (let x = xs - 1; x <= xs + 1; x++) {
                        let field = this.findField(x, y);
                        if (
                            field &&
                            field.isEmpty() &&
                            !((x == xs - 1) ^ (y == ys - 1) ^ (x == xs + 1) ^ (y == ys + 1))
                        ) {
                            field.missed();
                        }
                    }
                }
            },

            addRandomShip(id = null) {
                let colision, coord;
                let shipId = id !== null ? id : bs.randomShip(this.ships);
                let vert = Math.random() < 0.5;
                let bsShip = bs.getShip(shipId);
                do {
                    colision = false;
                    coord = bs.randomCoord();
                    let fields = bs.calcFieldsRelative(coord.x, coord.y, vert, bsShip.long, true);
                    for (let f of fields) {
                        if (this.detectColision(f.x, f.y, shipId)) colision = true;
                    }
                } while (colision);
                this.insertShip(shipId, coord.x, coord.y, vert);
            },
            addRandomShips() {
                for (let s of bs.shipList()) {
                    this.addRandomShip(s.id);
                }
            },
            insertShip(id, x, y, vert) {
                id = parseInt(id);
                let bsShip = bs.getShip(id);
                this.ships[id] = useShipStore(this.playerId, id, x, y, bsShip.long, vert);

                for (let field of this.ships[id].calcFields()) {
                    this.fields[x + field.x + '-' + (y + field.y)].ship = id;
                }
            },
            removeShip(id) {
                id = parseInt(id);

                let ship = this.ships[id];
                if (ship == undefined) {
                    return true;
                }
                for (let field of ship.calcFields()) {
                    this.fields[ship.x + field.x + '-' + (ship.y + field.y)].ship = null;
                }
                delete this.ships[id];
            },
            clearBoard() {
                for (let s of bs.shipList()) {
                    this.removeShip(s.id);
                }
            },
            moveShip(id, x, y) {
                this.removeShip(id);
                this.insertShip(id, x, y);
            },
            shipAt(x, y) {
                return this.fields[x + '-' + y] !== undefined && this.fields[x + '-' + y].ship !== null
                    ? this.ships[this.fields[x + '-' + y].ship]
                    : false;
            },
            createFields() {
                for (let y = 1; y <= 10; y++) {
                    for (let x = 1; x <= 10; x++) {
                        this.fields[x + '-' + y] = useFieldStore(this.playerId, x, y);
                    }
                }
            },
            clearField(field, methods = null) {
                if (typeof methods == 'string') {
                    methods = [methods];
                }

                let currId = field.x + '-' + field.y;
                if (Object.keys(this.changed).includes(currId)) {
                    let obj = this.changed[currId];
                    let match = [];
                    if (methods !== null) match = methods.filter((value) => obj.methods.includes(value));

                    let toClear = match === [] ? obj.methods : match;
                    for (let m of toClear) {
                        this.changed[currId].methods = bs.removeFromArr(obj.methods, m);
                        this.fields[currId].togglePatch(m);
                    }
                }
            },
            clearFields(methods = null) {
                if (typeof methods == 'string') {
                    methods = [methods];
                }

                for (let i in this.changed) {
                    this.clearField(this.fields[i], methods);
                }
            },

            patchField(field, method) {
                let id = field.x + '-' + field.y;
                if (this.changed[id] !== undefined) {
                    this.changed[id].methods.push(method);
                } else {
                    this.changed[id] = {
                        id: id,
                        methods: [method],
                    };
                }

                field[method]();
            },

            findField(x, y) {
                return this.fields[x + '-' + y] !== undefined ? this.fields[x + '-' + y] : false;
            },
            mouseEnter(el) {
                let elff = this.findField($(el).attr('x'), $(el).attr('y'));
                if (elff !== false) this.patchField(elff, 'hover');
            },
            mouseOut(el) {
                let elff = this.findField($(el).attr('x'), $(el).attr('y'));
                if (elff !== false) this.clearField(elff, 'hover');
            },
            draggableHelper(ui) {
                let [cx, cy] = bs.getCoordsFromEl(ui.target);
                let ship = this.shipAt(cx, cy);
                let vert = ship.vert;
                let opts = {
                    zIndex: 1000,
                    visibility: 'visible',
                };
                if (vert) {
                    opts.height = $('.field').eq(0).innerHeight() * parseInt(ship.long) + 'px';
                    opts.width = $('.field').eq(0).innerWidth() + 'px';
                } else {
                    opts.width = $('.field').eq(0).innerWidth() * parseInt(ship.long) + 'px';
                }
                // let el = $('<div class="shipsel m-1 shipsel-helper' + (ship.vert ? ' rotated' : '') + '">chuj</div>')
                //     .css(opts)
                //     .attr('ship', ship.id);
                let el = $('.shipsel').last().clone().css(opts).attr('ship', ship.id);
                return el;
            },
            droppableFieldDrop(event, ui, field) {
                if (this.colision) {
                    return false;
                }

                let [cx, cy] = bs.getCoordsFromEl(field);

                let shipId =
                    $(ui.draggable).attr('ship') ||
                    this.shipAt($(ui.draggable).attr('x'), $(ui.draggable).attr('y')).id;

                if (shipId === false || shipId === null || shipId === undefined) return false;

                let ship = bs.getShip(shipId);
                let move = Math.floor(ship.long / 3);

                let from = move * -1;

                let vert = this.ships[shipId] !== undefined ? this.ships[shipId].vert : !this.configHorizontal;

                if (this.ships[parseInt(shipId)] !== undefined) {
                    this.removeShip(shipId);
                }

                this.insertShip(shipId, cx + (vert ? 0 : from), cy + (vert ? from : 0), vert);
            },
            droppableFieldOver(event, ui, field) {
                let [cx, cy] = bs.getCoordsFromEl(field);
                let fieldObj = this.findField(cx, cy);

                if (fieldObj === false) {
                    return;
                }

                let shipId =
                    $(ui.draggable).attr('ship') ||
                    this.shipAt($(ui.draggable).attr('x'), $(ui.draggable).attr('y')).id;

                if (shipId === false || shipId === null || shipId === undefined) return false;

                let ship = bs.getShip(shipId);

                let long = ship.long;
                let move = Math.floor(long / 3);

                let from = move * -1,
                    to = long - move;

                //let vert = !this.configHorizontal;
                let vert = this.ships[shipId] !== undefined ? this.ships[shipId].vert : !this.configHorizontal;

                this.clearFields(['over', 'wrong', 'margin']);

                this.$patch({ colision: false });

                /*  loop check only area around the ship eg
                    ######
                    #SHIP#
                    ######

                    where SHIP is ship and # is margin around ship
                    horizontaly or verticaly
                */

                for (let y = (vert ? from : 0) + -1; y <= (vert ? to : 1); y++) {
                    for (let x = (vert ? 0 : from) + -1; x <= (vert ? 1 : to); x++) {
                        if (this.detectColision(cx + x, cy + y, shipId)) this.$patch({ colision: true });

                        let el = this.findField(cx + x, cy + y);

                        if (el === false) {
                            continue;
                        }

                        if (
                            x >= (vert ? 0 : from) &&
                            x < (vert ? 1 : to) &&
                            y >= (vert ? from : 0) &&
                            y < (vert ? to : 1)
                        ) {
                            this.patchField(el, 'over');
                        } else {
                            this.patchField(el, 'margin');
                        }
                    }
                }
            },
            detectColision(x, y, shipId) {
                let field = this.findField(x, y);
                return (
                    y < 0 ||
                    y > 11 ||
                    x < 0 ||
                    x > 11 ||
                    (field !== false && field.ship !== null && field.ship !== shipId)
                );
            },
        },
    })();
};

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBoardStore, import.meta.hot));
}
