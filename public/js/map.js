mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', 
center: coordinates, 
zoom: 9 
});

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(coordinates)
.setPopup(new mapboxgl.Popup({offset: 25}).setHtml("<h2>Exact location provided after booking</h2>"))
.addTo(map);