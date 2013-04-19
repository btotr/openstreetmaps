function OSMaps(){
    //this.baseUrl = "http://tah.openstreetmap.org/Tiles/tile/";
    this.baseUrl = "http://tile.cloudmade.com/4652b5cfd240519aabd2706ee02fa5fa/1/256/";
    // default coordinates
    // This is app. in the center of Holland
    this.latitude = 52.091556; 
    this.longitude = 5.115008; 
    this.zoom = 8;

    this.x = long2tile(this.longitude, this.zoom);
    this.y = lat2tile(this.latitude, this.zoom);
    this.oldX = this.x;
    this.oldY = this.y;
}

OSMaps.prototype.getNextTileX = function (addr,forward) {
    var x = parseInt(addr.substring(addr.indexOf("/")+1, addr.lastIndexOf("/")));
    var xOffset = 3;
    var yOffset = -2;

    if(forward) {
        x ++;
        xOffset = -3;
    } else {
        x --;
    }

    this.x = x;
    this.y = parseInt(addr.substring(addr.lastIndexOf("/")+1, addr.indexOf(".png")));

    this.longitude = tile2long(this.x+xOffset, this.zoom);
    this.latitude = tile2lat(this.y+yOffset, this.zoom);

	return this.getNextTile(0,0);
}

OSMaps.prototype.getNextTileY = function(addr,forward) {
    var y = parseInt(addr.substring(addr.lastIndexOf("/")+1, addr.indexOf(".png")));
    var xOffset = 3;
    var yOffset = 2;

    if(forward) {
        y ++;
        yOffset = -2;
    } else {
        y --;
    }
    this.y = y;
    this.x = parseInt(addr.substring(addr.indexOf("/")+1, addr.lastIndexOf("/")));

    this.longitude = tile2long(this.x+xOffset, this.zoom);
    this.latitude = tile2lat(this.y+yOffset, this.zoom);

	return this.getNextTile(0,0);
}

OSMaps.prototype.getNextTile = function(xOffset, yOffset) {
    var url = this.zoom + "/" + parseInt(this.x+xOffset) + "/" +parseInt(this.y+yOffset)+ ".png";
	return url;
}

OSMaps.prototype.tile2boundingBox = function(x, y, zoom) {
    var bb = new Object();
    bb.north = tile2lat(y, zoom);
    bb.south = tile2lat(y + 1, zoom);
    bb.west = tile2long(x, zoom);
    bb.east = tile2long(x + 1, zoom);
    return bb;
}


function long2tile(lon,zoom) {
    return parseInt(Math.floor((lon+180)/360*Math.pow(2,zoom)));
}

function lat2tile(lat,zoom)  {
    return parseInt(Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
}

function tile2long(x,z) {
    return (x/Math.pow(2,z)*360-180);
}

function tile2lat(y,z) {
    var n = Math.PI-2*Math.PI*y/Math.pow(2,z);
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}