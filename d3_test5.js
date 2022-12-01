//crashData = d3.csv("crashData4.csv");
//y22 = d3.csv("y22.csv");

Promise.all([
    d3.csv("crashData5.csv"),
]).then(function(files) {

  const main = async () => {

    crashData = files[0]
    //crashData = crashData1.slice(1,100)
    //L = require(['leaflet@1.3.2']);
    //leafletCSS = html`<link href='${resolve('leaflet@1.2.0/dist/leaflet.css')}' rel='stylesheet' />`;
    //heatLayer = L, require('leaflet.heat').catch(() =>  L.heatLayer);
    //markerCluster = L, require('leaflet.markercluster@1.1.0').catch(() => L.markerClusterGroup);

    var width = window.innerWidth;
    var height  = width / 1.6;

    console.log(width)
    console.log(height)

    //markerClusterCSS = html`<link href='${resolve('leaflet.markercluster@1.1.0/dist/MarkerCluster.Default.css')}' rel='stylesheet' />`;

    //const mapContainer = DOM.element('div', {style: `width:${width}px;height:${width/1.6}px`});
    //yield mapContainer;
    //const map = createMap(mapContainer);

    const map = createMap();
    var markerCluster = L.markerClusterGroup();

    // create data points for the heatmap layer
    let dataPoints = crashData.map(h => [h.LAT, h.LOG, 0.1]); // intensity

    // add heatmap layer
    /*
        let dataHeatLayer = heatLayer(dataPoints, {
        minOpacity: 0.5,
        maxZoom: 18,
        max: 1.0,
        radius: 8,
        blur: 5,
        gradient: null
      }).addTo(map);
      */

    // add clustered markers
    //let markers = markerCluster({});
    let markersLayer = L.geoJson(createGeoData(crashData), {
      onEachFeature: function (feature, layer) {
        const data = feature.properties;

        const html = `<div class="popup"><h2>${data.Street}</h2>` +
                          `<h1 style="font-weight: bold;">Month:
                          <span style="color: red;">${data.Month}</span></h1></div>`;

        // const html = `<div class="popup"><h3>${data.Street}</h3>` +
        //       `<p>(${data.Street.toLowerCase()})<br />${data.YEAR}<br />${data.Month}</p></div>`;
        layer.bindPopup(html);
        layer.bindTooltip(html, {sticky: true});
      }
    });
    //markers.addLayer(markersLayer);
    markerCluster.addLayer(markersLayer);
    map.addLayer(markerCluster);
      // map.fitBounds(markers.getBounds());

    console.log(map)

    function createMap() {
      // create Stamen leaflet toner map with attributions
      const map = L.map('map').setView([41.85, -87.68], 10); // Chicago origins
      const mapTiles = '//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
      const osmCPLink = '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      const mapCPLink = '<a href="http://maps.stamen.com/toner">Stamen Design</a>';
      const tileLayer = L.tileLayer(mapTiles, {
        attribution: `${osmCPLink} | ${mapCPLink}`,
        detectRetina: false,
        maxZoom: 18,
        minZoom: 10,
        noWrap: false,
        subdomains: 'abc'
      }).addTo(map);
      return map;
    }

    // popUpCss = html`<style type="text/css">
    //   div.popup p { margin: 4px 0; }
    // </style>`

    createGeoData(crashData)

    function createGeoData(crashData) {
      const geoData = {
        type: 'FeatureCollection',
        crs: {type: 'name', properties: {name: 'urn:ogc:def:crs:OGC:1.3:CRS84'}},
        features: []
      };
      crashData.map(h => {
        geoData.features.push({
          type: 'Feature',
          properties: {
            Street: h.Street,
            Year: h.YEAR,
            Month: h.Month
          },
          geometry: {
            type: 'Point',
            coordinates: [h.LOG, h.LAT]
          }
        });
      });
      return geoData;
    }


  }

  main();

})
