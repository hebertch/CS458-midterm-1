'use strict';

angular.module('userApp.controllers', [])
    .controller("myCtrl", function ($scope) {
        $scope.name = '';
        $scope.fileName = null;
        $scope.files = [{
                name: 'Teachers',
                wordcount: 8516,
                value: 'teacher'
            },
            {
                name: 'Rosetta',
                wordcount: 9384,
                value: 'rosetta'
            }
        ];
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
            // var parent = document.getElementById("main");
            if (flag) {
                document.getElementById("svg_id").innerHTML = '';
            }
            $scope.selectedFile = data;
            var file = 'csv/' + data + $scope.selectedType + '.csv';
            loadVisual(file);
            flag = true;

        }

        function loadVisual(file) {
            if ($scope.chart === 'bubble') {


                var svg = d3.select("svg").attr("id", "svg_id"),
                    width = +svg.attr("width"),
                    height = +svg.attr("height");

                var format = d3.format(",d");

                var color = d3.scaleOrdinal(d3.schemeCategory20c);

                var pack = d3.pack()
                    .size([width, height])
                    .padding(1.5);

                d3.csv(file, function (d) {
                    d.value = +d.value;
                    if (d.value) return d;
                }, function (error, classes) {
                    if (error) throw error;

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

                });


            } else {
                const data = ["I", "II", "III"];

                const nameScale = d3.scaleOrdinal()
                  .domain(data)
                  .range(["Jan", "Feb", "Mar"]);
              
                const widthScale = d3.scaleOrdinal()
                  .domain(data)
                  .range([300, 100, 900]);
              
                const color = d3.scaleOrdinal(d3.schemeCategory10);
              
                d3.select("body")
                  .selectAll("div")
                  .data(data)
                  .enter()
                  .append("div")
                  .text(nameScale)
                  .style("width", d => widthScale(d) + "px")
                  .style("background-color", color);
            }
        }
    });