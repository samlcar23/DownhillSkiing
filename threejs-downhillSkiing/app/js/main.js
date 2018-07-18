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


        //Source for Rough sphere
        //https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-endless-runner-game-using-three-js--cms-29157

        //cylinder for the hill side
        var sides=100;
        var tiers=100;
        const groundGeom = new THREE.SphereGeometry(1000, sides, tiers);
        const groundMat = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide });
        var vertexIndex;
        var vertexVector= new THREE.Vector3();
        var nextVertexVector= new THREE.Vector3();
        var firstVertexVector= new THREE.Vector3();
        var offset= new THREE.Vector3();
        var currentTier=1;
        var lerpValue=.5;
        var heightValue;
        var maxHeight=3;
        for(var j=1;j<tiers-2;j++){
            currentTier=j;
            for(var i=0;i<sides;i++){
                vertexIndex=(currentTier*sides)+1;
                vertexVector=groundGeom.vertices[i+vertexIndex].clone();
                if(j%2!==0){
                    if(i===0){
                        firstVertexVector=vertexVector.clone();
                    }
                    nextVertexVector=groundGeom.vertices[i+vertexIndex+1].clone();
                    if(i==sides-1){
                        nextVertexVector=firstVertexVector;
                    }
                    lerpValue=(Math.random()*(0.75-0.25))+0.25;
                    vertexVector.lerp(nextVertexVector,lerpValue);
                }
                heightValue=(Math.random()*maxHeight)-(maxHeight/2);
                offset=vertexVector.clone().normalize().multiplyScalar(heightValue);
                groundGeom.vertices[i+vertexIndex]=(vertexVector.add(offset));
            }
        }

        //add flat shading to sphere
        groundMat.flatShading = true;

        this.world = new THREE.Mesh(groundGeom, groundMat);
        // groundMesh.rotateZ(THREE.Math.degToRad(90));
        this.world.translateY(-1000);
        this.world.rotateX(THREE.Math.degToRad(90));
        this.scene.add(this.world);

        //Add trees

        this.addTree(new THREE.Vector3(20, 1015, 20));
        this.addTree(new THREE.Vector3(-20, 1015, 20));


        window.addEventListener('resize', () => this.resizeHandler());
        this.resizeHandler();
        requestAnimationFrame(() => this.render());
    }

    addTree(p){
        //TREE
        this.tree = new Tree();
        //this.tree.rotateX(THREE.Math.degToRad(180));
        this.scene.add(this.tree);

        var sphericalHelper = new THREE.Spherical();



        sphericalHelper.set(p.x, p.y, p.z);
        this.tree.position.setFromSpherical(sphericalHelper);


        var ray = new THREE.Raycaster();
        ray.set(new THREE.Vector3(0,-500,0), p.normalize());
        var intersects = ray.intersectObject(this.world);

        console.log(intersects);
        console.log(intersects[0].face.normal);
        console.log(intersects[0].point);

        var newVector = new THREE.Vector3(intersects[0].face.normal.x, intersects[0].face.normal.y, intersects[0].face.normal.z);
        var newPoint = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
        console.log(newVector);


        var axis = new THREE.Vector3(0, 1, 0);
        this.tree.quaternion.setFromUnitVectors(axis, newVector.clone().normalize());
        this.tree.position.copy(newPoint.clone().multiplyScalar(1.02));

        this.world.add(this.tree);
    }

    //Game Loop
    render() {
        this.renderer.render(this.scene, this.camera);
        this.tracker.update();

        this.world.rotation.x += .01;



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

