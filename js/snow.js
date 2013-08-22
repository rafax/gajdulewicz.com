// Particle3D class

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

Particle3D = function (material ) {
    THREE.Particle.call( this, material );

    this.velocity = new THREE.Vector3(0,0.5,0);
    this.velocity.rotateX(randomRange(-25,25));
    this.velocity.rotateY(randomRange(0,360));
    this.gravity = new THREE.Vector3(0,0,0);
    this.drag = 1;
};

Particle3D.prototype = new THREE.Particle();
Particle3D.prototype.constructor = Particle3D;

Particle3D.prototype.updatePhysics = function() {
    this.velocity.multiplyScalar(this.drag);
    this.velocity.addSelf(this.gravity);
    this.position.addSelf(this.velocity);
}

var TO_RADIANS = Math.PI/180;

THREE.Vector3.prototype.rotateY = function(angle){

    cosRY = Math.cos(angle * TO_RADIANS);
    sinRY = Math.sin(angle * TO_RADIANS);

    var tempz = this.z;;
    var tempx = this.x;

    this.x= (tempx*cosRY)+(tempz*sinRY);
    this.z= (tempx*-sinRY)+(tempz*cosRY);


}

THREE.Vector3.prototype.rotateX = function(angle){

    cosRY = Math.cos(angle * TO_RADIANS);
    sinRY = Math.sin(angle * TO_RADIANS);

    var tempz = this.z;;
    var tempy = this.y;

    this.y= (tempy*cosRY)+(tempz*sinRY);
    this.z= (tempy*-sinRY)+(tempz*cosRY);


}

THREE.Vector3.prototype.rotateZ = function(angle){
    cosRY = Math.cos(angle * TO_RADIANS);
    sinRY = Math.sin(angle * TO_RADIANS);

    var tempx = this.x;;
    var tempy = this.y;

    this.y= (tempy*cosRY)+(tempx*sinRY);
    this.x= (tempy*-sinRY)+(tempx*cosRY);
}

function randomRange(min, max){
    return ((Math.random()*(max-min)) + min);
}

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container;

var particle;

var camera;
var scene;
var renderer;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var particles = [];
var particleImage = new Image();//THREE.ImageUtils.loadTexture( "img/ParticleSmoke.png" );
particleImage.src = 'img/heart.png';
var particleImage2 = new Image();//THREE.ImageUtils.loadTexture( "img/ParticleSmoke.png" );
particleImage2.src = 'img/heart2.png';
var particleImage3 = new Image();//THREE.ImageUtils.loadTexture( "img/ParticleSmoke.png" );
particleImage3.src = 'img/heart2.png';



function init() {

    container = document.createElement('div');
    container.id = 'snowflakes';
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.add(camera);

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage) } );
    var material2 = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage2) } );
    var material3 = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage3) } );


    for (var i = 0; i < 2000; i++) {
        if(i%3===0)
            particle = new Particle3D( material);
        else if(i%3===1)
            particle = new Particle3D( material2);
        else
            particle = new Particle3D( material3);


        particle.position.x = Math.random() * 2000 - 1000;
        particle.position.y = Math.random() * 2000 - 1000;
        particle.position.z = Math.random() * 4000 - 1000;
        particle.scale.x = particle.scale.y =  1;
        scene.add( particle );

        particles.push(particle);
    }

    container.appendChild( renderer.domElement );


    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    loop()
}

function onDocumentMouseMove( event ) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {

    if ( event.touches.length == 1 ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
}

function onDocumentTouchMove( event ) {

    if ( event.touches.length == 1 ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
}

//

function loop() {

    for(var i = 0; i<particles.length; i++)
    {
        var particle = particles[i];
        particle.updatePhysics();

        with(particle.position)
        {
            if(y<-1000) y+=2000;
            if(x>1000) x-=2000;
            else if(x<-1000) x+=2000;
            if(z>1000) z-=2000;
            else if(z<-1000) z+=2000;
        }
    }

    camera.position.x += ( mouseX - camera.position.x ) * 0.10;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.10;
    camera.lookAt(scene.position);

    renderer.render( scene, camera );
    requestAnimationFrame(loop)
}
