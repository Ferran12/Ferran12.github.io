
/**
 * Seminario GPC #2. FormaBasica
 * Dibujar formas basicas con animacion 
 */

// Variables imprescindibles 


var renderer, scene, camera, camOrtografica;
var brazo, antebrazo, manoObject,pinza1,pinza11,pinza2,pinza22;

//Variables globales
var esferacubo, cubo, angulo = 0;
var r = t = 100;
var l = b = -r;

//Acciones
init();
loadScene();
setupGui();
render();

function init(argument) 
{
    //Crear el motor, la escena y la camara 
    //Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF));
    renderer.autoClear = false;
    document.getElementById("container").appendChild(renderer.domElement);

    var keyboard = new THREEx.KeyboardState(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex","0");
    renderer.domElement.focus();
    renderer.shadowMap.enabled = true;

    keyboard.domElement.addEventListener('keydown', function(event){
            if(keyboard.eventMatches(event,'up')) 
            {
                robot.position.x += 5;
                planta.position.x += 5;
            }
    })

    keyboard.domElement.addEventListener('keydown', function(event){
        if(keyboard.eventMatches(event,'down')) 
        {
           robot.position.x -= 5;
        }
    })

    keyboard.domElement.addEventListener('keydown', function(event){
        if(keyboard.eventMatches(event,'left')) 
        {
            robot.position.y += 5;
        }
    })

    keyboard.domElement.addEventListener('keydown', function(event){
        if(keyboard.eventMatches(event,'right')) 
        {
            robot.position.y -= 5;
        }
    })

    //Escena
    scene = new THREE.Scene();


    //Camara perspectiva
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableKeys = false;
    camera.position.set(-71, -423, 483);
    camera.rotation.set(0.78,0.1,-0.09);

    //Camara ortografica
    var origen = new THREE.Vector3(0,0,0);

    var ar = window.innerWidth / window.innerHeight;
   
    if(ar > 1)
    {
        //camera = new THREE.PerspectiveCamera(75, ar, 0.1, 100);
        camOrtografica = new THREE.OrthographicCamera(l*ar, r*ar, t, b, -400, 400);
    }
    else
    {
        camOrtografica = new THREE.OrthographicCamera(l, r, t/ar, b/ar, -400, 400);
    }

    camOrtografica.position.set(0,0,300);
    camOrtografica.lookAt(origen);
    camOrtografica.up = new THREE.Vector3(0,0,-1);
   
    scene.add(camera);
    scene.add(camOrtografica);
    addLight();
}

function updateAspectRatio()
{
    //Indicarle al motor las nuevas dimensiones del canvas
    renderer.setSize(window.innerWidth, window.innerHeight);

    var ar = window.innerWidth / window.innerHeight;

    if(ar > 1)
    {
        camera.left = camOrtografica.left = l * ar;
        camera.right = camOrtografica.right = r * ar;
        camera.top = camOrtografica.top = t;
        camera.bottom = camOrtografica.left = b;
    }
    else
    {   
        camera.left = camOrtografica.left = l;
        camera.right = camOrtografica.right = r;
        camera.top = camOrtografica.top = t / ar;
        camera.bottom = camOrtografica.left = b / ar; 
    }

    camera.aspect = ar;

    //Se ha variado el volumen de la vista

    camera.updateProjectionMatrix();
    camOrtografica.updateProjectionMatrix();
}

function addLight()
{
    var luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.2);
	scene.add( luzAmbiente );

	var luzPuntual = new THREE.PointLight(0xFFFFFF,0.3);
	luzPuntual.position.set( 0, 0, 100 );
	scene.add( luzPuntual );

    var luzFocal = new THREE.SpotLight(0xFFFFFF,1.0);
    luzFocal.position.set(-100,50,400);
    luzFocal.target.position.set(0,0,0);
	luzFocal.penumbra = 0.2;
    luzFocal.castShadow = true;
    luzFocal.shadowCameraFar = 1000;
    luzFocal.shadowCameraNear = 1;
	scene.add(luzFocal);
}

