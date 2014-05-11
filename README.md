bezier
======

Utilities of using bezier curves (no matter quadratic, cubic, or nth-order ones), drawing and computing
introduction.
------------
Bezier curves are, the most widely used computer curves, but the use in computer art is not fully supported all the time (For example, most programs just supports quad and cubic bezier curves, which means, it is not so flexable.)

It is more quickly to draw bezier than other curves and it is really easy to think about. A list of points are given, then use the first point as the starter, the last point as the end, and other points are called control points. The notable effect of control points performs like a kind of force, gravity, or, wrapping the drawing plain and project onto the screen. However, most of time, we just call them curves. They are really curves, but not created by the wrap of Albert Einstain's Relativistic. With Einstain's curve we need a lot to do with solving differential equations, space transforms, and projecting, but with bezier with the same or almost same and a better accuracy, everything we need to do is making a polynomial with variable `t` within range `o~1`. The time is even fucking hours off. (What's fucking hours? See SMBC for explaination.)

For a demostration, I will make up a `gh-pages`, but not now. You can reference [A Primer on Bézier Curves](http://pomax.github.io/bezierinfo/).
API
---
Will be explained with any detail in wiki.
explaination
------------
See [A Primer on Bézier Curves](http://pomax.github.io/bezierinfo/);
