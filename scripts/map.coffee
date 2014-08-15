---
---

scroll = new IScroll '#info-wrapper',
  mouseWheel: true,
  scrollbars: true

info = document.getElementById 'info'
L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlcGFua3V6bWluIiwiYSI6Ik1ieW5udm8ifQ.25EOEC2-N92NCWT0Ci9w-Q'

window.map = map = L.map 'map',
  minZoom: 2
  scrollWheelZoom: false
  attributionControl: false

baselayer = L.tileLayer 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
  subdomains: 'abcd'

map.addLayer baselayer

map.setView [44.96, 20.21], 4

featureLayer = L.mapbox.featureLayer().loadURL('data/places.geojson').on 'ready', (e) =>
  clusterGroup = new L.MarkerClusterGroup
    maxClusterRadius: 40
    showCoverageOnHover: false
    removeOutsideVisibleBounds: true

  e.target.eachLayer (layer) ->    
    feature = layer.feature
    key = feature.properties.key
    url = "/places/#{key}/"
    popupContent = "<a target='_blank' class='popup' href='#{url}'>
                      <img src='/images/flags/#{key}.png'/>
                      <br />
                      #{feature.properties.title}
                    </a>"

    layer.bindPopup popupContent,
      closeButton: false

    link = info.appendChild document.createElement 'a'
    link.setAttribute 'href', url
    link.className = 'item'
    link.style.backgroundImage = "url('/images/flags/#{key}.png')";
    link.innerHTML = layer.feature.properties.title + '<br /><small>' + layer.feature.properties.title + '</small>'

    clusterGroup.addLayer layer

  map.addLayer clusterGroup
  scroll.refresh()