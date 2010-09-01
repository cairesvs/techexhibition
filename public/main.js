/*
THERE WEB SITE 2010
-----------------------------------------------------
Designed and created by Jesson Yip. www.jessonyip.com
Original code by Mr Doob www.mrdoob.com
-----------------------------------------------------
*/

// Settings
var body = document.body;
var frameRate = 20;
var contentPadding = 20;
var ballsFront = 5;
var ballsBehind = 5;
var ballDensity = .5;
var ballFriction = 0.2;
var ballRestitution = 0.3;
var ballRotation = 0;

// Canvas Setup
var canvas;
var delta = [ 0, 0 ];
var stage = [ window.screenX, window.screenY, window.innerWidth, window.innerHeight ];
getBrowserDimensions();

// Variables
var container = document.getElementById('container');
var containerParent = container.parentNode;
var items = container.getElementsByTagName('div');
var worldAABB, world, iterations = 1, timeStep = 1 / frameRate;
var walls = [];
var wall_thickness = 200;
var wallsSetted = false;
var bodies, elements, content;
var createMode = false;
var destroyMode = false;
var isMouseDown = false;
var mouseJoint;
var mouseX = 0;
var mouseY = 0;
var PI2 = Math.PI * 2;
var timeOfLastTouch = 0;


// Init
if (supports_canvas_text()) {
	init();
	play();
}


function supports_canvas() {
  return !!document.createElement('canvas').getContext;
}

function supports_canvas_text() {
  if (!supports_canvas()) { return false; }
  var dummy_canvas = document.createElement('canvas');
  var context = dummy_canvas.getContext('2d');
  return typeof context.fillText == 'function';
}

function init() {
	canvas = document.getElementById( 'canvas' );
	document.onmousedown = onDocumentMouseDown;
	document.onmouseup = onDocumentMouseUp;
	document.onmousemove = onDocumentMouseMove;
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	worldAABB = new b2AABB(); // init box2d
	worldAABB.minVertex.Set( -200, -200 );
	worldAABB.maxVertex.Set( screen.width + 200, screen.height + 200 );
	world = new b2World( worldAABB, new b2Vec2( 0, 0 ), true );
	setWalls();
	reset();
}

function convertContent() {
	var itemClass;
	var itemWidth;
	var itemBackground;
	var itemContent;
	var itemInfo;
	for (var i=items.length-1; i>-1; i--) {
		items[i].style.padding = 0;
		items[i].style.clear = 'none';
		itemClass = items[i].getAttribute('class');
		itemWidth = items[i].clientWidth;
		itemBackground = items[i].getAttribute("color");
		itemContent = items[i].innerHTML;
		createContentBall(itemClass, itemWidth, itemBackground, itemContent);
	}
	body.removeChild(container);
}

function play() {
	setInterval( loop, 1000 / 40 );
}

function reset() {
	if ( bodies ) {
		for ( i = 0; i < bodies.length; i++ ) {
			var body = bodies[ i ]
			canvas.removeChild( body.GetUserData().element );
			world.DestroyBody( body );
			body = null;
		}
	}
	bodies = [];
	elements = [];
	convertContent();
}

function createContentBall(className,size,color,html) {
	var element = document.createElement( 'div' );
	element.className = className;
	element.width = element.height = size;
	element.style.position = 'absolute';
	element.style.left = -size + 'px';
	element.style.top = -size + 'px';
	element.style.cursor = "default";
	canvas.appendChild(element);
	elements.push( element );
	var circle = document.createElement( 'canvas' );
	circle.width = size;
	circle.height = size;
	var magicNumber = size * .5;
	if (className !=='image' && className !=='image first') {
		var graphics = circle.getContext( '2d' );
		graphics.fillStyle = color;
		graphics.beginPath();
		graphics.arc( magicNumber, magicNumber, magicNumber, 0, PI2, true );
		graphics.closePath();
		graphics.fill();
	}
	element.appendChild( circle );
	content = document.createElement( 'div' );
	content.className = "content";
	content.onSelectStart = null;
	content.innerHTML = html;
	element.appendChild(content);
	if (className !=='image' && className !=='image first' ) {
		content.style.width = (size - contentPadding*2) + 'px';
		content.style.left = (((size - content.clientWidth) / 2)) +'px';
		content.style.top = ((size - content.clientHeight) / 2) +'px';
	}
	var b2body = new b2BodyDef();
	var circle = new b2CircleDef();
	circle.radius = size / 2;
	circle.density = ballDensity;
	circle.friction = ballFriction;
	circle.restitution = ballRestitution;
	b2body.AddShape(circle);
	b2body.userData = {element: element};
	b2body.position.Set( Math.random() * stage[2], Math.random() * (stage[3]-size) + size/2);
	b2body.linearVelocity.Set( Math.random() * 200, Math.random() * 200 );
	bodies.push( world.CreateBody(b2body) );
}

