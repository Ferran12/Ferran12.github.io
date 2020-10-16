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
       wallRightBody.position.copy(new CANNON.Vec3(500,0,0));
       wallRightBody.quaternion.setFromEuler(0,-Math.PI/2,0,'XYZ');
       
        //Fisica pared derecha
        var wallLeftShape = new CANNON.Plane();
        var wallLeftBody = new CANNON.Body({mass: 0, groundMaterial});
        wallLeftBody.addShape(wallLeftShape);
        wallLeftBody.position.copy(new CANNON.Vec3(-500,0,0));
        wallLeftBody.quaternion.setFromEuler(0,Math.PI/2,0,'XYZ');

    
        world.addBody(wallLeftBody);
        world.addBody(wallRightBody);
        world.addBody(groundBody);

        /*
        * VISUAL
        */
       // Material
       var material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true});
   
       // Suelo 
       var geometry = new THREE.PlaneGeometry( 900, 1000000, 16, 1000 );
       var floor = new THREE.Mesh( geometry, material );
       floor.material.side = THREE.DoubleSide;
   
       //Pared derecha 
       var geometry = new THREE.CubeGeometry( 1000000, 100, 16, 1000 );
       var wallRight = new THREE.Mesh( geometry, material );
       wallRight.rotation.x = 90 * (Math.PI / 180);
       wallRight.rotation.y = 90 * (Math.PI / 180);
       wallRight.position.z = 50;
       wallRight.position.x = 450;
       wallRight.material.side = THREE.DoubleSide;
   
   
       //Pared izquierda 
       var geometry = new THREE.CubeGeometry( 1000000, 100, 16, 1000 );
       var wallLeft = new THREE.Mesh( geometry, material );
       wallLeft.rotation.x = 90 * (Math.PI / 180);
       wallLeft.rotation.y = 90 * (Math.PI / 180);
       wallLeft.position.z = 50;
       wallLeft.position.x = -450;
       wallLeft.material.side = THREE.DoubleSide;

       scene.add(wallLeft);
       scene.add(wallRight);
       scene.add(floor);
}

//Crea un "recolectable" dentro del juego
function createCoin(posicion,material)
{
	var body = new CANNON.Body( {mass: 0, material: material} );
	body.addShape( new CANNON.Sphere(50));
    body.position.copy( posicion );
    body.collisionResponse = false;
    
    var materialMesh = new THREE.MeshBasicMaterial({color: 'red', wireframe:true});

     
    var geometry = new THREE.SphereGeometry( 50 );
    var coinMesh = new THREE.Mesh( geometry, materialMesh );
    coinMesh.position.copy( body.position );
    var coin = {visual: coinMesh, body: body};

    return coin;
}

function createObstacle(posicion,material,move)
{
    var body = new CANNON.Body( {mass:0, material:groundMaterial} );

    if(move)
        body.addShape( new CANNON.Box(new CANNON.Vec3(40,1,70)) );
    else
        body.addShape( new CANNON.Box(new CANNON.Vec3(70,1,70)) );

    body.position.copy(posicion);

    //Material
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true});
    var geometry;

    if(move)
        geometry = new THREE.CubeGeometry( 200, 200, 300, 32 );
    else
        geometry = new THREE.CubeGeometry( 300, 200, 200, 32 );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.copy(body.position);
    body.position.y -= 100;
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
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true});
    //Objeto 3D que contiene el coche
    //Pared izquierda 
     
    var geometry = new THREE.CubeGeometry( 125, 125, 75, 32 );
    var carMesh = new THREE.Mesh( geometry, material );
    carMesh.position.copy(body.position);
    carMesh.material.side = THREE.DoubleSide;

    var car = {visual: carMesh, body: body};
    return car;
}