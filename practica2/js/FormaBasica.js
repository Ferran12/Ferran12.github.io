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
    var ar = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(50, ar, 0.1, 100);
    scene.add(camera);
    camera.position.set(0.5,3,9);
    camera.lookAt(new THREE.Vector3(0,0,0));
}

function loadScene()
{
    // Cargar la escena con objetos 

    // Materiales 
    var material = new THREE.MeshBasicMaterial({color: 'yellow', wireframe:true});

    // Geometrias
    var geocubo = new THREE.BoxGeometry(2,2,2);
    var geoesfera = new THREE.SphereGeometry(1, 30, 30);

    var plane = new THREE.PlaneGeometry( 1000, 1000, 32 );

    //Objetos 
    cubo = new THREE.Mesh(geocubo, material);
    cubo.position.x = -1;

    var esfera = new THREE.Mesh(geoesfera, material);
    esfera.position.x = 1;

    esferacubo = new THREE.Object3D();
    esferacubo.position.y = 1;
    esferacubo.rotation.y = Math.PI/4;


    //Construir la escena 
    esferacubo.add(cubo);
    esferacubo.add(esfera);

    scene.add(esferacubo);
    scene.add(plane)
    scene.add(new THREE.AxisHelper(3));
}

function update()
{
    angulo += Math.PI/100;
    esferacubo.rotation.y = angulo/2;
    cubo.rotation.x = angulo/2;
}

function render()
{
    //Dibujar cada frame 
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}