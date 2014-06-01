var cc = new spaaPainter(tryer);
var ctx=cc.ctx;
ctx.strokeStyle = "#000";
ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.font="20px Gego";
var itera = 50;


function clearx(){
	ctx.fillStyle="#fff";
	ctx.fillRect(0,0,500,500);
	ctx.fillStyle="#000";
}

function draw(a) {
	if(a){
		clearx();
	}
	var lx = xes.value.split(",").mapp(function(s) {
		return s.split(" ").mapp(function(s) {
			return parseInt(s);
		});
	});
	var ly = yes.value.split(",").mapp(function(s) {
		return s.split(" ").mapp(function(s) {
			return parseInt(s);
		});
	});
	var a = new Date();
	ctx.beginPath();
	for (var i in lx) {
		try {
			bezier.drawBezier(ctx, lx[i], ly[i], itera);
		} catch (e) {};
		ctx.stroke();
	}
	a = (new Date()) - a;
	ctx.fillText("drew "+lx.length+" curves within "+a+"ms",10,20);
	cc.cache("a");
	cc.use("a");
}
