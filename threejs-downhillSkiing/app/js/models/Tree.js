import { TorusGeometry, CylinderGeometry, MeshPhongMaterial, Mesh, Group} from 'three';
import * as THREE from 'three';

export default class Tree {
    constructor () { // number of spokes on the wheel


        const treeGroup = new Group();

        //trunk
        var geometry = new THREE.CylinderGeometry(5, 10, 40, 8);
        var material = new THREE.MeshPhongMaterial( {color: 0x472503} );
        var trunk = new THREE.Mesh( geometry, material );
        trunk.castShadow = true;
        treeGroup.add( trunk );

        //leaves 1
        var geometry1 = new THREE.ConeGeometry(25, 30, 6);
        var material1 = new THREE.MeshPhongMaterial({color: 0x0F6128});
        var cone1 = new THREE.Mesh( geometry1, material1 );
        cone1.translateY(20);
        cone1.castShadow = true;
        treeGroup.add( cone1 );

        //leaves 2
        var geometry2 = new THREE.ConeGeometry(20, 25, 6);
        var material2 = new THREE.MeshPhongMaterial({color: 0x0F6128});
        var cone2 = new THREE.Mesh( geometry2, material2);
        cone2.translateY(35);
        cone2.rotateY(THREE.Math.degToRad(20));
        cone2.castShadow = true;
        treeGroup.add( cone2 );

        //leaves 3
        var geometry3 = new THREE.ConeGeometry(10, 20, 6);
        var material3;
        material3 = new THREE.MeshPhongMaterial({color: 0x0F6128});
        var cone3 = new THREE.Mesh( geometry3, material3);
        cone3.translateY(50);
        cone3.rotateY(THREE.Math.degToRad(40));
        cone3.castShadow = true;
        treeGroup.add( cone3 );


        return treeGroup;   // the constructor must return the entire group
    }
}
