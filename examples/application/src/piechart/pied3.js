/**
 * Created by guntars on 23/10/14.
 */
define([
    'd3',
    'watch'
], function (d3, WatchJS) {
    var watch = WatchJS.watch;
    var color = d3.scale.category20();

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.population;
        });

    function Pie() {

    }

    Pie.prototype.start = function (node, data) {

        this.el = node.el;
        this.data = data.data;
        setTimeout(function () {
            this.draw()

        }.bind(this), 100);
        watch(data, 'data', function () {
            this.redraw(data.data);
        }.bind(this))

    }
    Pie.prototype.draw = function () {
        var width = this.el.offsetWidth,
            height = this.el.offsetHeight,
            radius = Math.min(width, height) / 2;

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 60);

        this.arcTween = function (a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }

        this.arcText = function (a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return "translate(" + arc.centroid(i(t)) + ")";
            }
        }


        this.svg = d3.select(this.el).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        this.g = this.svg.selectAll(".arc")
            .data(pie(this.data))
            .enter()
            .append("g")
            .attr("class", "arc");

        this.g.append("path")
            .attr("d", arc)
            .style("fill", function (d, i) {
                return color(i);
            }).each(function (d) {
                this._current = d;
            });

        this.g.append("text")
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "#ffffff")
            .text(function (d) {
                return d.data.age;
            }).each(function (d) {
                this._current = d;
            });

    }
    Pie.prototype.redraw = function (data) {
        this.data = data;
        this.g.data(pie(this.data));

        var path = this.g.select('path'),
            text = this.g.select('text');

        text.text(function (d) {
            return d.data.age;
        });

        text.transition().duration(750).attrTween("transform", this.arcText);
        path.transition().duration(750).attrTween("d", this.arcTween);

    }
    return Pie;
});