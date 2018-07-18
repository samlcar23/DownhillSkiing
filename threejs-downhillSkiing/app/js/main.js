import * as THREE from 'three';
// import orbit from 'three-orbit-controls';
// const OrbitControls = orbit(THREE);
import TrackballControls from 'three-trackballcontrols';
import Skybox from "./models/Skybox";
import Tree from "./models/Tree";

var spotLight;

export default class App {
    constructor() {
        const c = document.getElementById('mycanvas');
        // Enable antialias for smoother lines
        this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.5, 2000);

        //Set Camera Position for game
        this.camera.position.z = 100;
        // this.camera.matrixAutoUpdate = false;
        // let trans = new THREE.Matrix4().makeTranslation(0, 50, 100);
        // let rotx = new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-30));
        // this.camera.matrixWorld.multiply(trans);
        // this.camera.matrixWorld.multiply(rotx);


        // const orbiter = new OrbitControls(this.camera);
        // orbiter.enableZoom = false;
        // orbiter.update();
        this.tracker = new TrackballControls(this.camera);
        this.tracker.rotateSpeed = 2.0;
        this.tracker.noZoom = false;
        this.tracker.noPan = false;

        //Ambient Lighting
        this.lightOne = new THREE.AmbientLight (0xFFFFFF, .7);
        this.scene.add (this.lightOne);

        //Spotlight
        spotLight = new THREE.SpotLight(0xffffff);
        spotLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(60, 1, 1, 2500));
        spotLight.position.set(0, 450, -500);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.05;
        spotLight.intensity = .3;
        spotLight.decay = 1.2;
        spotLight.distance = 1000;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.camera.near = 100;
        spotLight.shadow.camera.far = 800;
        this.scene.add( spotLight );


        // Spotlight camera helper
        var helper = new THREE.CameraHelper( spotLight.shadow.camera );
        this.scene.add(helper);


        //Add skybox
        this.sky = new Skybox();
        this.scene.add(this.sky);


        //Use SimplexNoise
        var SimplexNoise = require('simplex-noise');
        var simplex = new SimplexNoise(Math.random);

        var snowTex = THREE.TextureLoader.load("images/snow.tiff");
        snowTex.wrapS = snowTex.wrapT = THREE.RepeatWrapping;
        snowTex.repeat.set(100, 100);

        //Plane for the hill side
        const groundGeom = new THREE.PlaneGeometry(1000, 2000, 500, 1000);

        //Make ground bumpy
        // for (var i = 0; i < groundGeom.vertices.length; i++){
        //   var vertex = groundGeom.vertices[i];
        //   //var value = THREE.Math.randFloat(vertex.x, vertex.y);
        //   var value = simplex.noise3D(vertex.x, vertex.y, vertex.z);
        //   vertex.z = value;
        // }
        //
        // //fix lighting
        // groundGeom.computeFaceNormals();
        // groundGeom.computeVertexNormals();

        const groundMat = new THREE.MeshPhongMaterial({map: snowTex, side: THREE.DoubleSide});
        const groundMesh = new THREE.Mesh(groundGeom, groundMat);
        groundMesh.rotateX(THREE.Math.degToRad(70));
        groundMesh.receiveShadow = true;

        this.scene.add(groundMesh);


        //TREE
        this.tree = new Tree();
        this.tree.translateY(15);
        this.scene.add(this.tree);

        window.addEventListener('resize', () => this.resizeHandler());
        this.resizeHandler();
        requestAnimationFrame(() => this.render());
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.tracker.update();
        requestAnimationFrame(() => this.render());
    }

    resizeHandler() {
        const canvas = document.getElementById("mycanvas");
        let w = window.innerWidth;
        let h = window.innerHeight - 4;
        canvas.width = w;
        canvas.height = h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.tracker.handleResize();
    }
}

