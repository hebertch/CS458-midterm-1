'use strict';

function append_html(elt, eltsAndStrings) {
    if (eltsAndStrings) {
	if (eltsAndStrings instanceof HTMLElement) {
	    elt.appendChild(eltsAndStrings);
	} else if (typeof(eltsAndStrings) === "string") {
	    elt.innerHTML += eltsAndStrings;
	} else {
	    for (var i = 0; i < eltsAndStrings.length; i++) {
		var x = eltsAndStrings[i];
		if (typeof(x) === "string") {
		    elt.innerHTML += x;
		} else {
		    elt.appendChild(x);
		}
	    }
	}
    }
}

function e(type, eltsAndStrings) {
    var elt = document.createElement(type);
    append_html(elt, eltsAndStrings);
    return elt;
}
function add_elements(eltsAndStrings) { 
    append_html(document.body, eltsAndStrings);
}

function e_table_row(elts) {
    var r = e("tr");
    for (var j = 0; j < elts.length; j++) {
	var d = e("td");
	append_html(d, elts[j]);
	r.appendChild(d);
    }
    return r;
}

function e_table(rows, has_border) {
    var t = e("table");
    for (var i = 0; i < rows.length; i++)
	t.appendChild(e_table_row(rows[i]));
    if (has_border) {
	t.border = '1';
    }
    return t;
}

function e_button(name, f) {
    var b = e("button", name);
    if (f) b.onclick = f;
    return b;
}

function e_range(value, min, max) {
    var x = e("input");
    x.type = "range";
    x.min = min;
    x.max = max;
    x.value = value;
    return x;
}

function e_select(options, value) {
    var elt = e("select");
    for (var i = 0; i < options.length; i++) {
	var c = e("option", options[i]);
	c.value = options[i];
	if (value == c.value) c.selected = "selected";
	elt.appendChild(c);
    }
    return elt;
}

function e_number(value, min, max, step) {
    var n = e("input");
    n.type = "number";
    n.min = min;
    n.max = max;
    n.step = step ? step : 1;
    n.value = value;
    return n;
}

function e_dlist(defs) {
    var elt = e("dl");
    for (var i = 0; i < defs.length; i++) {
	if (typeof(defs[i]) === "string") {
	    elt.appendChild(e("dt", defs[i]));
	} else {
	    elt.appendChild(e("dt", defs[i][0]));
	    elt.appendChild(e("dd", defs[i][1]));
	}
    }
    return elt;
}

function e_olist(defs) {
    var elt = e("ol");
    for (var i = 0; i < defs.length; i++) {
	elt.appendChild(e("li", defs[i]));
    }
    return elt;
}

function e_ulist(defs) {
    var elt = e("ul");
    for (var i = 0; i < defs.length; i++) {
	elt.appendChild(e("li", defs[i]));
    }
    return elt;
}

function e_form(html, action, method) {
    var f = e("form", html);
    if (action) f.action = action;
    if (method) f.method = method;
    return f;
}

function e_img(src, alt, width, height) {
    var i = e("img");
    i.src = src;
    i.alt = alt ? alt : src;
    if (width) i.width = width;
    if (height) i.height = height;
    return i;
}

function e_iframe(src) { 
    var i = e("iframe");
    i.src = src;
    return i;
}

function escape_html_str(str) { return "&" + str + ";"; }
var tab_str = escape_html_str("emsp");
function e_div(eltsAndStrings) { return e("div", eltsAndStrings); }
function e_br() { return e("br"); }

function e_a(href, eltsAndStrings) {
	var elt = e("a", eltsAndStrings);
	elt.href = href;
	return elt;
}

function e_canvas(width, height) {
    width = width || 100;
    height = height || 100;
    var elt = e("canvas", [])
    elt.width = width;
    elt.height = height;
    return elt;
}

function set_props(e, props) {
    for (var key in props) {
	// skip loop if the property is from prototype
	if (!props.hasOwnProperty(key)) continue;
	e[key] = props[key];
    }
    return e;
}