function loadScene()
{

    // Material
    var material = new THREE.MeshBasicMaterial({color: 'grey'});


    var textureFloor = new THREE.TextureLoader().load( 'images/floor.jpg' );
    textureFloor.wrapS = THREE.RepeatWrapping;
    textureFloor.wrapT = THREE.RepeatWrapping;
    textureFloor.repeat.set( 1,1 );
    // immediately use the texture for material creation
    var materialFloor = new THREE.MeshLambertMaterial( { map: textureFloor } );

    var paredes = [ 'images/posx.jpg','images/negx.jpg',
					'images/posy.jpg','images/negy.jpg',
					'images/posz.jpg','images/negz.jpg'
                  ];
                  
    var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);
    scene.background = mapaEntorno;

    var materialBrillante = new THREE.MeshPhongMaterial({color:'white',
		                                                 specular:'white',
		                                                 shininess: 50,
		                                                 envMap:mapaEntorno });


    var textureRobot1 = new THREE.TextureLoader().load( 'images/metal.jpg' );
    textureRobot1.wrapS = THREE.RepeatWrapping;
    textureRobot1.wrapT = THREE.RepeatWrapping;
    textureRobot1.repeat.set( 1,1 );
    // immediately use the texture for material creation
    var materialRobot1 = new THREE.MeshLambertMaterial( { map: textureRobot1 } );

    var textureWood = new THREE.TextureLoader().load( 'images/wood.jpg' );
    // immediately use the texture for material creation
    var materialWood = new THREE.MeshPhongMaterial( { map: textureWood } );


    // Cargar la escena con objetos 
    PI = 3.14
    // Suelo 
	var geometry = new THREE.PlaneGeometry( 1000, 1000, 16, 16 );
	var floor = new THREE.Mesh( geometry, materialFloor );
	floor.material.side = THREE.DoubleSide;
	floor.rotation.x = 0;
    scene.add( floor ); 
    floor.castShadow = true;
    floor.receiveShadow = true;

    //Robot 
    robot = new THREE.Object3D();
    robot.position.y = 1;

    base = new THREE.Object3D();

    //Base
    var cylinderGeometry = new THREE.CylinderGeometry( 50, 50, 15, 32 );
    var cylinder = new THREE.Mesh( cylinderGeometry, materialRobot1 );
    cylinder.rotation.x = PI / 2;
    cylinder.position.z = 10;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    base.add(cylinder);

    //Brazo 
    brazo = new THREE.Object3D();

    var esparragoGeometry = new THREE.CylinderGeometry( 20, 20, 18, 32 );
    var esparrago = new THREE.Mesh( esparragoGeometry, materialRobot1 );
    esparrago.position.z = base.position.z + 10;
    esparrago.castShadow = true;
    esparrago.receiveShadow = true;

    var ejeGeometry = new THREE.CubeGeometry( 18, 120, 4, 4 );
    var eje = new THREE.Mesh( ejeGeometry, materialRobot1 );
    eje.position.z = base.position.z + 80
    eje.rotation.x = PI/2;
    eje.castShadow = true;
    eje.receiveShadow = true;

    var sphereGeometry = new THREE.SphereGeometry( 20, 15, 6, 2 );
    var sphere = new THREE.Mesh( sphereGeometry, materialBrillante );
    sphere.position.z = base.position.z + 140;
    sphere.castShadow = true;
    sphere.receiveShadow = true;         

    brazo.add(sphere);
    brazo.add(eje);
    brazo.add(esparrago);
    
    //Antebrazo
    antebrazo = new THREE.Object3D();
    antebrazo.position.z = sphere.position.z;


    var discoGeometry = new THREE.CylinderGeometry( 22, 22, 6, 12 );
    var disco = new THREE.Mesh( discoGeometry, materialWood );
    disco.castShadow = true;
    disco.receiveShadow = true;
    disco.rotation.x = PI / 2;
    antebrazo.add(disco);

    //Nervios
    var nerviosGeometry1 = new THREE.CylinderGeometry( 5, 5, 80,3 );
    var nervios1 = new THREE.Mesh(nerviosGeometry1, materialWood);
    nervios1.rotation.x = PI / 2;
    nervios1.castShadow = true;
    nervios1.receiveShadow = true;
    nervios1.position.z = 40;
    nervios1.position.x = 10;
    nervios1.position.y = 10;
    
    antebrazo.add(nervios1);

    //Nervio 2
    var nerviosGeometry2 = new THREE.CylinderGeometry( 5, 5, 80,3 );
    var nervios2 = new THREE.Mesh(nerviosGeometry2, materialWood);
    nervios2.rotation.x = PI / 2;
    nervios2.position.z = 40;
    nervios2.position.x = -10;
    nervios2.position.y = -10;
    nervios2.castShadow = true;
    nervios2.receiveShadow = true;
    antebrazo.add(nervios2);

     //Nervio 3
     var nerviosGeometry3 = new THREE.CylinderGeometry( 5, 5, 80,3 );
     var nervios3 = new THREE.Mesh(nerviosGeometry3, materialWood);
     nervios3.rotation.x = PI / 2;
     nervios3.castShadow = true;
     nervios3.receiveShadow = true;
     nervios3.position.z =  40;
     nervios3.position.x = -10;
     nervios3.position.y = 10;
     
     antebrazo.add(nervios3);

    //Nervio 4
    var nerviosGeometry4 = new THREE.CylinderGeometry( 5, 5, 80,3 );
    var nervios4 = new THREE.Mesh(nerviosGeometry4, materialWood);
    nervios4.rotation.x = PI / 2;
    nervios4.castShadow = true;
    nervios4.receiveShadow = true;
    nervios4.position.z = 40;
    nervios4.position.x = 10;
    nervios4.position.y = -10;

    antebrazo.add(nervios4);

    manoObject = new THREE.Object3D();
    manoObject.position.z = 225 - sphere.position.z;

    //Mano
    var manoGeometry = new THREE.CylinderGeometry( 15, 15, 40, 10 );
    var mano = new THREE.Mesh(manoGeometry, materialWood);
    //mano.position.z = 225 - sphere.position.z;
    //mano.position.z = 50
   // mano.position.x = -3
  

    manoObject.add(mano);

    //Pinzas 
    var pinzaGeometry1 = new THREE.CubeGeometry(19,4,20,5);
    pinza1 = new THREE.Mesh(pinzaGeometry1, material);
    pinza1.position.z = 227 - sphere.position.z - manoObject.position.z;
    pinza1.position.x = 20;
    pinza1.position.y = 15;
    pinza1.rotation.y = PI/2;
   
    manoObject.add(pinza1);


    const geometryPinza = new THREE.Geometry();
    geometryPinza.vertices.push(
      new THREE.Vector3(-8, -2,  10),  // 0
      new THREE.Vector3( 8, -1,  3),  // 1
      new THREE.Vector3(-8,  2,  10),  // 2
      new THREE.Vector3( 8,  1,  3),  // 3
      new THREE.Vector3(-8, -2, -9),  // 4
      new THREE.Vector3( 8, -1, -9),  // 5
      new THREE.Vector3(-8,  2, -9),  // 6
      new THREE.Vector3( 8,  1, -9),  // 7
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
    
    pinza11 = new THREE.Mesh(geometryPinza, material);
    manoObject.add(pinza11);

    pinza11.position.z = 227 - sphere.position.z - manoObject.position.z;
    pinza11.position.x = 38;
    pinza11.position.y = 16;

    pinza22 = new THREE.Mesh(geometryPinza, material);
    manoObject.add(pinza22);

    pinza22.position.z = 227 - sphere.position.z - manoObject.position.z;
    pinza22.position.x = 38;
    pinza22.position.y = -14;

   
    //Pinzas 
    var pinzaGeometry2 = new THREE.CubeGeometry(19,4,20,5);
    pinza2 = new THREE.Mesh(pinzaGeometry1, material);
    pinza2.position.z = 227 - sphere.position.z - manoObject.position.z;
    pinza2.position.x = 20;
    pinza2.position.y = -15;
    pinza2.rotation.y = PI/2;
   
    manoObject.add(pinza2);
    
    antebrazo.add(manoObject);

    brazo.add(antebrazo);

    base.add(brazo);
    robot.add(base);
    scene.add(robot);
}

