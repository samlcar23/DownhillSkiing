import {CubeGeometry, MeshFaceMaterial, MeshPhongMaterial, Mesh, Group, DoubleSide, TextureLoader} from 'three';
import * as THREE from 'three';

export default class Skybox {
    constructor () {
        let skyGroup = new Group();


        // let geometry = new CubeGeometry( 900, 900, 900);
        // let material =
        //     [
        //         new MeshPhongMaterial({color: 0x000000, side: DoubleSide}), //front
        //         new MeshPhongMaterial({color: 0x000000, side: DoubleSide}), //back
        //         new MeshPhongMaterial({color: 0x538fef, side: DoubleSide}), //top
        //         new MeshPhongMaterial({color: 0xffffff, side: DoubleSide}), //bottom
        //         new MeshPhongMaterial({color: 0x000000, side: DoubleSide}), //right
        //         new MeshPhongMaterial({color: 0x000000, side: DoubleSide}), //left
        //     ];
        //
        // let box = new Mesh( geometry, material );
        // skyGroup.add(box);

        let box = this.makeGradientCube(0xaeefc0, 0x538fef, 3000, 3000, 3000, 1);
        skyGroup.add(box);

        return skyGroup;
    }

    //Source for gradient cube
    //http://darrendev.blogspot.com/2016/03/gradients-in-threejs.html
    makeGradientCube(c1, c2, w, d, h, opacity){
        if(typeof opacity === 'undefined')opacity = 1.0;
        if(typeof c1 === 'number')c1 = new THREE.Color( c1 );
        if(typeof c2 === 'number')c2 = new THREE.Color( c2 );

        var cubeGeometry = new THREE.BoxGeometry(w, h, d);

        var cubeMaterial = new THREE.MeshPhongMaterial({
            vertexColors:THREE.VertexColors, side: DoubleSide
        });

        if(opacity < 1.0){
            cubeMaterial.opacity = opacity;
            cubeMaterial.transparent = true;
        }

        for(var ix=0;ix<12;++ix){
            if(ix==4 || ix==5){ //Top edge, all c2
                cubeGeometry.faces[ix].vertexColors = [c2,c2,c2];
            }
            else if(ix==6 || ix==7){ //Bottom edge, all c1
                cubeGeometry.faces[ix].vertexColors = [c1,c1,c1];
            }
            else if(ix%2 ==0){ //First triangle on each side edge
                cubeGeometry.faces[ix].vertexColors = [c2,c1,c2];
            }
            else{ //Second triangle on each side edge
                cubeGeometry.faces[ix].vertexColors = [c1,c1,c2];
            }
        }

        return new THREE.Mesh(cubeGeometry, cubeMaterial);
    }
}