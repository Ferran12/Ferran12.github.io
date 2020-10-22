/**
 * FERRAN PEREZ ESTEVE
 * Trabajo Final
 * main.js
 */

//Variables render
var renderer, scene, camera;
var luzFocal;
var text;
var stars = 0;
var win = false;

var start = false;
var again = false;
var die = false;
var time = 0;

var car;
var ship = null;
var ship_id;
var coins = [];

var inclinarIzq = false, inclinarDer = false;

var obstacleHorizontal = [];
var obstacleVertical = [];

//Variables
var world, clock;

//Materiales
var groundMaterial,carMaterial;

var initZ,initX,initY;
var velocityX;

//Acaba el movimiento de la camara
var finishMove = false;

//Final del juego
var end = false;

var light;

//Elimina la moneda
var remove = false;
var bodyRemove;
var firstCoin;

//Offset de la camara
var offset;

var sound,listener;

//Acciones
init();
loadScene();
render();

function startVariable()
{
    win = false;
    start = false;
    stars = 0;
    again = false;
    counter = 0;
    die = false;

    ship = null;
    coins = [];

    inclinarIzq = false;
    inclinarDer = false;

    obstacleHorizontal = [];
    obstacleVertical = [];


    //Acaba el movimiento de la camara
    finishMove = false;

    //Final del juego
    end = false;

    //Elimina la moneda
    remove = false;
}

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


function startGame()
{
    start = true;
    var texture = new THREE.TextureLoader().load( 'textures/sky.jpg' );
    scene.background = texture;
    camera.position.set(0, -6500, 480);
    addText();
}

function dieScene()
{
    var texture = new THREE.TextureLoader().load( 'textures/died.png' );
    scene.background = texture;
}

function endScene()
{
    var texture = new THREE.TextureLoader().load( 'textures/end.png' );
    scene.background = texture;
}

function addText()
{
  text = document.getElementById('text');
  text.style.position = 'absolute';
  text.style.width = 300 + "px" ;
  text.style.zIndex= 100 + "px";
  text.style.height = 300 + "px";
  text.style.color = "white";
  text.style.fontFamily = "Impact";
  text.style.fontWeight = "bold";
  text.style.fontSize = "xxx-large";
  text.style.fontStyle = "italic";
  text.innerHTML = "SCORE: 0";
  text.style.top = 60 + 'px';
  text.style.left = 40 + 'px';
}

function updateText()
{
  text = document.getElementById('text');
  text.innerHTML = "SCORE: " + stars;
}

function init(argument)
{
        //Crear el motor, la escena y la camara

        if(!die)
        {
          renderer = new THREE.WebGLRenderer();
          renderer.setSize(window.innerWidth, window.innerHeight);
          //renderer.setClearColor(new THREE.Color(0xFFFFFF));
          renderer.autoClear = false;
          document.getElementById("container").appendChild(renderer.domElement);
          renderer.domElement.setAttribute("tabIndex","0");
          renderer.domElement.focus();
          renderer.shadowMap.enabled = true;  

          listener = new THREE.AudioListener();
          var audioLoader = new THREE.AudioLoader();

          // create a global audio source
          sound = new THREE.Audio( listener );

        // load a sound and set it as the Audio object's buffer
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'sound/music.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop(true);
            sound.setVolume(0.9);
            sound.play();
        });

        document.documentElement.addEventListener(
            "keydown", function(){
                if(listener.context.state !== 'running')
                    listener.context.resume()
            })
        }

        initPhysicWorld();  
        startVariable();

        scene = new THREE.Scene();

        var luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.55);
        scene.add( luzAmbiente );

        camera = initCamera();
        var keyboard = initInput(renderer);

        var ar = window.innerWidth / window.innerHeight;

    
        scene.add(camera);

        keyboard.domElement.addEventListener('keydown', function(event){

            if(!start || die)
            {
                if((die &&  performance.now() - time > 500) || (!start && !die))
                {
                    startGame();
                    die = false;
                }
            }
        })
}


function initInput(renderer)
{
    var keyboard = new THREEx.KeyboardState(renderer.domElement);

    keyboard.domElement.addEventListener('keydown', function(event){
        if(keyboard.eventMatches(event,'d'))
        {
            if(finishMove)
            {
                car.body.velocity.x = 250;
                inclinarDer = true;
                inclinarIzq = false;
            }
        }
    })

    keyboard.domElement.addEventListener('keydown', function(event){
        if(keyboard.eventMatches(event,'a'))
        {
            if(finishMove)
            {
                inclinarIzq = true;
                inclinarDer = false;
                car.body.velocity.x = -250;
            }
        }
    })

    return keyboard;
}

function generateRandomX()
{
    var x = Math.floor(Math.random() * 250);
    var sign = Math.floor(Math.random() * 2);

    if(sign == 0)
        x = x * -1;

    return x;
}

function loadCoins()
{
      //Creamos las monedas
      for(var i = 0; i < 25; i++)
      {
          var x = generateRandomX();

          var coin = createCoin(new CANNON.Vec3(x,-1000 + (i * 4000),60),carMaterial);

          if(i == 0)
              firstCoin = coin.body.id;

          scene.add(coin.visual);
          world.addBody(coin.body);

          coin.body.addEventListener("collide",function(e)
          {
              bodyRemove = e.target;
              remove = true;
              stars += 1;
              updateText();
              //WARNING!!!!
              scene.remove(coins[e.target.id - firstCoin].visual);
          });

          coins.push(coin);
      }
}

