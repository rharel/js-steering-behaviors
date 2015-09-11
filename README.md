[![Build Status](https://travis-ci.org/rharel/js-steering-behaviors.svg?branch=release%2F1.0.0)](https://travis-ci.org/rharel/js-steering-behaviors)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com)

## What is this?

In [this](doc/reynolds-steering-behaviors.pdf) influential paper, Reynolds introduces simple, and yet essential steering behaviors for virtual agents. Extending, combining and refining these elementary behaviors lead to a vast collection of path planning and smart navigation methods for virtual characters.

This is an implementation of some of the steering behaviors mentioned in the original paper by Reynolds. You can use them as a basis for more complex behaviors you require in your projects. You can view some of those behaviors in action in [this live demo](https://rharel.github.io/js-steering-behaviors).

## Installation

Install via bower: `bower install rharel/js-steering-behaviors'

The `dist/` directory contains both a normal (`steering_behaviors.js`) as well as a minified version of the library (`steering_behaviors.min.js`).
Include in the browser using `<script src="path/to/steering_behaviors.min.js"></script>`

## Documentation

A preface to understanding the settings as well as the inner workings of the behaviors is of course to treat the [original paper](doc/reynolds-steering-behaviors.pdf) as your manual. 

Learning by example is also a possibility by either inspecting the visual tests under [test/visual/](test/visual/) or to look at the [source of the live demo](https://github.com/rharel/js-steering-behaviors/tree/gh-pages).

Of course, all important objects in the source files themselves are also annotated with jsdoc-style comments.


## License

This software is licensed under the **MIT License**. See the [license](LICENSE.txt) file for more information.
