import { GCJ_BROWSER_JS } from "./gcj-browser.js";

export function getPageHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>WLOC Virtual Location</title>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="WLOC">
<!-- 内联图标: 没有它浏览器每次加载都会去要 /favicon.ico 并拿到 404 -->
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext y='26' font-size='26'%3E%F0%9F%93%8D%3C/text%3E%3C/svg%3E">
<!-- integrity 为 Leaflet 官方在 leafletjs.com/download.html 公布的 SRI 值,
     可自行核对。CDN 被篡改时浏览器会拒绝执行, 下面的 typeof L 检查会给出提示。 -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="anonymous"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin="anonymous"><\/script>
<style>
:root { --blue:#007aff; --green:#34c759; --red:#ff3b30; --gray:#8e8e93; --bg:#f2f2f7; --orange:#ff9500; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:-apple-system,system-ui,"SF Pro","Helvetica Neue",sans-serif; background:var(--bg); }
#map { height:50vh; width:100%; min-height:250px; }
.panel { padding:16px; max-width:600px; margin:0 auto; }
.card { background:#fff; border-radius:12px; padding:16px; margin-bottom:12px; box-shadow:0 1px 3px rgba(0,0,0,.08); }
.card h3 { font-size:15px; font-weight:600; margin-bottom:10px; }
.coords { font-family:"SF Mono",monospace; font-size:14px; color:#333; padding:8px 12px; background:var(--bg); border-radius:8px; word-break:break-all; }
.row { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
.btn { flex:1; min-width:100px; padding:12px 16px; border:none; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; transition:all .15s; }
.btn-primary { background:var(--blue); color:#fff; }
.btn-primary:active { background:#005bb5; transform:scale(.97); }
.btn-secondary { background:#e5e5ea; color:#333; }
.btn-secondary:active { background:#d1d1d6; transform:scale(.97); }
.btn-danger { background:var(--red); color:#fff; }
.btn-danger:active { background:#d63027; transform:scale(.97); }
.btn.success { background:var(--green); color:#fff; }
.btn-sm { flex:none; min-width:auto; padding:6px 12px; font-size:12px; border-radius:8px; }
.input-row { display:flex; gap:8px; margin-top:10px; }
.input-row input { flex:1; padding:10px 12px; border:1px solid #d1d1d6; border-radius:8px; font-size:14px; outline:none; min-width:0; }
.input-row input:focus { border-color:var(--blue); }
.status { font-size:12px; color:var(--gray); margin-top:8px; text-align:center; }
.error-banner { background:var(--red); color:#fff; padding:14px 16px; border-radius:12px; margin-bottom:12px; font-size:14px; line-height:1.5; display:none; }
.error-banner b { display:block; margin-bottom:4px; }
.toast { position:fixed; top:60px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,.8); color:#fff; padding:10px 20px; border-radius:20px; font-size:14px; opacity:0; transition:opacity .3s; pointer-events:none; z-index:9999; max-width:90vw; text-align:center; }
.toast.show { opacity:1; }
.active-loc { background:var(--bg); border-radius:8px; padding:10px 12px; font-size:13px; color:#333; }
.active-loc .label { font-size:11px; color:var(--gray); margin-bottom:4px; }
.active-loc .value { font-family:"SF Mono",monospace; font-size:13px; }
.fav-list { max-height:240px; overflow-y:auto; }
.fav-item { display:flex; align-items:center; gap:8px; padding:10px 12px; background:var(--bg); border-radius:8px; margin-bottom:6px; cursor:pointer; transition:background .15s; }
.fav-item:active { background:#e0e0e5; }
.fav-item .fav-info { flex:1; min-width:0; }
.fav-item .fav-name { font-size:14px; font-weight:500; color:#333; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fav-item .fav-coords { font-size:11px; color:var(--gray); font-family:"SF Mono",monospace; margin-top:2px; }
.fav-item .fav-active { font-size:10px; color:var(--green); font-weight:600; }
.fav-item .fav-del { flex:none; width:28px; height:28px; border:none; border-radius:50%; background:transparent; color:var(--red); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.fav-item .fav-del:hover { background:rgba(255,59,48,.1); }
.fav-empty { text-align:center; color:var(--gray); font-size:13px; padding:16px 0; }
.fav-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.fav-header h3 { margin-bottom:0; }
.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,.4); z-index:10000; display:none; align-items:center; justify-content:center; padding:20px; }
.modal-overlay.show { display:flex; }
.modal { background:#fff; border-radius:16px; padding:20px; width:100%; max-width:340px; }
.modal h3 { font-size:17px; font-weight:600; margin-bottom:16px; text-align:center; }
.modal input { width:100%; padding:12px; border:1px solid #d1d1d6; border-radius:10px; font-size:15px; outline:none; margin-bottom:12px; }
.modal input:focus { border-color:var(--blue); }
.modal .modal-btns { display:flex; gap:8px; }
.modal .modal-btns .btn { padding:12px; }
.layer-switch { position:absolute; top:10px; right:10px; z-index:1000; display:flex; gap:4px; background:rgba(255,255,255,.92); border-radius:8px; padding:4px; box-shadow:0 2px 8px rgba(0,0,0,.15); }
.layer-btn { border:none; background:transparent; padding:6px 10px; border-radius:6px; font-size:12px; font-weight:500; color:#333; cursor:pointer; transition:all .15s; white-space:nowrap; }
.layer-btn.active { background:var(--blue); color:#fff; }
.layer-btn:active { transform:scale(.95); }
@media(max-width:480px) { #map { height:44vh; } .panel { padding:12px; } .layer-btn { padding:5px 7px; font-size:11px; } }
</style>
</head>
<body>
<div style="position:relative">
<div id="map"></div>
<div class="layer-switch">
  <button class="layer-btn active" data-layer="satellite" onclick="switchLayer('satellite')">Satellite</button>
  <button class="layer-btn" data-layer="wgs84" onclick="switchLayer('wgs84')">WGS84</button>
  <button class="layer-btn" data-layer="amap" onclick="switchLayer('amap')" title="Amap uses GCJ-02 offset tiles; picked points are converted back to WGS84 automatically">Amap</button>
  <button class="layer-btn" data-layer="voyager" onclick="switchLayer('voyager')">Color</button>
  <button class="layer-btn" data-layer="standard" onclick="switchLayer('standard')">Standard</button>
  <button class="layer-btn" data-layer="dark" onclick="switchLayer('dark')">Dark</button>
</div>
</div>
<div class="panel">
  <div class="error-banner" id="errorBanner">
    <b>Module not active</b>
    Please check the following:<br>
    1. The WLOC module is installed and enabled<br>
    2. MITM is on and the certificate is trusted<br>
    3. The MITM hostname list includes gs-loc.apple.com<br>
    4. Your current network is going through the proxy
  </div>
  <div class="card">
    <h3>Choose target location</h3>
    <div class="coords" id="coords">Tap the map or use the tools below to choose a location</div>
    <div class="input-row" style="margin-top:10px">
      <label style="font-size:13px;color:var(--gray);display:flex;align-items:center;gap:6px;white-space:nowrap">Jitter radius (m)
        <input id="radiusInput" type="number" min="0" max="5000" step="1" value="0" style="width:80px;flex:none" />
      </label>
      <span style="font-size:11px;color:var(--gray);line-height:1.3">Randomly offsets each fix around the target point. 0 = off</span>
    </div>
    <div class="row">
      <button class="btn btn-primary" id="saveBtn" onclick="save()">Save to device</button>
      <button class="btn btn-secondary" onclick="addFav()">Save favorite</button>
      <button class="btn btn-secondary" onclick="locateMe()">My location</button>
    </div>
  </div>
  <div class="card">
    <div class="fav-header">
      <h3>Favorite locations</h3>
      <button class="btn btn-sm btn-secondary" onclick="clearAllFav()" id="clearAllBtn" style="display:none">Clear all</button>
    </div>
    <div id="favList" class="fav-list"></div>
  </div>
  <div class="card">
    <h3>Active coordinates</h3>
    <div class="active-loc" id="activeLoc">
      <div class="label">Data stored on device (wloc_settings)</div>
      <div class="value" id="activeValue">Loading...</div>
    </div>
    <div class="row">
      <button class="btn btn-sm btn-secondary" onclick="queryActive()">Refresh</button>
      <button class="btn btn-sm btn-danger" onclick="clearActive()">Clear data</button>
    </div>
  </div>
  <div class="card">
    <h3>Paste map link</h3>
    <div class="input-row">
      <input id="urlInput" placeholder="Apple/Google/Amap link or coordinates" />
      <button class="btn btn-secondary" style="flex:none;min-width:56px" onclick="parseUrl()">Parse</button>
    </div>
    <div style="font-size:11px;color:var(--gray);margin-top:6px">Supports Apple Maps · Google Maps · Amap · Baidu · coordinate text</div>
  </div>
  <div class="card">
    <h3>Search place</h3>
    <div class="input-row">
      <input id="searchInput" placeholder="Enter a place name (e.g. Malioboro, Yogyakarta)" />
      <button class="btn btn-secondary" style="flex:none;min-width:56px" onclick="searchPlace()">Search</button>
    </div>
  </div>
  <div class="status" id="status">After choosing a location, tap "Save to device" to write it to the proxy app</div>
</div>
<div class="toast" id="toast"></div>
<div class="modal-overlay" id="favModal">
  <div class="modal">
    <h3>Save this location</h3>
    <input id="favNameInput" placeholder="Enter a label (e.g. Office, Home)" maxlength="30" />
    <div style="font-size:12px;color:var(--gray);margin-bottom:12px;text-align:center" id="favModalCoords"></div>
    <div class="modal-btns">
      <button class="btn btn-secondary" onclick="closeFavModal()">Cancel</button>
      <button class="btn btn-primary" onclick="confirmFav()">Save</button>
    </div>
  </div>
</div>
<script>
if (typeof L === 'undefined') {
  document.getElementById('map').innerHTML =
    '<div style="padding:24px;text-align:center;font-size:14px;color:#8e8e93;line-height:1.6">' +
    'Map library failed to load<br>unpkg.com is unreachable. Check your network or proxy, then refresh<\\/div>';
  throw new Error('leaflet unavailable');
}
${GCJ_BROWSER_JS}
const SAVE_API = 'https://gs-loc.apple.com/wloc-settings/save';
const FAV_KEY = 'wloc_favorites';
// lat/lon 恒为 WGS84 —— 这是写进设备、也是 wloc 唯一认的坐标系。
// 底图可能是 GCJ-02 图源, 屏幕上的经纬度与它并不相等, 换算集中在 toDisplay/
// fromDisplay 两个函数里, 其它地方一律不碰。
let lat = 22.544577, lon = 113.94114;
let selected = false;
let activeLon = null, activeLat = null;
let layerIsGcj = false;

// Amap瓦片画的是 GCJ-02 地物, 而 Leaflet 按 WGS84 算「像素 -> 经纬度」。所以在
// Amap图层上点中的那个读数, 其实是目标点的 GCJ-02 值; 不反算就直接存, 深圳一带
// 会偏 500 米左右 —— 对一个定位工具来说这是致命的。反过来, 要把一个 WGS84 点
// 画在Amap图层上, 得先正算成 GCJ-02, 否则 marker 会落在错误的楼上。
function toDisplay(la, lo) { return layerIsGcj ? wgs84ToGcj02(la, lo) : { lat: la, lon: lo }; }
function fromDisplay(la, lo) { return layerIsGcj ? gcj02ToWgs84(la, lo) : { lat: la, lon: lo }; }

const map = L.map('map').setView([lat, lon], 13);
const tiles = {
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {maxZoom:19, attribution:'ArcGIS'}),
  wgs84: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {maxZoom:19, attribution:'ArcGIS WGS84'}),
  standard: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'\\u00a9 OSM'}),
  dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {maxZoom:19, attribution:'\\u00a9 Carto'}),
  amap: L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {maxZoom:18, subdomains:'1234', attribution:'\\u00a9 Amap'}),
  voyager: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {maxZoom:19, attribution:'\\u00a9 Carto'})
};
let currentLayer = tiles.satellite;
currentLayer.addTo(map);
function switchLayer(name) {
  map.removeLayer(currentLayer);
  currentLayer = tiles[name];
  currentLayer.addTo(map);
  layerIsGcj = (name === 'amap');
  // 底图坐标系变了, 同一个 WGS84 点对应的屏幕位置也就变了, marker 必须重摆,
  // 否则切换图层后它会停在旧图源的像素位置上, 看起来像是坐标被改掉了。
  const d = toDisplay(lat, lon);
  marker.setLatLng([d.lat, d.lon]);
  map.setView([d.lat, d.lon], map.getZoom());
  document.querySelectorAll('.layer-btn').forEach(b => b.classList.toggle('active', b.dataset.layer === name));
}
let marker = L.marker([lat, lon], {draggable:true}).addTo(map);

// 地图交互给出的都是「屏幕坐标系」的读数, 一律先过 fromDisplay 再进 setPos。
marker.on('dragend', e => { const p=e.target.getLatLng(); setPosFromDisplay(p.lat, p.lng); });
map.on('click', e => { setPosFromDisplay(e.latlng.lat, e.latlng.lng); });

function setPosFromDisplay(dLat, dLon) {
  const w = fromDisplay(dLat, dLon);
  setPos(w.lat, w.lon);
}

// 参数恒为 WGS84。
function setPos(newLat, newLon) {
  lat = newLat; lon = newLon; selected = true;
  const d = toDisplay(lat, lon);
  marker.setLatLng([d.lat, d.lon]);
  document.getElementById('coords').textContent = 'Longitude ' + lon.toFixed(6) + '  Latitude ' + lat.toFixed(6);
}

function moveTo(newLat, newLon, zoom) {
  setPos(newLat, newLon);
  const d = toDisplay(lat, lon);
  map.setView([d.lat, d.lon], zoom || 15);
}

function toast(msg, ms) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms || 2500);
}

function showError(show) {
  document.getElementById('errorBanner').style.display = show ? 'block' : 'none';
}

/* ---- Favorites (localStorage) ---- */
function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch(e) { return []; }
}
function saveFavs(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function renderFavs() {
  const favs = getFavs();
  const el = document.getElementById('favList');
  const clearBtn = document.getElementById('clearAllBtn');
  clearBtn.style.display = favs.length ? '' : 'none';
  if (!favs.length) {
    el.innerHTML = '<div class="fav-empty">No favorites yet. After choosing a location, tap "Save favorite"</div>';
    return;
  }
  el.innerHTML = favs.map((f, i) => {
    const isActive = activeLon !== null && Math.abs(f.lon - activeLon) < 0.000001 && Math.abs(f.lat - activeLat) < 0.000001;
    return '<div class="fav-item" onclick="loadFav(' + i + ')">' +
      '<div class="fav-info">' +
        '<div class="fav-name">' + escHtml(f.name) + '<\\/div>' +
        '<div class="fav-coords">' + f.lon.toFixed(6) + ', ' + f.lat.toFixed(6) + '<\\/div>' +
        (isActive ? '<div class="fav-active">\\u2713 Active now<\\/div>' : '') +
      '<\\/div>' +
      '<button class="fav-del" onclick="event.stopPropagation();delFav(' + i + ')" title="Delete">\\u00d7<\\/button>' +
    '<\\/div>';
  }).join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function addFav() {
  if (!selected) { toast('Please choose a location on the map first'); return; }
  document.getElementById('favModalCoords').textContent = lon.toFixed(6) + ', ' + lat.toFixed(6);
  document.getElementById('favNameInput').value = '';
  document.getElementById('favModal').classList.add('show');
  setTimeout(() => document.getElementById('favNameInput').focus(), 100);
}

function closeFavModal() {
  document.getElementById('favModal').classList.remove('show');
}

function confirmFav() {
  const name = document.getElementById('favNameInput').value.trim();
  if (!name) { toast('Please enter a label'); return; }
  const favs = getFavs();
  favs.push({ name, lon, lat, time: new Date().toISOString() });
  saveFavs(favs);
  closeFavModal();
  renderFavs();
  toast('Saved to favorites: ' + name);
}

function loadFav(i) {
  const favs = getFavs();
  if (!favs[i]) return;
  moveTo(favs[i].lat, favs[i].lon, 15);
  toast(favs[i].name + ' (' + favs[i].lon.toFixed(4) + ', ' + favs[i].lat.toFixed(4) + ')');
}

function delFav(i) {
  const favs = getFavs();
  if (!favs[i]) return;
  const name = favs[i].name;
  favs.splice(i, 1);
  saveFavs(favs);
  renderFavs();
  toast('Deleted: ' + name);
}

function clearAllFav() {
  if (!confirm('Clear all favorites?')) return;
  saveFavs([]);
  renderFavs();
  toast('All favorites cleared');
}

/* ---- Active location query ---- */
function queryActive() {
  const el = document.getElementById('activeValue');
  el.textContent = 'Loading...';
  fetch(SAVE_API + '?action=query', { method:'GET', mode:'cors', cache:'no-store' })
    .then(r => r.json())
    .then(d => {
      if (d.success && d.longitude && d.latitude) {
        activeLon = parseFloat(d.longitude);
        activeLat = parseFloat(d.latitude);
        const rr = d.randomRadius || 0;
        el.textContent = 'Longitude ' + activeLon.toFixed(6) + '  Latitude ' + activeLat.toFixed(6) + (d.accuracy ? '  Accuracy ' + d.accuracy + 'm' : '') + (rr ? '  Jitter ' + rr + 'm' : '');
        document.getElementById('radiusInput').value = rr;
        renderFavs();
      } else {
        activeLon = null; activeLat = null;
        el.textContent = 'No saved coordinates';
        renderFavs();
      }
    })
    .catch(() => {
      el.textContent = 'Query failed (requires the proxy module)';
    });
}

function clearActive() {
  if (!confirm('Clear the coordinates saved on this device? Afterwards the module default parameters will be used, or location modification will stop.')) return;
  fetch(SAVE_API + '?action=clear', { method:'GET', mode:'cors', cache:'no-store' })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        activeLon = null; activeLat = null;
        document.getElementById('activeValue').textContent = 'Cleared';
        renderFavs();
        toast('Device coordinates cleared');
      } else { toast('Clear failed: ' + (d.error || ''), 3000); }
    })
    .catch(() => { toast('Clear failed - check the module configuration', 3000); });
}

/* ---- Save to device ---- */
async function save() {
  if (!selected) { toast('Please choose a location on the map first'); return; }
  const btn = document.getElementById('saveBtn');
  btn.textContent = 'Saving...'; btn.disabled = true;
  showError(false);
  try {
    const radius = parseInt(document.getElementById('radiusInput').value) || 0;
    const r = await fetch(SAVE_API + '?lon=' + lon + '&lat=' + lat + '&acc=25&randomRadius=' + radius, {
      method: 'GET', mode: 'cors', cache: 'no-store'
    });
    const d = await r.json();
    if (d.success) {
      activeLon = lon; activeLat = lat;
      btn.textContent = '\\u2713 Saved'; btn.className = 'btn btn-primary success';
      document.getElementById('status').textContent = '\\u2713 Written: ' + lon.toFixed(6) + ', ' + lat.toFixed(6) + ' \\u00b7 ' + new Date().toLocaleTimeString('en-GB');
      document.getElementById('activeValue').textContent = 'Longitude ' + lon.toFixed(6) + '  Latitude ' + lat.toFixed(6) + '  Accuracy 25m';
      renderFavs();
      toast('\\u2713 Coordinates written to device. Takes effect on the next location update');
      setTimeout(() => { btn.textContent='Save to device'; btn.className='btn btn-primary'; btn.disabled=false; }, 2500);
    } else {
      throw new Error(d.error || 'Write failed');
    }
  } catch(e) {
    btn.textContent = 'Save to device'; btn.className = 'btn btn-primary'; btn.disabled = false;
    showError(true);
    toast('\\u2717 Save failed - check the module configuration', 4000);
  }
}

function locateMe() {
  if (!navigator.geolocation) return toast('This browser does not support geolocation');
  toast('Getting location...');
  navigator.geolocation.getCurrentPosition(
    pos => { moveTo(pos.coords.latitude, pos.coords.longitude, 16); toast('Got current location'); },
    err => toast('Location failed: ' + err.message, 3000),
    { enableHighAccuracy:true, timeout:10000 }
  );
}

function parseMapUrl(text) {
  let m;
  m = text.match(/ll=([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  m = text.match(/@([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  m = text.match(/lnglat=([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[2]), lon: parseFloat(m[1]) };
  m = text.match(/(?:location|center)=([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[2]), lon: parseFloat(m[1]) };
  m = text.match(/(-?[0-9]+\\.[0-9]+)[,\\s]+(-?[0-9]+\\.[0-9]+)/);
  if (m) {
    const a = parseFloat(m[1]), b = parseFloat(m[2]);
    // 纬度绝对值不超过 90, 经度可达 180: 按绝对值判断谁是经度, 否则
    // -122.009 这类西经会被当成纬度 (-122 < 90 恒成立)。
    if (Math.abs(a) <= 90 && Math.abs(b) > 90) return { lat: a, lon: b };
    if (Math.abs(b) <= 90 && Math.abs(a) > 90) return { lat: b, lon: a };
    return { lat: a, lon: b };
  }
  return null;
}

// 含链接的输入交给服务端 /api/parse: 浏览器读不到跨域 302 的 Location 头, 短链
// 只能由 worker 展开; 服务端还认 coordinate= 并按来源做 GCJ-02->WGS84 换算。
// 纯坐标文本本地直接解析 —— 它也是唯一不需要坐标系换算的输入, 免去一次往返。
async function parseUrl() {
  const input = document.getElementById('urlInput').value.trim();
  if (!input) return toast('Please paste a map link or coordinates');

  const low = input.toLowerCase();
  if (low.includes('http://') || low.includes('https://')) {
    toast('Parsing...');
    let data;
    try {
      const r = await fetch('/api/parse?format=json&u=' + encodeURIComponent(input));
      data = await r.json();
    } catch (e) {
      toast('Parse service unreachable', 3000);
      return;
    }
    if (!data || data.error || typeof data.lat !== 'number') {
      toast(data && data.error ? data.error : 'Could not parse coordinates. Check the link format', 3000);
      return;
    }
    moveTo(data.lat, data.lon, 15);
    toast(data.name ? 'Parsed: ' + data.name : 'Parsed: ' + data.lon.toFixed(4) + ', ' + data.lat.toFixed(4));
    return;
  }

  const result = parseMapUrl(input);
  if (!result) { toast('Could not parse coordinates. Check the link format', 3000); return; }
  moveTo(result.lat, result.lon, 15);
  toast('Parsed: ' + result.lon.toFixed(4) + ', ' + result.lat.toFixed(4));
}

async function searchPlace() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) return toast('Please enter a place name');
  toast('Searching...');
  try {
    const r = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(q));
    const results = await r.json();
    if (!results.length) { toast('Not found: ' + q, 3000); return; }
    const p = results[0];
    moveTo(parseFloat(p.lat), parseFloat(p.lon), 15);
    toast(p.display_name.slice(0, 40));
  } catch(e) { toast('Search failed', 3000); }
}

document.addEventListener('paste', e => {
  const text = (e.clipboardData||window.clipboardData).getData('text');
  if (!text) return;
  if (!(text.includes('map') || text.includes('loc') || text.includes('lnglat') || /[0-9]+\\.[0-9]+/.test(text))) return;
  const input = document.getElementById('urlInput');
  // 粘贴目标本来就是这个输入框时, 让浏览器原生插入即可; 此处再赋一次值,
  // 原生插入会叠加在后面, 结果是同一段文本出现两遍。
  if (e.target !== input) input.value = text;
  setTimeout(parseUrl, 200);
});
document.getElementById('searchInput').addEventListener('keydown', e => { if(e.key==='Enter') searchPlace(); });
document.getElementById('urlInput').addEventListener('keydown', e => { if(e.key==='Enter') parseUrl(); });
document.getElementById('favNameInput').addEventListener('keydown', e => { if(e.key==='Enter') confirmFav(); });

renderFavs();
queryActive();
<\/script>
</body>
</html>`;
}
