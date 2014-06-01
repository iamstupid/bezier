/**
 * @name bezier.js
 * @author tmzbot (iamstupid@github.com)
 * @description utilities for all n-th order bezier curves, drawing and math
 * @notice
 *  the script does not only support cubic bezier, but all kinds of bezier curves.
 *  Like 6th order, 15th order
 *  even 6th order the x-axis but 8th order the y-axis
 */
var bezier = {};
(function(be) {
	var lut = [
		[1],
		[1, 1],
		[1, 2, 1],
		[1, 3, 3, 1],
		[1, 4, 6, 4, 1],
		[1, 5, 10, 10, 5, 1],
		[1, 6, 15, 20, 15, 6, 1]
	];

	function bino(n, k) {
		//LUT(look up table) speeds it up
		while (n >= lut.length) {
			var s = lut.length;
			var nextRow = new Array(s + 1);
			nextRow[0] = 1;
			for (var i = 1, prev = s - 1; i <= prev; i++) {
				nextRow[i] = lut[prev][i - 1] + lut[prev][i];
			}
			nextRow[s] = 1;
			lut.push(nextRow);
		}
		return lut[n][k];
	}
	//binomial function inspired from http://pomax.github.io/bezierinfo/#explanation
	be.utils = {};
	be.utils.binomial = be.utils.C = bino;

	function ddup(A) {
		var res = {};
		for (var i in A) {
			if (typeof A[i] === "object") {
				res[i] = ddup(A[i]);
			} else {
				res[i] = a[i];
			}
		}
	}
	be.utils.ddup = ddup;
	Array.prototype.mapp = function(f) {
		var b = this.length,
			a = new Array(b);
		for (var i = 0; i < b; i++) {
			a[i] = f(this[i], i);
		}
		return a;
	};
	//using extra-fast array mapping (30 times faster than native array mapping, 3 times faster than custom map without this binding)
	//exporting binomial function
	function bezier_gen(ns) {
		nth = ns.length - 1;
		//nth-order bezier curve
		return new Function("t", "return " + ns.mapp(function(s, i) {
			return String(s * bino(nth, i)) + "*Math.pow(1-t," + (nth - i) + ")*Math.pow(t," + i + ")";
		}).join("+"));
		//return compiled function
	}
	be.utils.curveGenerator = bezier_gen;
	//core
	function linspace(min, max, len, typedArray) {
		typedArray = typedArray ? typedArray : Float64Array;
		var a = new typedArray(len);
		len -= 1;
		var tInc = (max-min) / len;
		for (var i = 0; i <= len ; i++) {
			a[i]=i*tInc+min;
		};
		return a;
	}

	function drawBezier(ctx, px, py, tAcc) {
		tAcc = tAcc ? tAcc : 30;
		tAcc = tAcc | 0;
		ctx.moveTo(px[0], py[0]);
		var f = bezier_gen(px),
			g = bezier_gen(py);
		var tInc = 1 / tAcc;
		for (var i = 1; i <= tAcc; i++) {
			ctx.lineTo(
				f(i * tInc),
				g(i * tInc)
			);
		}
	}
	be.drawBezier = drawBezier;

	function drawB(ctx,px,py,tArr){
		ctx.moveTo(px[0],py[0]);
		var f = bezier_gen(px),
			g = bezier_gen(py),
			ll= tArr.length;
		for (var i = 1; i < ll; i++) {
			ctx.lineTo(
				f(tArr[i]),
				g(tArr[i])
			);
		}
	}
	be.drawBezierByPoints=drawB;

	function bezier(px,py){
		this.px=px;
		this.py=py;
		this.xFunc=bezier_gen(px);
		this.yFunc=bezier_gen(py);
		this.upFunc=function(){
			this.xFunc=bezier_gen(this.px);
			this.yFunc=bezier_gen(this.py);
		}
		this.t=function(t){
			return [[xFunc(t)],[yFunc(t)]];
		}
		this.ts=function(ts){
			var l=ts.length;
			var cc=ts.constructor;
			var a=new cc(l);
			var b=new cc(l);
			//make an typed/untyped array with same type.
			for (var i = 0; i < l; i++) {
				a[i]=xFunc(ts[i]);
				b[i]=yFunc(ts[i]);
			};
			return [a,b];
		}
	}
	be.utils.bezier=bezier;

	function plot(ctx,xs,ys){
		//points:
		//	([[x],[y]]:<(x,y):ArrayType,x.length==y.length>)
		ctx.moveTo(xs[0],ys[0]);
		var ll=xs.length;
		for (var i = 1; i < ll; i++) {
			ctx.lineTo(
				xs[i],
				ys[i]
			);
		}
	}
	be.utils.plot=plot;

	function space(fn){
		this.fn=fn;
		this.n=this.gen=function(i,a,l,t){
			var a=linspace(i,a,l,t);
			for (var j = a.length - 1; j >= 0; j--) {
				a[j]=this.fn(a[j]);
			};
			return a;
		}
		this.s=this.space=this.fitMinMax=function(i,aa,l,t){
			t = t ? t : Float64Array;
			var a = new t(3);
			a[0]=i;a[1]=aa;
			if(a[0]>a[1]){
				//you know,swapping
				a[2]=a[0];
				a[0]=a[1];
				a[1]=a[2];
			}
			return this.gen(a[0],a[1],l,t);
		}
	}

	be.utils.linspace=linspace;
	be.utils.space=space;
	be.version="0.1.a";
})(bezier);