var v = function(x, y) {
    return {x:x, y:y};
}
var rect = function (x, y, w, h) {
    return { x:x, y:y, w:w, h:h };
}
var rect_from_pos_and_dims = function(p, d) {
    return rect(p.x, p.y, d.x, d.y);
}
var rect_from_corners = function(p1, p2) {
    var x_left = Math.min(p1.x, p2.x);
    var x_right = Math.max(p1.x, p2.x);
    var y_top = Math.min(p1.y, p2.y);
    var y_bottom = Math.max(p1.y, p2.y);
    return rect(x_left, y_top, x_right - x_left, y_bottom - y_top);
}
var rect_right = function(r) { return r.x + r.w; }
var rect_bottom = function(r) { return r.y + r.h; }
var rect_center = function(r) { return pos(r.x + r.w/2, r.y + r.h/2); }
var rect_centered = function(r) {
    var c = rect_center(r);
    return rect(r.x-c.x, r.y-c.y, r.w, r.h);
}

var pad_rect = function(r, pad_dims) {
    return rect(r.x - pad_dims.w, r.y - pad_dims.h, r.w + pad_dims.w*2, r.h + pad_dims.h*2);
}

var BgColor = 'black', FgColor = 'white';
var Canvas, Ctx;
var screen_rect = function () {
    return rect(0, 0, Canvas.width, Canvas.height);
}

var stroke_or_fill = function(color, is_outline) {
    if (is_outline) {
	Ctx.strokeStyle = color;
	Ctx.stroke();	
    } else {
	Ctx.fillStyle = color;
	Ctx.fill();
    }
}

var draw_rect = function (r, color, is_outline) {
    Ctx.beginPath();
    Ctx.rect(r.x, r.y, r.w, r.h);
    stroke_or_fill(color, is_outline);
    return r;
}

var draw_text = function(text, p, color) {
    Ctx.fillStyle = color;
    Ctx.fillText(text, p.x, p.y);
}

var draw_text_rotated = function(text, p, color, align) {
    Ctx.save();
    Ctx.translate(p.x + 12, p.y + 5);
    Ctx.rotate(-Math.PI/2);
    Ctx.textAlign = align;
    Ctx.fillStyle = color;
    Ctx.fillText(text, 0, 0);
    Ctx.restore();
}

var draw_line = function(p1, p2, color) {
    Ctx.strokeStyle = color;
    Ctx.moveTo(p1.x, p1.y);
    Ctx.lineTo(p2.x, p2.y);
    Ctx.stroke();
    return rect_from_corners(p1, p2);
}

var draw_circle = function(p, radius, color, is_outline) {
    Ctx.beginPath();
    Ctx.arc(p.x, p.y, radius, 0, 2*Math.PI);
    stroke_or_fill(color, is_outline);
    return rect(p.x - radius, p.y - radius, radius*2, radius*2);
}

// Draw a bar chart from points starting at pos
var draw_bar_chart = function(chart_rect, data_points, max) {
    var w = chart_rect.w / data_points.length;
    var left = chart_rect.x + 50;
    var bottom = rect_bottom(chart_rect) + 50;
    for (var i = 0; i < data_points.length; ++i) {
	var data_point = data_points[i];
	var x = left + w*i;
	var h = data_point.value * chart_rect.h / max;
	var y = bottom - h;
	var r = rect(x, y, w, h);
	var color = FgColor;
	draw_rect(r, color, false);
	draw_text_rotated(data_point.label, v(x, bottom), FgColor, 'right');
	draw_text_rotated(data_point.value, v(x, y - 10), FgColor, 'left');
    }

    // Draw Axis
    draw_rect(rect(chart_rect.x + 25, 0, 3, chart_rect.h + 50), FgColor, false);
    draw_rect(rect(chart_rect.x + 25, chart_rect.y + 50, 10, 1), FgColor, false);
    draw_text(max, v(chart_rect.x, chart_rect.y + 50), FgColor);
    var increment = Math.max(1, Math.floor(max / 100) * 10);
    for (var i = 0; i < max; i += increment) {
	var y = bottom - (i*chart_rect.h / max);
	var r = rect(chart_rect.x + 25, y, 10, 1);
	draw_rect(r, FgColor, false);
	draw_text(i, v(chart_rect.x, y), FgColor);
    }
}

var setup_canvas_context = function() {
    Ctx = Canvas.getContext("2d");
    Ctx.font = '12px sans-serif';
}

var remove = function(arr, item) {
    return arr.filter(function(a) { return a !== item; });
}

var FileUpload, SelectedFileName, Reader = new FileReader;

var file_selected = function() {
    SelectedFileName.innerHTML = 'Name: ' + FileUpload.files[0].name;
}

