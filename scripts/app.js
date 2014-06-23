(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("app", function(exports, require, module) {
var Erdapfel, createGrid, globe, slider,
  _this = this;

window.cg = createGrid = function() {
  return document.body.appendChild(document.createElement('script')).src = 'http://peol.github.io/960gridder/releases/1.3.1/960.gridder.js';
};

slider = new SimpleSlider(document.getElementById('slider'), {
  autoPlay: true,
  transitionDelay: 10,
  transitionDuration: 1,
  transitionProperty: 'opacity',
  startValue: 0,
  visibleValue: 1,
  endValue: 0
});

$('.slide-button').on('click', function(e) {
  var value;
  value = $(e.currentTarget).data('value');
  slider.change(value);
  $('.slide-button').removeClass('active');
  return $(e.currentTarget).addClass('active');
});

var map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([40, 10], 4);
var featureLayer = L.mapbox.featureLayer().addTo(map);

featureLayer.on('layeradd', function(e) {
  var marker = e.layer,
      feature = marker.feature;

  marker.setIcon(L.icon(feature.properties.icon));
});
featureLayer.loadURL('/data/countries.geojson');


Erdapfel = require('erdapfel');

// window.globe = globe = new Erdapfel('map', {
//   width: 700,
//   height: 700,
//   radius: 200,
//   noZoom: true,
//   cameraPositionZ: 500,
//   texture: 'images/NE.jpg'
// });

$.getJSON('data/countries.geojson', function(data) {
  var element, feature, lat, lng, _i, _len, _ref, _ref1, _results;
  _ref = data.features;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    feature = _ref[_i];
    _ref1 = feature.geometry.coordinates, lng = _ref1[0], lat = _ref1[1];
    element = globe.addElement(lat, lng);
    _results.push(globe.addLabel(element, feature.properties.title));
  }
  return _results;
});

});

;require.register("erdapfel", function(exports, require, module) {
var Erdapfel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Erdapfel = (function() {
  Erdapfel.prototype.labels = [];

  function Erdapfel(container, options) {
    this.onWindowResize = __bind(this.onWindowResize, this);
    this.distance = __bind(this.distance, this);
    this.toXYCoords = __bind(this.toXYCoords, this);
    this.handleLabels = __bind(this.handleLabels, this);
    this.render = __bind(this.render, this);
    this.animate = __bind(this.animate, this);
    this.addLabel = __bind(this.addLabel, this);
    this.addElement = __bind(this.addElement, this);
    this.addGlobe = __bind(this.addGlobe, this);
    var _this = this;
    this.options = options;
    this.width = options.width;
    this.height = options.height;
    this.radius = options.radius;
    this.container = document.getElementById(container);
    this.projector = new THREE.Projector();
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 1, 10000);
    this.camera.position.z = options.cameraPositionZ;
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.addEventListener('change', this.render);
    this.controls.noZoom = options.noZoom;
    this.controls.autoRotate = true;
    this.scene = new THREE.Scene();
    this.group = new THREE.Object3D();
    this.scene.add(this.group);
    this.addGlobe();
    this.renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onWindowResize, false);
    this.container.onclick = function(event) {
      return _this.controls.autoRotate = false;
    };
    this.animate();
  }

  Erdapfel.prototype.addGlobe = function() {
    var loader, texture,
      _this = this;
    texture = this.options.texture;
    loader = new THREE.TextureLoader();
    return loader.load(texture, function(texture) {
      var geometry, material, mesh;
      geometry = new THREE.SphereGeometry(_this.radius, 32, 32);
      material = new THREE.MeshBasicMaterial({
        map: texture,
        overdraw: 0.5
      });
      mesh = new THREE.Mesh(geometry, material);
      return _this.group.add(mesh);
    });
  };

  Erdapfel.prototype.addElement = function(lat, lon) {
    var material, mesh, sphere, x, y, z, _ref;
    sphere = new THREE.SphereGeometry(2);
    material = new THREE.MeshBasicMaterial({
      color: 0xFF0000
    });
    mesh = new THREE.Mesh(sphere, material);
    _ref = this.latLongToVector3(lat, lon, this.radius), x = _ref[0], y = _ref[1], z = _ref[2];
    mesh.position.set(x, y, z);
    this.group.add(mesh);
    return mesh;
  };

  Erdapfel.prototype.addLabel = function(mesh, html) {
    var element, label;
    element = document.createElement('div');
    element.setAttribute("class", "erdepfel-label");
    element.innerHTML = html;
    document.getElementById("labels").appendChild(element);
    label = {
      mesh: mesh,
      element: element
    };
    this.labels.push(label);
    return label;
  };

  Erdapfel.prototype.animate = function() {
    requestAnimationFrame(this.animate);
    this.render();
    return this.controls.update();
  };

  Erdapfel.prototype.render = function() {
    this.renderer.render(this.scene, this.camera);
    return this.handleLabels();
  };

  Erdapfel.prototype.handleLabels = function() {
    var L, i, label, lx, ly, mesh, vector, _results;
    i = 0;
    _results = [];
    while (i < this.labels.length) {
      label = this.labels[i];
      mesh = label.mesh;
      vector = this.toXYCoords(mesh.position, this.camera, this.container);
      lx = vector.x + 5;
      ly = vector.y;
      label.element.style.left = lx + "px";
      label.element.style.top = ly + "px";
      L = this.distance(mesh.position, this.camera.position);
      label.element.style.display = L > this.options.cameraPositionZ ? 'none' : 'block';
      _results.push(i++);
    }
    return _results;
  };

  Erdapfel.prototype.latLongToVector3 = function(lat, lon, radius) {
    var phi, theta, x, y, z;
    phi = lat * Math.PI / 180;
    theta = (lon - 180) * Math.PI / 180;
    x = -radius * Math.cos(phi) * Math.cos(theta);
    y = radius * Math.sin(phi);
    z = radius * Math.cos(phi) * Math.sin(theta);
    return [x, y, z];
  };

  Erdapfel.prototype.toXYCoords = function(position, camera) {
    var vector;
    vector = this.projector.projectVector(position.clone(), camera);
    vector.x = (vector.x + 1) / 2 * this.container.clientWidth;
    vector.y = -(vector.y - 1) / 2 * this.container.clientHeight;
    return vector;
  };

  Erdapfel.prototype.distance = function(position1, position2) {
    return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2) + Math.pow(position1.z - position2.z, 2));
  };

  Erdapfel.prototype.onWindowResize = function() {
    var windowHalfX, windowHalfY;
    windowHalfX = this.width / 2;
    windowHalfY = this.height / 2;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    return this.render();
  };

  return Erdapfel;

})();

});

;