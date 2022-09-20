export default (x,y) => {

    this.x = x || null;
    this.y = y || null;

    this.ship = null;

    this.setShip = (ship) => this.ship = ship;

    return {
        setShip: this.setShip
    }

}