function loop() {
	delta[0] += (0 - delta[0]) * .5;
	delta[1] += (0 - delta[1]) * .5;
	world.m_gravity.x = 0 // -(0 + delta[0]);
	world.m_gravity.y = -(100 + delta[1]);
	mouseDrag();
	world.Step(timeStep, iterations);
	for (i = 0; i < bodies.length; i++) {
		var body = bodies[i];
		var element = elements[i];
		element.style.left = (body.m_position0.x - (element.width >> 1)) + 'px';
		element.style.top = (body.m_position0.y - (element.height >> 1)) + 'px';
		if (ballRotation && element.tagName == 'DIV') {
			var rotationStyle = 'rotate(' + (body.m_rotation0 * 57.2957795) + 'deg)';
			element.style.WebkitTransform = rotationStyle;
			element.style.MozTransform = rotationStyle;
			element.style.OTransform = rotationStyle;
		}
	}
}

// Box2d Utils
function createBox(world, x, y, width, height, fixed) {
	if (typeof(fixed) == 'undefined') {
		fixed = true;
	}
	var boxSd = new b2BoxDef();
	if (!fixed) {
		boxSd.density = 1.0;
	}
	boxSd.extents.Set(width, height);
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);
	return world.CreateBody(boxBd);
}

function onDocumentMouseDown() {
	isMouseDown = true;
	return false;
}

function onDocumentMouseUp() {
	isMouseDown = false;
	return false;
}

function onDocumentMouseMove( event ) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function onDocumentTouchStart( event ) {
	if( event.touches.length == 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX;
		mouseY = event.touches[ 0 ].pageY;
		isMouseDown = true;
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX;
		mouseY = event.touches[ 0 ].pageY;
	}
}

function onDocumentTouchEnd( event ) {
	if ( event.touches.length == 0 ) {
		event.preventDefault();
		isMouseDown = false;
	}
}

function mouseDrag() {
	// Mouse Press

	if (isMouseDown && !mouseJoint) {
		var body = getBodyAtMouse();
		if (body) {
			var md = new b2MouseJointDef();
			md.body1 = world.m_groundBody;
			md.body2 = body;
			md.target.Set(mouseX, mouseY);
			md.maxForce = 30000 * body.m_mass;
			md.timeStep = timeStep;
			mouseJoint = world.CreateJoint(md);
			body.WakeUp();
		}
	}
	// Mouse Release
	if (!isMouseDown) {
		createMode = false;
		destroyMode = false;
		if (mouseJoint) {
			world.DestroyJoint(mouseJoint);
			mouseJoint = null;
		}
	}
	// Mouse Move
	if (mouseJoint) {
		var p2 = new b2Vec2(mouseX, mouseY);
		mouseJoint.SetTarget(p2);
	}
}

function getBodyAtMouse() {
	// Make a small box.
	var mousePVec = new b2Vec2();
	mousePVec.Set(mouseX, mouseY);
	var aabb = new b2AABB();
	aabb.minVertex.Set(mouseX - 1, mouseY - 1);
	aabb.maxVertex.Set(mouseX + 1, mouseY + 1);
	// Query the world for overlapping shapes.
	var k_maxCount = 10;
	var shapes = new Array();
	var count = world.Query(aabb, shapes, k_maxCount);
	var body = null;
	for (var i = 0; i < count; ++i) {
		if (shapes[i].m_body.IsStatic() == false) {
			if ( shapes[i].TestPoint(mousePVec) ) {
				body = shapes[i].m_body;
				break;
			}
		}
	}
	return body;
}

function setWalls() {
	if (wallsSetted) {
		world.DestroyBody(walls[0]);
		world.DestroyBody(walls[1]);
		world.DestroyBody(walls[2]);
		world.DestroyBody(walls[3]);
		walls[0] = null; 
		walls[1] = null;
		walls[2] = null;
		walls[3] = null;
	}
	walls[0] = createBox(world, stage[2] / 2, - wall_thickness, stage[2], wall_thickness);
	walls[1] = createBox(world, stage[2] / 2, stage[3] + wall_thickness, stage[2], wall_thickness);
	walls[2] = createBox(world, - wall_thickness, stage[3] / 2, wall_thickness, stage[3]);
	walls[3] = createBox(world, stage[2] + wall_thickness, stage[3] / 2, wall_thickness, stage[3]);	
	wallsSetted = true;
}

// Browser Dimensions
function getBrowserDimensions() {
	var changed = false;
	if (stage[0] != window.screenX) {
		delta[0] = (window.screenX - stage[0]) * 50;
		stage[0] = window.screenX;
		changed = true;
	}
	if (stage[1] != window.screenY) {
		delta[1] = (window.screenY - stage[1]) * 50;
		stage[1] = window.screenY;
		changed = true;
	}
	if (stage[2] != window.innerWidth) {
		stage[2] = window.innerWidth;
		changed = true;
	}
	if (stage[3] != window.innerHeight) {
		stage[3] = window.innerHeight;
		changed = true;
	}
	return changed;
}
