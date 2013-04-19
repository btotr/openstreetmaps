var map = new OSMaps();
var view;

var overlay;

function init() {
    overlay = new Overlay(map);
    overlay.setServer("http://geoservices.knmi.nl/cgi-bin/INTER_OPER_R___OBSERV__L3.cgi?");
    overlay.setLayers("RADNL_OPER_R___25PCPRR_L3_COLOR&TIME="+getTime());
    overlay.setSRS("EPSG:4326"); 
    view = new View(map, overlay);
   
document.body.focus()
    // address arguments
    if (document.location.search.indexOf("address=") == -1) {
        console.log("WARNING: no address specified, use url of form http://host/location?address=Amsterdam&");
        mapSearch();
    } else {
        var proxy = false
        if (document.location.search.indexOf("proxy=") != -1) proxy = true
        mapSearch(/address=(.*)$/i.exec(document.location.search)[1], proxy);
    }
}

function keylistener(e){ 
    switch(e.keyCode){
        case 8:
            if (window.parent) {
                 window.parent.closeApplication()
                 e.preventDefault()
            }
            break;
        case 13:
            if (view.navigation) view.navigation = 0;
            else view.navigation = 1;
            break;
        case 37:
            if (view.navigation) view.setTilesXPrevious();
            break;
        case 39:
            if (view.navigation) view.setTilesXNext();
            break;
        case 40:
            if (view.navigation) view.setTilesYPrevious();
            else view.zoomOut();
            break;
        case 38:
            if (view.navigation) view.setTilesYNext(); 
            else view.zoomIn();
            break;
        case 53:
            if (overlay.showOverlay) overlay.overlay = false; 
            else overlay.showOverlay = true;
            break;
        default:
            break;   
        }
}

function getTime(){
    var now = new Date();
	var year = now.getUTCFullYear();
	var month = now.getUTCMonth();
	var day = now.getUTCDate();
    month += 1;
    var s = now.getUTCSeconds();
	var m = now.getUTCMinutes();
	var h = now.getUTCHours();
    return time = year + "-"+ month + "-"+ day + "T0" +  parseInt(h-1) +":" + m + ":00Z/"+ year +"-" + month + "-" + day + "T" + h + ":" + m + ":00Z";
}

function mapSearch(address, proxy) {
    if (!address) { // Show the whole map
        view.setInitTiles();
        return false;
    }
    
    var api_key = "BQIAAAAeks3N-z1O2L2EEjg3sosNBS2QVdcV5n01oV4wNWTDHGEDl7sBhRIru4R-NlaIwfWlLW6682JaGaxow";
    var url = "http://maps.google.com/maps/geo?q="+address+"&output=json&key="+api_key;

    if (proxy) {
        url = CONFIG.proxy + address;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET",url, true);
    xhr.onreadystatechange = function() {
      if (this.readyState == 4)
          if(this.status == 200) {
              var geodata = eval( '(' + this.responseText + ')' );
              if (geodata.Status.code == 200) {
                  // Set the new longitude and latitude
                  map.longitude = parseFloat(geodata.Placemark[0].Point.coordinates[0]);
                  map.latitude = parseFloat(geodata.Placemark[0].Point.coordinates[1]);
              }
              view.setInitTiles();
          }
    }
    xhr.send();
  
}
 document.addEventListener("keydown", keylistener, false);
window.addEventListener('load', init , false);