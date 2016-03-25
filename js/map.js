//创建svg
var width = 960, height = 500;
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
//创建投影(projection)
var projection = d3.geo.mercator().translate([width / 2, height / 2]).center([105, 38]).scale(550);
//创建path
var path = d3.geo.path().projection(projection);
//解析json
d3.json("china.geo.json", function(json) {
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        //.on('mouseover', function(data) {
        //    d3.select(this).attr('fill', 'rgba(2,2,139,0.61)');
        //    //创建显示tooltip用的矩形
        //    svg.append("rect")
        //        .attr("id", "tooltip1")
        //        .attr("x", 50)
        //        .attr("y",50)
        //        .attr("width",140)
        //        .attr("height",130)
        //        .attr("stroke","black")
        //        .attr("fill","none")
        //    ;
        //    //创建显示tooltip文本
        //    svg.append("text")
        //        .attr("id", "tooltip2")
        //        .attr("x", 100)
        //        .attr("y", 100)
        //        .attr("text-anchor", "middle")
        //        .attr("font-family", "sans-serif")
        //        .attr("font-size", "11px")
        //        .attr("font-weight", "bold")
        //        .attr("fill", "black")
        //        .text(data.properties.name);
        //})
        //.on('mouseout', function(data) {
        //    d3.select(this).attr('fill', 'rgba(128,124,139,0.61)');
        //    //Remove the tooltip
        //    d3.select("#tooltip1").remove();
        //    d3.select("#tooltip2").remove();
        //})
        .attr('fill', 'url(#gradient)')
        //.attr('stroke', 'rgba(255,255,255,1)')
        //.attr('stroke-width', 1)
    ;
});

//lineargradient
var gradient = svg.append("svg:defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0")
    .attr("y1", "0")
    .attr("x2", "1")
    .attr("y2", "0");

gradient.append("svg:stop")
    .attr("offset", 0)
    .attr("stop-color", "rgba(238,213,255,1)")
    .attr("stop-opacity", 1);
gradient.append("svg:stop")
    .attr("offset", 1)
    .attr("stop-color", "rgba(202,237,255,1)")
    .attr("stop-opacity", 1);

