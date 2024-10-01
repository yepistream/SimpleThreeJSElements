import * as THREE from 'three';

import * as Simple from 'unnecesseryadditionsthreejs/scripts/UnnesseceryObject.js';

import loadModel from 'unnecesseryadditionsthreejs/scripts/ezImporter.js';

import { SimpleAnimation, EasyAnimator } from 'unnecesseryadditionsthreejs/scripts/EasyAnimator';

import {HTMLOverlay3D, HTMLOverlay} from './SimpleElement';

export const sScene = new Simple.SimpleScene();

const renderer = new Simple.SimpleRender(window.innerWidth, window.innerHeight, animate);


const camera = new Simple.SimplePerspectiveCamera( 75, renderer.wid / window.innerHeight, 0.1, 1000 );




document.body.appendChild( renderer.domElement );

camera.position.z = 5.5;
camera.position.y = 3;
camera.rotation.set(-0.5,0,0);

HTMLOverlay.startAll(camera);


let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let mesh = new THREE.Mesh( geometry, material );
sScene.addObject( new Simple.SimpleObject(mesh), "first" );

let elem3d = new HTMLOverlay3D("<h1>ASSSSSS</h1>",sScene.grab("first"),new THREE.Vector3(0,1,0));

let x = 0;

sScene.grabSimple("first").addEventListener( "onClick" ,()=>
    { 
    
        x++;
        
        sScene.grabSimple("first").moveTo(new THREE.Vector3(0,0,sScene.grab("first").position.z-x), 10);
    
    });


    let previousTime = 0;


function animate() {
    //TODO: Update in UnnessceryAdditionsThreeJS.

    requestAnimationFrame(animate);
	renderer.simpleRender( sScene, camera );
}

animate();

