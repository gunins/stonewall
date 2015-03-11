define([
    'd3',
], function (d3) {
    var parseDate = d3.time.format('%d-%b-%y').parse,
        margin = {
            top: 20,
            left: 40,
            right: 0,
            bottom: 30
        },
        width,
        height,
        x,
        y,
        xAxis,
        yAxis,
        line,
        giveMeEmpty;

    function getSmoothInterpolation(data) {
        return function () {
            var interpolate = d3.scale.linear()
                .domain([0, 1])
                .range([1, data.length + 1]);

            return function (t) {
                var flooredX = Math.floor(interpolate(t));
                var interpolatedLine = data.slice(0, flooredX);

                return line(interpolatedLine);
            }
        }
    }

    function extent(data) {
        x.domain(d3.extent(data, function (d) {
            return d.id;
        }));

        y.domain(d3.extent(data, function (d) {
            return d.val;
        }));
    }

    function Chart(node) {
    }

    Chart.prototype.start = function (node, data) {
        this.el = node.el;
        this.draw(data)
    }
    Chart.prototype.draw = function (data) {

        width = this.el.offsetWidth - margin.left - margin.right;
        height = this.el.offsetHeight - margin.top - margin.bottom;

        x = d3.scale.linear()
            .range([0, width - 40]);

        y = d3.scale.linear()
            .range([height, 0]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        line = d3.svg.line()
            .x(function (d) {
                return x(d.id);
            })
            .y(function (d) {
                return y(d.val);
            });

        giveMeEmpty = d3.svg.line()
            .x(0)
            .y(0);

        this.svg = d3.select(this.el).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        if (data !== undefined) {
            this.render(data);
        }
    }
    Chart.prototype.render = function (obj) {
        var data = obj.data;
        extent(data);

        this.xAxis = this.svg.append('g');
        this.xAxis
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        this.yAxis = this.svg.append('g');
        this.yAxis
            .attr('class', 'y axis')
            .call(yAxis);

        this.Line = this.svg.append('path')
            .attr('class', 'line');
        this.Line
            .transition()
            .duration(500)
            .attrTween('d', getSmoothInterpolation(data));

    }
    Chart.prototype.redraw = function (obj) {
        var data = obj.data;
        if (this.Line) {
            extent(data);

            this.xAxis
                .transition()
                .call(xAxis);
            this.yAxis
                .transition()
                .call(yAxis);
            this.Line
                .datum(data)
                .transition()
                .attr('d', line);
        }
    }

    return Chart;
});