function onDocumentKeyDown(event)
{
   
}

function setupGui()
{
	// Definicion de los controles
	effectController = {
		mensaje: 'Interfaz',
		velang: 1,
		mover: function(grados){
			TWEEN.removeAll();
			robot.position.set(-2.5,grados,-2.5);
			//startAnimation();
		},
		sombras: true,
		color: "rgb(255,0,0)"
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
    var h = gui.addFolder("Control Robot");

    var giroBase = h.add(effectController, "velang", -180,180,1).name("Giro Base");
	giroBase.onChange( function(velang){
                            base.rotation.z = velang * (Math.PI / 180);
                          });
                          
    var giroBrazo = h.add(effectController, "velang", -45,45,1).name("Giro Brazo");
    giroBrazo.onChange( function(velang){
                            brazo.rotation.y = velang * (Math.PI / 180);
                        });

    var giroAntebrazoY = h.add(effectController, "velang", -180,180,1).name("Giro Antebrazo Y");
    giroAntebrazoY.onChange( function(velang){
                            antebrazo.rotation.z = velang * (Math.PI / 180);
                        });

    var giroAntebrazoZ = h.add(effectController, "velang", -90,90,1).name("Giro Antebrazo Z");
    giroAntebrazoZ.onChange( function(velang){
                            antebrazo.rotation.y = velang * (Math.PI / 180);
                        });

    var giroPinza= h.add(effectController, "velang", -40,220,1).name("Giro Pinza");
    giroPinza.onChange( function(velang){
                            manoObject.rotation.y = velang * (Math.PI / 180);
                    });

    var separacionPinza = h.add(effectController, "velang", 0,15,1).name("Separacion Pinza");
    separacionPinza.onChange( function(velang){
                            pinza1.position.y = velang;
                            pinza11.position.y = velang;
                            pinza2.position.y = -velang;
                            pinza22.position.y = -velang;
                    });
}


function update()
{
   // controls.update();
   //console.log(camera.position);
   //console.log(camera.rotation);
}

function render()
{
    //Dibujar cada frame 
    requestAnimationFrame(render);
    update();

    renderer.clear();

    var size;

    if(window.innerHeight > window.innerWidth)
        size = window.innerWidth / 2;
    else
        size = window.innerHeight / 2;

    renderer.setViewport(0,0, size, size);
    renderer.render(scene, camOrtografica);
    
    renderer.setViewport( 0,0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}