var update_bar_chart = function(db_entry) {
    var width = 1950;
    var parsed_points = [];
    for (var word in db_entry) {
	parsed_points.push({label: word, value: db_entry[word]});
    }
    //var data_points = parsed_points.map(function(data) { return {label: data.id, value: data.value}; });
    var data_points = parsed_points.filter(function(data) { return data.value; });
    data_points.sort(function (a, b) { return b.value - a.value; });

    draw_rect(rect(0, 0, Canvas.width, Canvas.height), BgColor, false);
    var max = data_points[0].value;
    draw_bar_chart(rect(0, 0, width, 300), data_points, max);
}

var CurrentCSVText;

angular.module('userApp.controllers', [])
    .controller("myCtrl", function ($scope, fileService) {
	Canvas = document.getElementById('canvas');
	setup_canvas_context();

	getData();

        $scope.name = '';
        $scope.fileName = null;
        $scope.files = [];
        // [{
        //         name: 'Teachers',
        //         wordcount: 8516,
        //         value: 'teacher'
        //     },
        //     {
        //         name: 'Rosetta',
        //         wordcount: 9384,
        //         value: 'rosetta'
        //     }
        // ];
        toastr.options = {
            "positionClass": "toast-bottom-right",
            "preventDuplicates": true,
            "preventOpenDuplicates": true
        };
        $scope.selectedType = 'Words';
        $scope.selectedFile = 'teacher';
        $scope.chart = 'bubble'
        $scope.submit = function () {
            uploadFile();
        }
        var flag = false;
        $scope.updateVisual = function (data) {
            console.log($scope.files);
	    console.log(data)
	    $scope.selectedFile = data;
            // var parent = document.getElementById("main");
            if (flag) {
                document.getElementById("svg_id").innerHTML = '';
            }
	    if ($scope.selectedType === 'Words') {
		update_bar_chart(data.words);
		loadVisual(data.words);
	    } else {
		update_bar_chart(data.bigrams);
		loadVisual(data.bigrams);
	    }
            flag = true;

        }

        function loadVisual(data) {
	    var classes = [];
	    for (var d in data) {
		classes.push({id: d, value: data[d]});
	    }


            var svg = d3.select("svg").attr("id", "svg_id"),
                width = +svg.attr("width"),
                height = +svg.attr("height");

            var format = d3.format(",d");

            var color = d3.scaleOrdinal(d3.schemeCategory20c);

            var pack = d3.pack()
                .size([width, height])
                .padding(1.5);


            var root = d3.hierarchy({
                children: classes
            })
                .sum(function (d) {
                    return d.value;
                })
                .each(function (d) {
                    if (id = d.data.id) {
                        var id, i = id.lastIndexOf(".");
                        d.id = id;
                        d.package = id.slice(0, i);
                        d.class = id.slice(i + 1);
                    }
                });

            var node = svg.selectAll(".node")
                .data(pack(root).leaves())
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            node.attr("class", "remove");

            // makes circles
            node.append("circle")
                .attr("id", function (d) {
                    return d.id;
                })
                .attr("value", function (d) {
                    return d.value;
                })
                .attr("r", function (d) {
                    return d.r;
                })
                .style("fill", function (d) {
                    return color(d.package);
                });

            // prevents text overflow
            node.append("clipPath")
                .attr("id", function (d) {
                    return "clip-" + d.id;
                })
                .append("use")
                .attr("xlink:href", function (d) {
                    return "#" + d.id;
                });
            node.append("title")
                .text(function (d) {
                    return d.id + "\n" + format(d.value);
                });
            node.append("text")
                .attr("clip-path", function (d) {
                    return "url(#clip-" + d.id + d.value + ")";
                })
                .attr("class", "enter")
                .selectAll("tspan")
                .data(function (d) {
                    return d.class.split(/(?=[A-Z][^A-Z])/g);
                })
                .enter().append("tspan")
                .attr("x", 0)
                .attr("y", function (d, i, nodes) {
                    return 13 + (i - nodes.length / 2 - 0.5) * 10;
                })
                .merge(node)
                .text(function (d) {
                    return d;
                });
            node.exit().remove();
        }

        function getData() {
            return new Promise((resolve, reject) => {
                var data = fileService.get()
                setTimeout(function() {
                    //console.log($scope.files);
                    $scope.files = data.value.data
                    // console.log(data.value.data);
                    //console.log($scope.files);
                    
                    resolve( data.value.data);
                }, 800);
                // 
                // console.log(data);
                // resolve(data);
                
            });
           
            
        }

    });
