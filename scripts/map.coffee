---
---

L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlcGFua3V6bWluIiwiYSI6Ik1ieW5udm8ifQ.25EOEC2-N92NCWT0Ci9w-Q'
map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([56.833333, 60.583333], 2)

featureLayer = L.mapbox.featureLayer().loadURL('data/countries.geojson').on 'ready', (e) ->
  clusterGroup = new L.MarkerClusterGroup
    maxClusterRadius: 40
    showCoverageOnHover: false
    removeOutsideVisibleBounds: true

  e.target.eachLayer (layer) ->
    feature = layer.feature
    popupContent =  '<a target="_blank" class="popup" href="' +
                    feature.properties.url + '">' + feature.properties.title + '</a>'

    layer.bindPopup popupContent,
      closeButton: false,
      minWidth: 320

    clusterGroup.addLayer layer

  map.addLayer clusterGroup