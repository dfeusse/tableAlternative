var buttonOne = d3.select("#buttons").append("button")
    .text("MAU")
var buttonTwo = d3.select("#buttons").append("button")
    .text("DPM")

var width = 600,
	height = 350,
	pad = 40,
	leftPad = 100;

var tip = d3.tip()
		.attr('class', 'd3-tip')
		.html(function(d) { return 'name: ' + '<span>' + d.app + '</span>' + '<br>' + 'MAU: ' + '<span>' + d.MAU + '</span>' + '<br>'
			+ 'DPM: ' + '<span>' + d.DPM + '</span>' })
		.direction('n')
		.offset([-12, 0]);

var svg = d3.select("#circle_visual")
	.append('svg')
	.attr('width', width + 200)
	.attr('height', height);

var parseDate = d3.time.format("%Y-%m");//.parse()

//var x = d3.scale.linear()
//	.domain([])

var x = d3.time.scale()
    .range([0, width - 100]);

var y = d3.scale.linear()
	.range([height - pad*2, pad]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("top");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("right")
	.ticks(9)
	.tickFormat(function(d,i) {
		//return ['buffer' ,'Podcasts', 'Slacker Radio', 'Songza', 'Stitcher', 'Shazam', 'Pandora', 'iHeartRadio', 'TuneIn'][d];
		return ['TuneIn','TuneIn','iHeartRadio','Pandora','Shazam','Stitcher','Songza','Slacker Radio','Podcasts'][d];
	});

d3.json("data.json", function(data) {
	
	//console.log(data)
	data.forEach(function(d) {
		d.date = parseDate.parse(d.date);
	});
	//console.log(data)

	var nodeColor = d3.scale.linear()
		.domain([0, d3.max(data, function(d,i) {return d.DPM}) ])
		.range(["#e8f4f8", "#0000b3"]);

	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain(d3.extent(data, function(d) { return d.position; }));

	var x0 = Math.max(-d3.min(data, function(d) { return d.date; }), d3.max(data, function(d) { return d.date; }));

	var nodeSize = d3.scale.linear()
			.domain([0, d3.max(data, function(d) { return d.MAU; }) ])
			.range([0, 15]);

	var g = svg.append("g").attr("class", "value")

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + (leftPad - 50) + ", 30)")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + (width-pad+10) + ", 10)")
		.call(yAxis);

	var nodes = g.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		
		.attr("class", "circle")
		//.attr("cx", function(d) { return x(d.date); })
		.attr("cx", function(d,i) { return x(d.date) + 50})
		//.attr("cy", function(d,i) { return (i*20) + 25; })
		.attr("cy", function(d,i) {return y(d.position) + 10 })
		//.attr("cy", 100)
		.attr("r", function(d,i) { return nodeSize(d.MAU) })
		//.attr("r", 10)
		.style("fill", function(d, i) {return nodeColor(d.DPM)})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	nodes.call(tip)

	var text = g.selectAll("text")
		.data(data)
		.enter()
		.append('text');
/*
	var othertext = g.selectAll("text.pone")
		.data(data)
		.enter()
		.append('text');
*/
	var hovertext = g.selectAll("text.emma")
		.data(data)
		.enter()
		.append('text');

	text
		.attr("y", function(d,i) {return y(d.position) + 15 })
		.attr("x", function(d,i) {return x(d.date) + 40} )
		.attr("class", "node_label")
		.text(function(d) {return d.MAU} )
		.style("display", "none")
/*
	othertext
		.attr("y", function(d,i) {return y(d.position) + 15 })
		.attr("x", function(d,i) {return width - 20} )
		.attr("class", "name_label")
		.text(function(d) {return d.app} )
		//.style("fill", "black")
		//.style("display","none");
*/
	hovertext
		.attr("x", 40)
		.attr("y", 320)
		.attr("class", "hover_label")
		.text("hover for data")
		.on('mouseover', mouseover)
		.on('mouseout', mouseout);

	function mouseover(p) {
		var g = d3.select(this).node().parentNode;
		d3.select(g).selectAll("circle").style("display","none");
		d3.select(g).selectAll("text.node_label").style("display","block");
	};

	function mouseout(p) {
		var g = d3.select(this).node().parentNode;
		d3.select(g).selectAll("circle").style("display","block");
		d3.select(g).selectAll("text.node_label").style("display","none");
	}

	buttonOne
		.on("click", function() {

			var nodeColor = d3.scale.linear()
				.domain([0, d3.max(data, function(d,i) {return d.DPM}) ])
				.range(["#add8e6", "#0000b1"]);

			var nodeSize = d3.scale.linear()
					.domain([0, d3.max(data, function(d) { return d.MAU; }) ])
					.range([0, 15]);

			text
				.attr("y", function(d,i) {return y(d.position) + 15 })
				.attr("x", function(d,i) {return x(d.date) + 40} )
				.attr("class", "node_label")
				.text(function(d) {return d.MAU} )
				.style("display", "none");

			nodes
				.transition()
				.duration(800)
				.attr("r", function(d,i) { return nodeSize(d.MAU) })
				.style("fill", function(d, i) {return nodeColor(d.DPM)});
		})

	buttonTwo
		.on("click", function() {

			var nodeColor = d3.scale.linear()
				.domain([0, d3.max(data, function(d,i) {return d.MAU}) ])
				//.range(["#add8e6", "#0000b1"]);
				.range(["#e8f4f8", "#0000b3"]);

			var nodeSize = d3.scale.linear()
					.domain([0, d3.max(data, function(d) { return d.DPM; }) ])
					.range([0, 15]);

			text
				.attr("y", function(d,i) {return y(d.position) + 15 })
				.attr("x", function(d,i) {return x(d.date) + 40} )
				.attr("class", "node_label")
				.text(function(d) {return d.DPM} )
				.style("display", "none");

			nodes
				.transition()
				.duration(800)
				.attr("r", function(d,i) { return nodeSize(d.DPM) })
				.style("fill", function(d, i) {return nodeColor(d.MAU)});

		});

}); //end of data function