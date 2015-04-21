var cheerio = require('cheerio');

var makeImage = function(bbox, diagram) {
    var $ = cheerio.load('<svg></svg>'), 
        image = $('svg'), 
        width = Math.abs(bbox.xl - bbox.xr), 
        height = Math.abs(bbox.yt - bbox.yb);

    image.attr('xmlns', 'http://www.w3.org/2000/svg');
    image.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    image.attr('version', '1.1');
    image.attr('width', width);
    image.attr('height', height);
    image.attr('viewBox', '0 0 ' + width + ' ' + height);

    for(var c = 0; c < diagram.cells.length; c ++) {
        var cell = diagram.cells[c];

        if(cell.halfedges.length == 0) {
            continue;
        }

        var path = $('<path/>');

        var d = 'M ' + cell.halfedges[0].edge.va.x + ',' + cell.halfedges[0].edge.va.y + 
                ' L ' + cell.halfedges[0].edge.vb.x + ',' + cell.halfedges[0].edge.vb.y;

        for(var h = 1; h < cell.halfedges.length; h ++) {
            d += " M " + cell.halfedges[h].edge.va.x + "," + cell.halfedges[h].edge.va.y;
            d += " L " + cell.halfedges[h].edge.vb.x + "," + cell.halfedges[h].edge.vb.y;
        }

        d += " Z";

        path.attr('d', d);
        path.attr('stroke', '#cccccc');
        path.attr('fill', '#ffffff');
        image.append(path);
    }

    return $.html();
}

exports.render = function(req, res) {
    var body = [
        '<?xml version="1.0" encoding="utf-8"?>', 
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', 
        makeImage(res.bbox, res.diagram)
    ].join('');

    res.charset = 'UTF-8';
    res.set({
        'Content-Type': 'image/svg+xml', 
        'Accept-Ranges': 'bytes', 
        'Content-Length': Buffer.byteLength(body, 'utf-8'), 
        'Connection': 'close'
    });
    
    res.end(body, 'binary');
}