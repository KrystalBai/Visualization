/**
 * Created by v-yanba on 3/18/2016.
 */
var _chartMgr = (function () {

    return {
        lefttopPart: function(para){
            var width = para.width;
            var height = para.height;
            var dataset = para.data;
            var background_color = para.backgroundColor;
            var color = para.foregroundColor;
            var τ = 2 * Math.PI;
            var tradeTop=dataset.tradDataByDay[0].tradeTop5;
            var tradByCategory=dataset.tradDataByDay[0].tradByCategory;
            var dataLength = dataset.tradDataByDay.length;

            var xOffset=para.xOffset;
            var yOffset=para.yOffset;
            var title_width=para.titleWidth;
            var title_height=para.titleHeight;
            var title_text=para.titleText;

            var titlePoints=[{"x":245,"y":22},{"x":410,"y":22},{"x":435,"y":52},{"x":435,"y":72}];

            //timer for play/stop
            var timer = null;

            //add svg
            var svg = d3.select("#" + para.container)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            createTitle(xOffset,yOffset,title_text[0]);
            function createTitle(x,y,text) {
                var title=svg.append("g").attr("class", "titlePart")
                    .attr("transform", "translate(" + x + "," + y + ")");
                title.append("rect")
                    .attr("class", "title")
                    .attr("width", title_width)
                    .attr("height", title_height)
                    .attr("fill", color)
                    .attr("rx", "5")
                    .attr("ry", "5");
                title.append("text")
                    .attr("x", "20")
                    .attr("y", title_height / 2)
                    .text(text)
                    .attr("dy", ".35em")
                    .attr("fill", "#fff")
                    .style({"font-size": "22px", "font-family": "Microsoft Yahei"});
                title.selectAll(".polygon")
                    .data([titlePoints])
                    .enter().append("polygon")
                    .attr("class", "titleLine")
                    .attr("points", function(d) {
                        return d.map(function(d) {
                            return [d.x,d.y].join(",");
                        }).join(" ")})
                    .attr("fill", "none")
                    .attr("stroke","#000")
                    .attr("stroke-width", "1px")
                    .attr("stroke-dasharray","225 196");
            }
            createTriangleChart(tradeTop,xOffset,yOffset+title_height+20);
            function createTriangleChart(data,x,y){
                var gradient=svg.append("defs")
                    .append("linearGradient")
                    .attr("id", "gradient")
                    .attr("x1", "0%")
                    .attr("y1", "100%")
                    .attr("x2", "0%")
                    .attr("y2", "0%")
                    .attr("spreadMethod", "pad");
                gradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", color)
                    .attr("stop-opacity",0);
                gradient.append("stop")
                    .attr("offset", "20%")
                    .attr("stop-color", color)
                    .attr("stop-opacity",.3);
                gradient.append("stop")
                    .attr("offset", "40%")
                    .attr("stop-color", color)
                    .attr("stop-opacity",.6);
                gradient.append("stop")
                    .attr("offset", "60%")
                    .attr("stop-color", color)
                    .attr("stop-opacity",.7);
                gradient.append("stop")
                    .attr("offset", "80%")
                    .attr("stop-color", color)
                    .attr("stop-opacity",.8);
                gradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", color)
                    .attr("stop-opacity",1);
                var tradeValue=data.map(function(d,i){
                    return d.value;
                });
                var maxData=Math.max.apply(null,tradeValue);
                var polygons=svg.append("g").attr("class", "polygon")
                    .attr("transform", "translate(" + x + "," + y + ")");
                for(var item in data){
                    polygons.append("polygon")
                        .attr("points", function() {
                            return [59+item*80, 156-Math.ceil(tradeTop[item].value * 140 / maxData)].join(",")+" "+(44+item*80)+",156 "+(74+item*80)+",156";
                        })
                        .style("fill","url(#gradient)");
                    polygons.append("text")
                        .attr("x", 44+item*80)
                        .attr("y", 140-Math.ceil(tradeTop[item].value * 140 / maxData))
                        .text(data[item].value)
                        .attr("dy", ".35em")
                        .attr("fill", color)
                        .style({"font-size": "16px", "font-family": "Microsoft Yahei"});
                    polygons.append("text")
                        .attr("x", 44+item*80)
                        .attr("y", 170)
                        .text(data[item].name)
                        .attr("dy", ".35em")
                        .attr("fill", "#000")
                        .style({"font-size": "16px", "font-family": "Microsoft Yahei"});
                }
            }
            createTitle(xOffset,yOffset+title_height+248,title_text[1]);
            var arc = d3.svg.arc()
                    .innerRadius(46)
                    .outerRadius(48)
                    .startAngle(0);
            //createArcChart(tradByCategory,xOffset,yOffset+2*title_height+324);
            function createArcChart(data,x,y) {
                for(var item in data){
                    //console.log(data[item]);
                    var arcs = svg.append("g").attr("class","arcs")
                        .attr("transform", "translate(" + 68+"," + y + ")");
                    arcs.append("circle")
                        .attr("cx", 88+item*136)
                        .attr("cy", 0)
                        .attr("r", 48)
                        .style("fill","#f0f8fd");
                    arcs.append("image")
                        .attr('xlink:href', 'img'+(1+Number(item))+'.png')
                        .attr("width", 48)
                        .attr("height", 48)
                        .attr("x", 64+item*136)
                        .attr("y", -24);

                    arcs.append("path")
                        .data([data[item]])
                        .attr("transform", "translate(" + (88+item*136) + ", 0)")
                        .attr("class", "path path--foreground")
                        .style("fill", color)
                        .transition()
                        .duration(750)
                        .attrTween("d",arcTween);
                    arcs.append("text")
                        .attr("x", 58+item*136)
                        .attr("y", 66)
                        .text(data[item].name)
                        .attr("dy", ".35em")
                        .attr("fill", "#000")
                        .style({"font-size": "16px", "font-family": "Microsoft Yahei"});
                    arcs.append("text")
                        .attr("x", 74+item*136)
                        .attr("y", 90)
                        .text(data[item].percentage)
                        .attr("dy", ".35em")
                        .attr("fill", color)
                        .style({"font-size": "16px", "font-family": "Microsoft Yahei"});
                }
            }

            function arcTween(d) {
                    d.endAngle = (parseFloat(d.percentage)) * -.02 * Math.PI;
                    var interpolate = d3.interpolate(0, d.endAngle);
                    return function(t) {
                        d.endAngle = interpolate(t);
                        return arc(d);
                    };
            }
            //function resetArc() {
            //    svg.selectAll(".field")
            //        .selectAll(".path--foreground")
            //        .transition()
            //        .duration(50)
            //        .call(function(transition){
            //            transition.attrTween("d", function(d) {
            //                d.endAngle = 0;
            //                var interpolate = d3.interpolate(0, d.endAngle);
            //                return function(t) {
            //                    d.endAngle = interpolate(t);
            //                    return arc(d);
            //                };
            //            });
            //        });
            //}
            function resetArc(){
                d3.selectAll('.arcs').remove();
            }
            function playArc(){
                for(var i=0;i< dataLength;i++) {
                    (function(j){
                        setTimeout(function(){
                           resetArc();
                            createArcChart(dataset.tradDataByDay[j].tradByCategory,xOffset,yOffset+2*title_height+324);
                        },800*j);
                    })(i);
                }
            }
            //public functions to control the chart
            return {
                play: playArc,
                loop: function () {
                    playArc();
                    timer = setInterval(function () { playArc(); }, dataLength * 800 + 500);
                }
                ,stop: function () {
                    clearInterval(timer);
                }
            }
        }
    }

})();
