---
---

scroll = new IScroll '#info-wrapper',
  mouseWheel: true,
  scrollbars: true

info = document.getElementById 'info'
L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlcGFua3V6bWluIiwiYSI6Ik1ieW5udm8ifQ.25EOEC2-N92NCWT0Ci9w-Q'
map = L.mapbox.map('map', 'examples.map-i86nkdio', {attributionControl: false}).setView([56.833333, 60.583333], 3)

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
    link.className = 'item'
    link.href = '#'
    link.innerHTML = layer.feature.properties.title +
                    '<br /><small>' + layer.feature.properties.title + '</small>'

    link.onclick = ->
      if /active/.test(@className)
        @className = @className.replace(/active/, "").replace(/\s\s*$/, "")
      else
        siblings = info.getElementsByTagName("a")
        i = 0

        while i < siblings.length
          siblings[i].className = siblings[i].className.replace(/active/, "").replace(/\s\s*$/, "")
          i++
        @className += " active"

        window.l = layer
        map.panTo layer.getLatLng()

        layer.openPopup()
      false

    clusterGroup.addLayer layer

  map.addLayer clusterGroup
  scroll.refresh()