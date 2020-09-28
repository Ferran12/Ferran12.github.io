/**
 * Seminario GPC #2. FormaBasica
 * Dibujar formas basicas con animacion 
 */

// Variables imprescindibles 
var renderer, scene, camera;

//Variables globales
var esferacubo, cubo, angulo = 0;

//Acciones
init();
loadScene();
render();

function init(argument) 
{
    //Crear el motor, la escena y la camara 


    //Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000AA));
    document.getElementById("container").appendChild(renderer.domElement);

    //Escena
    scene = new THREE.Scene();


    //Camara 
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(-50, 100, 500);
    camera.rotation.x = 0.1;
    var controls = new OrbitControls( camera, renderer.domElement )
    scene.add(camera);

}

function loadScene()
{

    // Material
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true});

    // Cargar la escena con objetos 

    // Suelo 
	var geometry = new THREE.PlaneGeometry( 1000, 1000, 16, 16 );
	var floor = new THREE.Mesh( geometry, material );
	floor.material.side = THREE.DoubleSide;
	floor.rotation.x = 90;
    scene.add( floor ); 

    //Robot 
    robot = new THREE.Object3D();
    robot.position.y = 1;

    base = new THREE.Object3D();

    //Base
    var cylinderGeometry = new THREE.CylinderGeometry( 50, 50, 15, 32 );
    var cylinder = new THREE.Mesh( cylinderGeometry, material );
    cylinder.rotation.x = 120;
    base.add(cylinder);


    //Brazo 
    var brazo = new THREE.Object3D();

    var esparragoGeometry = new THREE.CylinderGeometry( 20, 20, 18, 32 );
    var esparrago = new THREE.Mesh( esparragoGeometry, material );
    esparrago.rotation.z = 180;
    esparrago.rotation.y = 175;

    var ejeGeometry = new THREE.CubeGeometry( 18, 120, 4, 4 );
    var eje = new THREE.Mesh( ejeGeometry, material );
    eje.position.y = 60

    var sphereGeometry = new THREE.SphereGeometry( 20, 15, 6, 2 );
    var sphere = new THREE.Mesh( sphereGeometry, material );
    sphere.position.y = 120
   

    brazo.add(sphere);
    brazo.add(eje);
    brazo.add(esparrago);
    
    //Antebrazo
    var antebrazo = new THREE.Object3D();


    var discoGeometry = new THREE.CylinderGeometry( 22, 22, 5, 12 );
    var disco = new THREE.Mesh( discoGeometry, material );
    disco.rotation.x = 100;
    disco.position.y = 120;
    antebrazo.add(disco);

    //Nervios
    var nerviosGeometry1 = new THREE.CylinderGeometry( 5, 5, 80,3 );
    var nervios1 = new THREE.Mesh(nerviosGeometry1, material);
    nervios1.position.y = 170;
    nervios1.position.x = -14;
    nervios1.position.z = -5;
    antebrazo.add(nervios1);

    var nerviosGeometry2 = new THREE.CylinderGeometry( 5, 5, 80, 3 );
    var nervios2 = new THREE.Mesh(nerviosGeometry2, material);
    nervios2.position.y = 170;
    nervios2.position.x = 14;
    nervios2.position.z = 5;
    antebrazo.add(nervios2);

    var nerviosGeometry3 = new THREE.CylinderGeometry( 5, 5, 80, 3 );
    var nervios3 = new THREE.Mesh(nerviosGeometry3, material);
    nervios3.position.y = 170;
    nervios3.position.x = 0;
    nervios3.position.z = -5;
    antebrazo.add(nervios3);

    var nerviosGeometry4 = new THREE.CylinderGeometry( 5, 5, 80, 2 );
    var nervios4 = new THREE.Mesh(nerviosGeometry4, material);
    nervios4.position.y = 170;
    nervios4.position.x = -12;
    nervios4.position.z = 0;
    antebrazo.add(nervios4);

    var manoObject = new THREE.Object3D();

    //Mano
    var manoGeometry = new THREE.CylinderGeometry( 15, 15, 40, 20 );
    var mano = new THREE.Mesh(manoGeometry, material);
    mano.position.y = 220;
    //mano.position.z = 50
   // mano.position.x = -3
    mano.rotation.x = 90;
    mano.rotation.z = 180;
    manoObject.add(mano);

    //Pinzas 
    var pinzaGeometry1 = new THREE.CubeGeometry(20,19,4,3);
    var pinza1 = new THREE.Mesh(pinzaGeometry1, material);
    pinza1.position.y = 190;
    pinza1.position.z = 150;
    pinza1.position.x = 0;

    pinza1.rotation.x = 0.75;
    pinza1.rotation.y = 0.5;
    manoObject.add(pinza1);
    
    antebrazo.add(manoObject);

    brazo.add(antebrazo);

    base.add(brazo);
    robot.add( base );
    scene.add( robot );

 
}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    if ( isMouseDown ) {

        theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 )
                + onMouseDownTheta;
        phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 )
              + onMouseDownPhi;

        phi = Math.min( 180, Math.max( 0, phi ) );

        camera.position.x = radious * Math.sin( theta * Math.PI / 360 )
                            * Math.cos( phi * Math.PI / 360 );
        camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
        camera.position.z = radious * Math.cos( theta * Math.PI / 360 )
                            * Math.cos( phi * Math.PI / 360 );
        camera.updateMatrix();

    }

    mouse3D = projector.unprojectVector(
        new THREE.Vector3(
            ( event.clientX / renderer.domElement.width ) * 2 - 1,
            - ( event.clientY / renderer.domElement.height ) * 2 + 1,
            0.5
        ),
        camera
    );
    ray.direction = mouse3D.subSelf( camera.position ).normalize();

    interact();
    render();

}

function update()
{
   // controls.update();
}

function render()
{
    //Dibujar cada frame 
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}