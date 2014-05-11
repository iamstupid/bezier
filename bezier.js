/**
 * @name bezier.js
 * @author tmzbot (iamstupid@github.com)
 * @description utilities for all n-th order bezier curves, drawing and math
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
	function drawBezier(ctx, px, py, tAcc) {
		tAcc = tAcc ? tAcc : 30;
		tAcc = tAcc | 0;
		ctx.moveTo(px[0], py[0]);
		var f = bezier_gen(px),
			g = bezier_gen(py);
		var tInc = 1 / tAcc;
		var b;
		for (var i = 1; i <= tAcc; i++) {
			ctx.lineTo(
				f(i * tInc),
				g(i * tInc)
			);
		}
	}
	be.drawBezier = drawBezier;
})(bezier);
