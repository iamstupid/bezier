function spaaPainter(canvas) {
	var aa = document.createElement("canvas");
	var h, w;
	this.h = h = aa.height = canvas.height;
	this.w = w = aa.width = canvas.width * 3; //using sub-pixel mode
	this.canvas = this.cvs = aa;
	var ctx = aa.getContext("2d");
	this.context = this.ctx = ctx;
	var cctx=canvas.getContext("2d");
	ctx.scale(3, 1); //scale to sub-pixel mode
	this.getImageData = this.gid = function(x, y, w, h) {
		return ctx.getImageData(x, y, w, h);
	}
	//deeply extracted from http://johnvalentine.co.uk/subpixel-html5-canvas.htm
	//thanks
	this.getSpaaData = this.gsd = function(x, y, w, h, w1) {
		var sw = w * 3,
			sh = h,
			dw = w,
			dh = h,
			sp = ctx.getImageData(x * 3, y, sw, sh),
			re = cctx.createImageData(w, h); //copy data

		var readIndex, writeIndex, r, g, b, a, x, y;

		// sampling weightings. w1 = weight for sub-pixel; w2 = weight for 
		var w2 = (1 - w1) * 0.5;
		var w21 = w1 + w2;
		var w211 = w2 + w2 + w1;

		// copy. we cheat, by ignoring the width edges.
		// todo: check extents of source reads, e.g. to use 0..dw, and then prevent index error (too slow?)
		for (y = 0; y < dh; y++) {

			for (x = 1; x < (dw - 1); x++) {

				readIndex = (y * sw + x * 3) * 4;
				writeIndex = (y * dw + x) * 4;

				// r
				re.data[writeIndex + 0] = Math.round(
					w1 * sp.data[readIndex + 0] + w2 * (sp.data[readIndex - 4] + sp.data[readIndex + 4])
				);

				// g
				re.data[writeIndex + 1] = Math.round(
					w1 * sp.data[readIndex + 5] + w2 * (sp.data[readIndex + 1] + sp.data[readIndex + 9])
				);

				// b
				re.data[writeIndex + 2] = Math.round(
					w1 * sp.data[readIndex + 10] + w2 * (sp.data[readIndex + 6] + sp.data[readIndex + 14])
				);

				// a
				re.data[writeIndex + 3] = Math.round(
					0.3333 * (
						w211 * sp.data[readIndex + 7] + w21 * (sp.data[readIndex + 3] + sp.data[readIndex + 11]) + w2 * (sp.data[readIndex - 1] + sp.data[readIndex + 15])
					)
				);

			}

		}

		return re;
	}
	this.paint=function(x,y,w,h,dx,dy,w1){
		x=x?x:0;
		y=y?y:0;
		w=w?w:canvas.width;
		h=h?h:this.h;
		w1=w1?w1:0.33;
		dx=dx?dy:0;
		dy=dy?dy:0;
		var sd=this.getSpaaData(x,y,w,h,w1);
		cctx.putImageData(sd,dx,dy);
	}
	var cache={};
	this.cacheData=cache;
	this.cache=function(id){
		return cache[id]=this.getSpaaData(0,0,canvas.width,h,0.34);
	}
	this.use=function(id){
		cctx.putImageData(cache[id],0,0);
	}
}
