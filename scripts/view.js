function View(map, overlay) {

    var self = this;
    var tiles = document.getElementsByTagName("body")[0];
    var images = tiles.getElementsByTagName("div");
    var centerChild = tiles.childNodes.item(9);
    var xCount = 7;
    var yCount = 5;
    var total = xCount*yCount-1

    var translateX = 0;
    var translateY = 0;
    this.navigation = 1; // 1 = navigation, 0 = zoom

    var timer;
    var childNodesLength = tiles.childNodes.length;
    var offsetX = 0;
    var offsetY = 0;

    this.zoomIn = function(){
        if (map.zoom < 17) {
            map.zoom ++;
            this.setInitTiles();
        }
    }

    this.zoomOut = function(){
         if (map.zoom > 4) {
             map.zoom--;
             this.setInitTiles();
         }
    }

    function arrayToMap(x, y){
        return (y-1)*xCount+x-1;
    }
    
    this.setInitTiles = function(z) {

            map.x = long2tile(map.longitude, map.zoom);
            map.y = lat2tile(map.latitude, map.zoom);
        
            var xOffset = -3;
            var yOffset = -2;
            
            for (var y = 1; y <= yCount; y++) {    
        	    for (var x = 1; x <= xCount; x++) {	
        	         var tile = images[arrayToMap(x, y)];
                     tile.setAttribute("data-map", map.baseUrl + map.getNextTile(xOffset++, yOffset));
        	         tile.firstElementChild.style.backgroundImage = "url(" + tile.getAttribute("data-map") + ")";
        	         tile.firstElementChild.src = overlay.getTileUrl(map.x+xOffset,map.y+yOffset,map.zoom);   
        		}
        		xOffset = -3;
        		yOffset++;
        	}
    }

    this.setTilesYNext = function() {
            for (var x = xCount; x > 0; x--) {
            	for (var y = yCount; y > 0; y--) {
            	    // Set every tile to the previous tile with exception of the first row
                    if (tiles.childNodes[arrayToMap(x, y)-xCount] != undefined) {    
                        var tile = images[arrayToMap(x, y)];
        	            var nextTile = images[arrayToMap(x, y)-xCount];
        	            tile.setAttribute("data-map", nextTile.getAttribute("data-map"));
        	            tile.firstElementChild.style.backgroundImage = "url(" + tile.getAttribute("data-map") + ")";
                        tile.firstElementChild.src = nextTile.firstElementChild.src;
                    }
            	}
            }
            for (var i=yCount+1;i>=0;i--) {
                images[i].setAttribute("data-map", map.baseUrl + map.getNextTileY(images[i].getAttribute("data-map").replace(map.baseUrl, ""), 0));
                images[i].firstElementChild.style.backgroundImage = "url(" + images[i].getAttribute("data-map") + ")";
                images[i].firstElementChild.src = overlay.getTileUrl(map.x,map.y,map.zoom);
            }
        
    }

    this.setTilesYPrevious = function() {
            for (var x = 1; x <= xCount; x++) {
            	for (var y = 1; y <= yCount; y++) {
            	    // Set every tile to the previous tile with exception of the last row
        	         if (images[arrayToMap(x, y)+xCount] != undefined)   {  
        	             var tile = images[arrayToMap(x, y)];
        	             var previousTile = images[arrayToMap(x, y)+xCount];
        	             tile.setAttribute("data-map", previousTile.getAttribute("data-map"));
        	             tile.firstElementChild.style.backgroundImage = "url(" + tile.getAttribute("data-map") + ")";
                         tile.firstElementChild.src = previousTile.firstElementChild.src;
                    }
            	}
            }
           
            for (var i=total;i>27;i--){
                images[i].setAttribute("data-map", map.baseUrl + map.getNextTileY(images[i].getAttribute("data-map").replace(map.baseUrl, ""), 1));
                images[i].firstElementChild.style.backgroundImage = "url(" + images[i].getAttribute("data-map") + ")";
                images[i].firstElementChild.src = overlay.getTileUrl(map.x,map.y,map.zoom);
            }
    }


    this.setTilesXNext = function() {
        for (var x = 1; x <= xCount-1; x++) {
        	for (var y = 1; y <= yCount; y++) {
        	    // Set every tile to the previous tile with exception of the last column 
                if (arrayToMap(x, y)%xCount != 6) { 
                     var tile = images[arrayToMap(x, y)];
    	             var nextTile = images[arrayToMap(x, y)+1];
    	             if (nextTile != undefined) {
    	                 tile.setAttribute("data-map", nextTile.getAttribute("data-map"));
        	             tile.firstElementChild.style.backgroundImage = "url(" + tile.getAttribute("data-map") + ")";
                         tile.firstElementChild.src = nextTile.firstElementChild.src;
                     }
                }
        	}
        }

        
        for (var i=xCount-1;i<=total;i=i+xCount) {
            images[i].setAttribute("data-map", map.baseUrl + map.getNextTileX(images[i].getAttribute("data-map").replace(map.baseUrl, ""), 1));
            images[i].firstElementChild.style.backgroundImage = "url(" + images[i].getAttribute("data-map") + ")";
            images[i].firstElementChild.src = overlay.getTileUrl(map.x,map.y,map.zoom);
        }
    }

    this.setTilesXPrevious = function() {
        for (var x = xCount; x > 0; x--) {
        	for (var y = 1; y <= yCount; y++) {
        	    // Set every tile to the previous tile with exception of the first column 
                if (arrayToMap(x, y)%xCount != 0){
                    var tile = images[arrayToMap(x, y)];
    	            var previousTile = images[arrayToMap(x, y)-1];
    	            if (previousTile != undefined) {
                        tile.setAttribute("data-map", (previousTile.getAttribute("data-map")));
    	                tile.firstElementChild.style.backgroundImage = "url(" + tile.getAttribute("data-map") + ")";
                        tile.firstElementChild.src = previousTile.firstElementChild.src;
                    }
                }
        	}
        }

        var length = xCount*(yCount-1)
        for (var i=0;i<=length;i=i+xCount){
            images[i].setAttribute("data-map", map.baseUrl + map.getNextTileX(images[i].getAttribute("data-map").replace(map.baseUrl, ""), 0));
            images[i].firstElementChild.style.backgroundImage = "url(" + images[i].getAttribute("data-map") + ")";
            images[i].firstElementChild.src = overlay.getTileUrl(map.x,map.y,map.zoom);
        }          
    }
}
