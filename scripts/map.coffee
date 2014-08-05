---
---

scroll = new IScroll '#info-wrapper',
  mouseWheel: true,
  scrollbars: true

info = document.getElementById 'info'
L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlcGFua3V6bWluIiwiYSI6Ik1ieW5udm8ifQ.25EOEC2-N92NCWT0Ci9w-Q'
window.map = map = L.mapbox.map 'map', 'examples.map-i86nkdio',
  minZoom: 2
  scrollWheelZoom: false
  attributionControl: false

map.setView [44.96, 20.21], 4

featureLayer = L.mapbox.featureLayer().loadURL('data/countries.geojson').on 'ready', (e) =>
  clusterGroup = new L.MarkerClusterGroup
    maxClusterRadius: 40
    showCoverageOnHover: false
    removeOutsideVisibleBounds: true

  e.target.eachLayer (layer) ->    
    feature = layer.feature
    popupContent =  '<a target="_blank" class="popup" href="' +
                    feature.properties.url + '">' + feature.properties.title + '</a>'

    layer.bindPopup popupContent,
      closeButton: false

    link = info.appendChild document.createElement 'a'
    link.setAttribute 'href', feature.properties.url
    link.className = 'item'
    link.innerHTML = layer.feature.properties.title +
                    '<br /><small>' + layer.feature.properties.title + '</small>'

    clusterGroup.addLayer layer

  map.addLayer clusterGroup
  scroll.refresh()