function loadObstacles()
{
    for(var i = 0; i < 25; i++)
    {
        var x = generateRandomX();
        var obstacle;
        obstacle = createObstacle(new CANNON.Vec3(x,-2000 + (i * 8000),95), carMaterial,true);

        scene.add(obstacle.visual);
        world.addBody(obstacle.body);

        obstacle.body.addEventListener("collide",function(e)
        {
           end = true;
           car.body.velocity.x = 0;
           car.body.velocity.y = 0;
           again = true;
           die = true;
        });

        obstacleHorizontal.push(obstacle);
    }

    for(var i = 0; i < 25; i++)
    {
            var x = generateRandomX();
            var obstacle;
            obstacle = createObstacle(new CANNON.Vec3(x,(i * 8000),95), carMaterial, false);

            scene.add(obstacle.visual);
            world.addBody(obstacle.body);

            obstacle.body.addEventListener("collide",function(e)
            {
               end = true;
               car.body.velocity.x = 0;
               car.body.velocity.y = 0;
               again = true;
               die = true;
            });
    }
}

function loadScene()
{
    road = createRoad(groundMaterial,world,scene);

    //Se añade el coche
    car = createCar(new CANNON.Vec3(0,-4500,70), carMaterial,scene);
    initZ = car.body.position.z;
    world.addBody(car.body);
    loadCoins();
    loadObstacles();

    var loader = new THREE.ObjectLoader();

    loader.load('models/nave/nave.json', function ( object ) {
        object.position.copy(car.body.position);
        object.scale.set(50,50,50);
        car.visual = object;
        scene.add(car.visual);
    } );


    luzFocal = new THREE.SpotLight(0xFFFFFF,0.8);
    luzFocal.position.copy(camera.position);
    luzFocal.position.z += 600;
    luzFocal.target.position.copy(new THREE.Vector3(0,100000,0));
    //luzFocal.angle = 40 * (Math.PI / 180);
    luzFocal.penumbra = 0.5;
    luzFocal.castShadow = true;
 
    scene.add(luzFocal.target)
    scene.add( luzFocal );
    

    var texture = new THREE.TextureLoader().load( 'textures/start.png' );
    camera.position.set(-100000,-1000000,-10000);
    scene.background = texture;
}

function update()
{
    luzFocal.position.y = car.body.position.y - 2500;

    if(again)
    {
        var win_aux = win;
        init();
        die = true;
        again = false;
        loadScene();

        if(win_aux)
            endScene();
        else
            dieScene();

        time = performance.now();
        text = document.getElementById('text');
        text.innerHTML = "";
    }
    else if(car.body.position.y > 99000)
    {
        end = true;
        car.body.velocity.x = 0;
        car.body.velocity.y = 0;
        again = true;
        die = true;
        win = true;
    }
    else if(start)
    {
        var targetPosition = new THREE.Vector3(0,-5000, 150 );
        //light.position.copy(car.body.position);

        if(!finishMove)
        {
            finishMove = initialMoveCamera(camera.position, targetPosition, 12);
            offset = car.body.position.y - camera.position.y;
        }
        else
        {
                if(!end)
                {
                    camera.position.y = car.body.position.y - offset;
                    car.body.velocity.y = 1600;
                }
                else
                {
                    car.body.velocity.x = 0;
                    car.body.velocity.y = 0;
                }
        }
    }

    camera, renderer = updateAspectRatio(camera,renderer);
    updatePhysics();
}

function updateCoins()
{
       //Rotamos las monedas
       for(var i = 0; i < 25; i++)
       {
           coins[i].visual.rotation.x += 0.05;
           coins[i].visual.rotation.y += 0.05;
       }
}

function updateCar()
{
    if(!end)
    {
        if(inclinarIzq)
        {
            if(car.visual.rotation.y < -(8 * (Math.PI/180)))
                inclinarIzq = false;
            else
                car.visual.rotation.y -= (1 * (Math.PI/180));
        }
        else if(inclinarDer)
        {
            if(car.visual.rotation.y > (8 * (Math.PI/180)))
                inclinarDer = false;
            else
                car.visual.rotation.y += (1 * (Math.PI/180));
        }
    }

    car.body.position.z = initZ;

    //Frena el coche
    if(car.body.velocity.x >= -10 && car.body.velocity.x <= 10)
        car.body.velocity.x = 0;
    else if(car.body.velocity.x >= 10)
        car.body.velocity.x -= 2;
    else if(car.body.velocity.x <= -10)
        car.body.velocity.x += 2;
}

function updateObstacles()
{
    for(var i = 0; i < 25; i++)
    {
            if(obstacleHorizontal[i].body.position.x < -250)
                obstacleHorizontal[i].left = false;
            else if(obstacleHorizontal[i].body.position.x > 250)
                obstacleHorizontal[i].left = true;

            if(obstacleHorizontal[i].left )
                obstacleHorizontal[i].body.position.x -= 5 + obstacleHorizontal[i].vel;
            else
                obstacleHorizontal[i].body.position.x += 5  + obstacleHorizontal[i].vel;

            obstacleHorizontal[i].visual.position.copy(obstacleHorizontal[i].body.position);
            obstacleHorizontal[i].visual.position.y += 150;
    }
}

function updatePhysics()
{
    if(car.visual != null)
    {
        car.visual.position.copy(car.body.position);
    }

    var segundos = clock.getDelta();
    world.step( segundos );

    if(remove)
    {
        world.remove(bodyRemove);
        remove = false;
    }

    updateCoins();
    updateCar();

    if(!end)
        updateObstacles();
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
