# Leaflet.tile_layer  =  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
# Leaflet.attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
# Leaflet.max_zoom    = 18

# Leaflet.tile_layer  = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
# Leaflet.attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
# Leaflet.max_zoom    = 18


# var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
# 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
# 	subdomains: 'abcd',
# 	minZoom: 0,
# 	maxZoom: 18,
# 	ext: 'png'
# });

Leaflet.tile_layer  = 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
Leaflet.attribution = 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
Leaflet.max_zoom    = 16
