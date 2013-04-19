function Overlay(map) {
    this.showOverlay = false;
    this.server = "";
    this.request = "GetMap";
    this.layers = "";
    this.imageFormat = "image/png";
    this.SRS = "";
    this.bbox = "";
    this.style = "";
    this.version = "1.1.1";
    
    this.getTileUrl = function(x,y,z) {
        if (!this.showOverlay) return "";
        var bb = map.tile2boundingBox(x, y, z);
    	this.bbox = bb.west + "," +  bb.south + "," + bb.east + "," + bb.north;

    	var url= this.server;
    	url+="REQUEST="+ this.request;
    	url+="&SERVICE=WMS";
    	url+="&VERSION="+this.version;
    	url+="&LAYERS="+this.layers;
    	url+="&STYLES="+this.style;
    	url+="&FORMAT="+this.imageFormat;
    	url+="&BGCOLOR=0xFFFFF";
    	url+="&TRANSPARENT=TRUE";
    	url+="&SRS="+this.SRS;
    	url+="&BBOX="+this.bbox;
    	url+="&WIDTH=256";
    	url+="&HEIGHT=256";

	    return url;
    }
}

Overlay.prototype.setServer = function(server){
    this.server = server;
}

Overlay.prototype.setLayers = function(layers){
    this.layers = layers;
}

Overlay.prototype.setSRS = function(SRS){
    this.SRS = SRS;
}

Overlay.prototype.setFormat = function(format){
    this.format = format;
}

Overlay.prototype.setVersion = function(version){
    this.version = version;
}

Overlay.prototype.setStyle = function(style){
    this.style = style;
}