//Crea una carretera
function createRoad(groundMaterial, world, scene)
{
        //Pared vertical
       //groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI/2);
       //Fisica suelo
       var groundShape = new CANNON.Plane();
       var groundBody = new CANNON.Body({mass: 0, groundMaterial});
       groundBody.addShape(groundShape);
       groundBody.position.copy(new CANNON.Vec3(0,0,-35));
       groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),Math.PI/2);

       //Fisica pared derecha
       var wallRightShape = new CANNON.Plane();
       var wallRightBody = new CANNON.Body({mass: 0, groundMaterial});
       wallRightBody.addShape(wallRightShape);
       wallRightBody.position.copy(new CANNON.Vec3(400,0,0));
       wallRightBody.quaternion.setFromEuler(0,-Math.PI/2,0,'XYZ');

        //Fisica pared derecha
        var wallLeftShape = new CANNON.Plane();
        var wallLeftBody = new CANNON.Body({mass: 0, groundMaterial});
        wallLeftBody.addShape(wallLeftShape);
        wallLeftBody.position.copy(new CANNON.Vec3(-400,0,0));
        wallLeftBody.quaternion.setFromEuler(0,Math.PI/2,0,'XYZ');


        world.addBody(wallLeftBody);
        world.addBody(wallRightBody);
        world.addBody(groundBody);

        /*
        * VISUAL
        */
       // Material

       var texture = new THREE.TextureLoader().load( 'textures/hexagon.png' );
       texture.wrapS = THREE.RepeatWrapping;
       texture.wrapT = THREE.RepeatWrapping;
       texture.repeat.set( 4,500 );
       // immediately use the texture for material creation
       var material = new THREE.MeshPhongMaterial( { map: texture} );

       var textureWall = new THREE.TextureLoader().load( 'textures/floor4.jpg');

      // immediately use the texture for material creation
      var materialWall = new THREE.MeshPhongMaterial( { map: textureWall } );


       // Suelo
       for(var i = 0; i < 1; i++)
       {
        var geometry = new THREE.PlaneGeometry( 1200, 500000, 100, 1000 );
        var floor = new THREE.Mesh( geometry, material );
        floor.castShadow = true;
        floor.receiveShadow = true;
        floor.position += i * 9000;
        scene.add(floor);
       }


       //Pared derecha
       var geometry = new THREE.CubeGeometry( 1000000, 100, 30, 1000 );
       var wallRight = new THREE.Mesh( geometry, materialWall );
       wallRight.castShadow = true;
       wallRight.receiveShadow = true;
       wallRight.rotation.x = 90 * (Math.PI / 180);
       wallRight.rotation.y = 90 * (Math.PI / 180);
       wallRight.position.z = 50;
       wallRight.position.x = 450;
       wallRight.material.side = THREE.DoubleSide;


       //Pared izquierda
       var geometry = new THREE.CubeGeometry( 1000000, 100, 30, 1000 );
       var wallLeft = new THREE.Mesh( geometry, materialWall );
       wallLeft.castShadow = true;
       wallLeft.receiveShadow = true;
       wallLeft.rotation.x = 90 * (Math.PI / 180);
       wallLeft.rotation.y = 90 * (Math.PI / 180);
       wallLeft.position.z = 50;
       wallLeft.position.x = -450;
       wallLeft.material.side = THREE.DoubleSide;

       addBeaty(scene);
       //scene.add(wallLeft);
       //scene.add(wallRight);
       //scene.add(floor);
}

function addBeaty(scene)
{
    var textureWall = new THREE.TextureLoader().load( 'textures/floor3.jpg' );
    textureWall.wrapS = THREE.RepeatWrapping;
    textureWall.wrapT = THREE.RepeatWrapping;
    textureWall.repeat.set( 10,4 );

    // immediately use the texture for material creation
    var materialWall = new THREE.MeshPhongMaterial( { map: textureWall } );

    for(var i = 0; i < 30; i++)
    {
        var geometry = new THREE.CylinderGeometry( 40, 50, 10000, 32 );
        var wallLeft = new THREE.Mesh( geometry, materialWall );
        wallLeft.castShadow = true;
        wallLeft.receiveShadow = true;
        wallLeft.position.x = -500;
        wallLeft.position.y = -1000 + (i *8000);
        wallLeft.position.z = 80;
        scene.add(wallLeft);

        var geometry = new THREE.CylinderGeometry( 40, 50, 10000, 32 );
        var wallRight = new THREE.Mesh( geometry, materialWall );
        wallRight.castShadow = true;
        wallRight.receiveShadow = true;
        wallRight.position.x = 500;
        wallRight.position.y = -1000 + (i *8000);
        wallRight.position.z = 80;
        scene.add(wallRight);
    }
}

//Crea un "recolectable" dentro del juego
function createCoin(posicion,material)
{
	var body = new CANNON.Body( {mass: 0, material: material} );
	body.addShape( new CANNON.Sphere(50));
    body.position.copy( posicion );
    body.collisionResponse = false;

    var materialMesh = new THREE.MeshPhongMaterial({color: 'red', wireframe:true});

    var texture = new THREE.TextureLoader().load( 'textures/ball.jpg' );
    // immediately use the texture for material creation
    var material = new THREE.MeshPhongMaterial( { map: texture } );

    var geometry = new THREE.SphereGeometry( 50 );
    var coinMesh = new THREE.Mesh( geometry, material );
    coinMesh.castShadow = true;
    coinMesh.receiveShadow = true;
    coinMesh.position.copy( body.position );
    var coin = {visual: coinMesh, body: body};

    return coin;
}

function createObstacle(posicion,material,move)
{
    var body = new CANNON.Body( {mass:0, material:groundMaterial} );

    if(move)
        body.addShape( new CANNON.Box(new CANNON.Vec3(65,1,70)) );
    else
        body.addShape( new CANNON.Box(new CANNON.Vec3(90,1,70)) );

    body.position.copy(posicion);

    //Material
    var geometry;

    if(move)
        geometry = new THREE.CubeGeometry( 210, 200, 300, 32 );
    else
        geometry = new THREE.CubeGeometry( 310, 200, 200, 32 );

    var texture = new THREE.TextureLoader().load( 'textures/floor4.jpg' );
    // immediately use the texture for material creation
    var material = new THREE.MeshLambertMaterial( { map: texture } );


    var mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.copy(body.position);
    body.position.y -= 100;
    body.position.x -= 25;
    mesh.material.side = THREE.DoubleSide;

    var left = false;

    if(Math.floor(Math.random() * 2) == 0)
        left = true;

    var velocity = Math.floor(Math.random() * 3);

    var obstacle = {visual: mesh, body: body, left: left, vel: velocity};
    return obstacle;
}

function createCar(posicion, carMaterial)
{
    var masa = 10;

    var body = new CANNON.Body({mass: masa, material: carMaterial});
    body.addShape(new CANNON.Box(new CANNON.Vec3(75,125,75)));
    body.position.copy(posicion);

    //Material
    var material = new THREE.MeshPhongMaterial({color: 'red', wireframe:true});
    //Objeto 3D que contiene el coche
    //Pared izquierda

    var car = {visual: null, body: body};
    return car;
}
