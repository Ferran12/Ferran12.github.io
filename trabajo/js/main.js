/**
 * FERRAN PEREZ ESTEVE
 * Trabajo Final
 * main.js
 */

//Variables render
var renderer, scene, camera;

var car;
var coins = [];

//Variables 
var world, clock;

//Materiales
var groundMaterial,carMaterial;

var initZ,initX,initY;
var velocityX;

//Acaba el movimiento de la camara
var finishMove = false;

//Elimina la moneda
var remove = false;
var bodyRemove;
var firstCoin;

//Offset de la camara
var offset;

//Acciones
init();
loadScene();
render();

function initPhysicWorld()
{
    world = new CANNON.World();
    world.gravity.set(0,0,-1000);
    world.solver.iterations = 10;

    groundMaterial = new CANNON.Material("groundMaterial");
    carMaterial = new CANNON.Material("carMaterial");
    world.addMaterial(carMaterial);
    world.addMaterial(groundMaterial);

    world.defaultContactMaterial.friction = 0.0;
    world.defaultContactMaterial.restitution = 0.0;

    // Reloj
	clock = new THREE.Clock();
	clock.start();
}


function init(argument) 
{
    //Crear el motor, la escena y la camara 
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF));
    renderer.autoClear = false;
    document.getElementById("container").appendChild(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex","0");
    renderer.domElement.focus();
    
    initPhysicWorld();
  
    //Escena
    scene = new THREE.Scene();
    camera = initCamera();
    var keyboard = initInput(renderer);

    var ar = window.innerWidth / window.innerHeight;
   
    scene.add(camera);
}

function initInput(renderer)
{
    var keyboard = new THREEx.KeyboardState(renderer.domElement);

    keyboard.domElement.addEventListener('keydown', function(event){
        if(keyboard.eventMatches(event,'d')) 
        {
            if(finishMove)
                car.body.velocity.x = 250;
        }
    })
    
    keyboard.domElement.addEventListener('keydown', function(event){
        if(keyboard.eventMatches(event,'a')) 
        {
            if(finishMove)
                car.body.velocity.x = -250;
        }
    })

    return keyboard;
}



function loadScene()
{
    road = createRoad(groundMaterial,world,scene);
    scene.add(road);

    //Se añade el coche    
    car = createCar(new CANNON.Vec3(0,-4500,40), carMaterial);
    initZ = car.visual.position.z;
    scene.add(car.visual);
    world.addBody(car.body);

    //Creamos las monedas
    for(var i = 0; i < 25; i++)
    {
        var x = Math.floor(Math.random() * 250);
        var sign = Math.floor(Math.random() * 2);

        if(sign == 0)
            x = x * -1;
        
        var coin = createCoin(new CANNON.Vec3(x,-1000 + (i * 4000),60),carMaterial);

        if(i == 0)
            firstCoin = coin.body.id;

        scene.add(coin.visual);
        world.addBody(coin.body);

        coin.body.addEventListener("collide",function(e)
        {
            bodyRemove = e.target;
            remove = true;
            velocityX = car.body.velocity.x;
            initX = car.body.position.x;
            initY = car.body.position.y;
            //WARNING!!!!
            scene.remove(coins[e.target.id - firstCoin].visual);
        });

        coins.push(coin);
    }
}


function update()
{
    var targetPosition = new THREE.Vector3(0,-5000, 150 );

    if(!finishMove)
    {
        finishMove = initialMoveCamera(camera.position, targetPosition, 12);
        offset = car.body.position.y - camera.position.y;
    }
    else
    {
            camera.position.y = car.body.position.y - offset;
            car.body.velocity.y = 1500;
    }

    camera, renderer = updateAspectRatio(camera,renderer);

    updatePhysics();
}

function updatePhysics()
{
    var segundos = clock.getDelta();	
    world.step( segundos );			
    
    if(remove)
    {
        world.remove(bodyRemove);
        remove = false;
        car.body.velocity.x = velocityX;
        car.body.position.x = initX;
        car.body.position.y = initY;
    }


    car.body.position.z = initZ;

    //Actualizamos la posicion del coche
    car.visual.position.copy(car.body.position);



    //Rotamos las monedas
    for(var i = 0; i < 25; i++)
    {
        coins[i].visual.rotation.x += 0.05;
        coins[i].visual.rotation.y += 0.05;
    }
    
    //Frena el coche
    if(car.body.velocity.x >= -10 && car.body.velocity.x <= 10)
        car.body.velocity.x = 0;
    else if(car.body.velocity.x >= 10)
        car.body.velocity.x -= 2;
    else if(car.body.velocity.x <= -10)
        car.body.velocity.x += 2; 
}

function render()
{
    requestAnimationFrame(render);
    update();

    renderer.clear();

    var size;

    if(window.innerHeight > window.innerWidth)
        size = window.innerWidth / 2;
    else
        size = window.innerHeight / 2;

    renderer.setViewport( 0,0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}