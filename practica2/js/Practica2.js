
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
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    camera.position.set(-50, 150, 700);
    camera.rotation.x = 0.1;
    scene.add(camera);
}

function loadScene()
{

    // Material
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true});

    // Cargar la escena con objetos 
    PI = 3.14
    // Suelo 
	var geometry = new THREE.PlaneGeometry( 1000, 1000, 16, 16 );
	var floor = new THREE.Mesh( geometry, material );
	floor.material.side = THREE.DoubleSide;
	floor.rotation.x = 0;
    scene.add( floor ); 

    //Robot 
    robot = new THREE.Object3D();
    robot.position.y = 1;

    base = new THREE.Object3D();

    //Base
    var cylinderGeometry = new THREE.CylinderGeometry( 50, 50, 15, 32 );
    var cylinder = new THREE.Mesh( cylinderGeometry, material );
    cylinder.rotation.x = PI / 2;
    cylinder.position.z = 10

    base.add(cylinder);


    //Brazo 
    var brazo = new THREE.Object3D();

    var esparragoGeometry = new THREE.CylinderGeometry( 20, 20, 18, 32 );
    var esparrago = new THREE.Mesh( esparragoGeometry, material );
    esparrago.position.z = base.position.z + 10;

    var ejeGeometry = new THREE.CubeGeometry( 18, 120, 4, 4 );
    var eje = new THREE.Mesh( ejeGeometry, material );
    eje.position.z = base.position.z + 80
    eje.rotation.x = PI/2;

    var sphereGeometry = new THREE.SphereGeometry( 20, 15, 6, 2 );
    var sphere = new THREE.Mesh( sphereGeometry, material );
    sphere.position.z = base.position.z + 140;
   

    brazo.add(sphere);
    brazo.add(eje);
    brazo.add(esparrago);
    
    //Antebrazo
    var antebrazo = new THREE.Object3D();


    var discoGeometry = new THREE.CylinderGeometry( 22, 22, 6, 12 );
    var disco = new THREE.Mesh( discoGeometry, material );
    disco.position.z = sphere.position.z;
    disco.rotation.x = PI / 2;
    antebrazo.add(disco);

    //Nervios
    var nerviosGeometry1 = new THREE.CylinderGeometry( 5, 5, 80,3 );
    var nervios1 = new THREE.Mesh(nerviosGeometry1, material);
    nervios1.rotation.x = PI / 2;
    
    nervios1.position.z = sphere.position.z + 40;
    nervios1.position.x = 10;
    nervios1.position.y = 10;
    
    antebrazo.add(nervios1);

    //Nervio 2
    var nerviosGeometry2 = new THREE.CylinderGeometry( 5, 5, 80,3 );
    var nervios2 = new THREE.Mesh(nerviosGeometry2, material);
    nervios2.rotation.x = PI / 2;
    
    nervios2.position.z = sphere.position.z + 40;
    nervios2.position.x = -10;
    nervios2.position.y = -10;
    
    antebrazo.add(nervios2);

     //Nervio 3
     var nerviosGeometry3 = new THREE.CylinderGeometry( 5, 5, 80,3 );
     var nervios3 = new THREE.Mesh(nerviosGeometry3, material);
     nervios3.rotation.x = PI / 2;
     
     nervios3.position.z = sphere.position.z + 40;
     nervios3.position.x = -10;
     nervios3.position.y = 10;
     
     antebrazo.add(nervios3);

    //Nervio 4
    var nerviosGeometry4 = new THREE.CylinderGeometry( 5, 5, 80,3 );
    var nervios4 = new THREE.Mesh(nerviosGeometry4, material);
    nervios4.rotation.x = PI / 2;

    nervios4.position.z = sphere.position.z + 40;
    nervios4.position.x = 10;
    nervios4.position.y = -10;

    antebrazo.add(nervios4);

    var manoObject = new THREE.Object3D();

    //Mano
    var manoGeometry = new THREE.CylinderGeometry( 15, 15, 40, 10 );
    var mano = new THREE.Mesh(manoGeometry, material);
    mano.position.z = 225;
    //mano.position.z = 50
   // mano.position.x = -3
  

    manoObject.add(mano);

    //Pinzas 
    var pinzaGeometry1 = new THREE.CubeGeometry(19,4,20,5);
    var pinza1 = new THREE.Mesh(pinzaGeometry1, material);
    pinza1.position.z = 227;
    pinza1.position.x = 20;
    pinza1.position.y = 15;
    pinza1.rotation.y = PI/2;
   
    manoObject.add(pinza1);

    //Pinzas 11
    var pinzaGeometry11 = new THREE.CubeGeometry(19,4,20,5);
    var pinza11 = new THREE.Mesh(pinzaGeometry11, material);
    pinza11.position.z = 227;
    pinza11.position.x = 40;
    pinza11.position.y = 15;
    pinza11.rotation.y = PI/2;
   
    manoObject.add(pinza11);

    const geometryPinza = new THREE.Geometry();
    geometryPinza.vertices.push(
      new THREE.Vector3(-50, -100,  100),  // 0
      new THREE.Vector3( 50, -100,  100),  // 1
      new THREE.Vector3(-100,  100,  100),  // 2
      new THREE.Vector3( 100,  100,  100),  // 3
      new THREE.Vector3(-100, -100, -100),  // 4
      new THREE.Vector3( 100, -100, -100),  // 5
      new THREE.Vector3(-100,  100, -100),  // 6
      new THREE.Vector3( 100,  100, -100),  // 7
    );

    geometryPinza.faces.push(
        // front
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(0, 1, 3),
        // right
        new THREE.Face3(1, 7, 3),
        new THREE.Face3(1, 5, 7),
        // back
        new THREE.Face3(5, 6, 7),
        new THREE.Face3(5, 4, 6),
        // left
        new THREE.Face3(4, 2, 6),
        new THREE.Face3(4, 0, 2),
        // top
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(2, 3, 7),
        // bottom
        new THREE.Face3(4, 1, 0),
        new THREE.Face3(4, 5, 1),
      );
    
    const cube = new THREE.Mesh(geometryPinza, material);
    cube.position.y = 300
    scene.add(cube);

    //Pinzas 
    var pinzaGeometry2 = new THREE.CubeGeometry(19,4,20,5);
    var pinza2 = new THREE.Mesh(pinzaGeometry1, material);
    pinza2.position.z = 227;
    pinza2.position.x = 20;
    pinza2.position.y = -15;
    pinza2.rotation.y = PI/2;
   
    manoObject.add(pinza2);
    
    antebrazo.add(manoObject);

    brazo.add(antebrazo);

    base.add(brazo);
    robot.add( base );
    scene.add( robot );

 
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