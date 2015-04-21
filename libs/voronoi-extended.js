var Voronoi = require('voronoi');

var _compute = Voronoi.prototype.compute;
Voronoi.prototype.compute = function(sites, bbox, relax) {
    var diagram = _compute.apply(this, arguments);
    enrich(diagram);

    while(relax --) {
        diagram = _compute.call(this, getCentroids(diagram), bbox);
        enrich(diagram);
    }

    return diagram;
}

function getCentroids(diagram) {
    var cells = diagram.cells, 
        cellsCount = cells.length, 
        centroids = [];

    while(cellsCount --) {
        centroids.push(cells[cellsCount].centroid);
    }

    return centroids;
}

function enrich(diagram) {
    var cells = diagram.cells, 
        cellsCount = cells.length, 
        centroids = [];

    while(cellsCount --) {
        setArea(cells[cellsCount]);
        setCentroid(cells[cellsCount]);
    }
}

setArea = function(cell) {
    var halfedges = cell.halfedges;
    var length = halfedges.length;
    if (length > 2) {
        cell.vertices = [];
        for (var j = 0; j < length; j++) {
            v = halfedges[j].getEndpoint();
            cell.vertices.push({x: v.x, y: v.y});
        }

        var area = 0;
        var j = cell.vertices.length - 1;
        var p1; var p2;

        for (var i = 0; i < cell.vertices.length; j = i++) {
          p1 = cell.vertices[i]; p2 = cell.vertices[j];
          area += p1.x * p2.y;
          area -= p1.y * p2.x;
        }
        
        area /= 2;
        cell.area = area;
    }
}

setCentroid = function(cell) {
    var halfedges = cell.halfedges;
    var length = halfedges.length;
    
    if (length > 2) {
        var x = 0; 
        var y = 0;
        var f;
        var j = cell.vertices.length -1;
        var p1; var p2;

        for (var i = 0; i < cell.vertices.length; j = i++) {
          p1 = cell.vertices[i]; p2 = cell.vertices[j];
          f = p1.x * p2.y - p2.x * p1.y;
          x += (p1.x + p2.x) * f;
          y += (p1.y + p2.y) *f;
        }

        f = cell.area * 6;
        cell.centroid = {x: x/f, y: y/f};
    }
}

module.exports = Voronoi;