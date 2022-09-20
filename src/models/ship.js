/*
    x, y and long = int;
    dir = bool => if true is horizontaly;

*/

export default (x = null, y = null, long = null, dir = null) => {
    
    this.x = x || null;
    this.y = y || null;
    this.long = long || null;
    this.dir = dir || false;

    this.setY = (y) => this.y = y;
    this.setX = (x) => this.x = x;
    this.setCoord = (x,y) => { this.x = x; this.y = y; };
    this.setLong = (long) => this.long = long;
    this.setDirection = (dir) => this.dir = dir;
    
    this.getY = () => this.y;
    this.getX = () => this.x;
    this.getCoord = () => { return {x: this.x, y: this.y} };
    this.getLong = () => this.long;
    this.getDirection = () => this.dir;

    return {
        setY: this.setY,
        setX: this.setX,
        getY: this.getY,
        getX: this.getX,
        setCoord: this.setCoord,
        getCoord: this.getCoord,
        setLong: this.setLong,
        getLong: this.getLong,
        setDirection: this.setDirection,
        getDirection: this.getDirection,
    };

};