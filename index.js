var express = require('express'), 
    Voronoi = require('./libs/voronoi-extended'), 
    VoronoiRenderer = require('./renderers/voronoi'), 
    MersenneTwister = require('mersennetwister');

var app = express();

app.get('/', function (req, res, next) {

  var voronoi = new Voronoi();
  var bbox = {xl: 0, xr: 800, yt: 0, yb: 600};
  var sites = [];
  var siteCount = 1000;
  var mt = new MersenneTwister();
  var relax = 5;
  while(siteCount --) {
    sites.push({x: mt.rnd() * bbox.xr, y: mt.rnd() * bbox.yb});
  }
  
  var diagram = voronoi.compute(sites, bbox, relax);
  res.bbox = bbox;
  res.diagram = diagram;
  next();

}, VoronoiRenderer.render);

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});