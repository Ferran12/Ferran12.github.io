function initCamera()
{
     //Camara perspectiva
     var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);
   
     //camera.position.set(0, -2890, 150);
     camera.position.set(0, -6100, 500);
     camera.rotation.set(1.41,0,0);

     return camera;
}

function updateAspectRatio(camera,renderer)
{
    //Variables globales
    var r = t = 100;
    var l = b = -r;

    //Indicarle al motor las nuevas dimensiones del canvas
    renderer.setSize(window.innerWidth, window.innerHeight);

    var ar = window.innerWidth / window.innerHeight;

    if(ar > 1)
    {
        camera.left = l * ar;
        camera.right = r * ar;
        camera.top = t;
        camera.bottom =  b;
    }
    else
    {   
        camera.left =  l;
        camera.right = r;
        camera.top = t / ar;
        camera.bottom = b / ar; 
    }

    camera.aspect = ar;

    //Se ha variado el volumen de la vista
    camera.updateProjectionMatrix();
    return camera, renderer
}

//Mueve la camara hacia una posicion determinada
function initialMoveCamera(cameraPosition, targetPosition, velocity)
{
    var finished = 3;

    if(cameraPosition.x >= (targetPosition.x - velocity) && cameraPosition.x  <= (targetPosition.x + velocity))
    {
        finished -= 1;
    }
    else if(cameraPosition.x < targetPosition.x)
        cameraPosition.x += velocity;
    else if(cameraPosition.x > targetPosition.x)
        cameraPosition.x -= velocity;

    if(cameraPosition.y >= (targetPosition.y - velocity) && cameraPosition.y  <= (targetPosition.y + velocity))
    {
        finished -= 1;
    }
    else if(cameraPosition.y < targetPosition.y)
        cameraPosition.y += velocity;
    else if(cameraPosition.y > targetPosition.y)
        cameraPosition.y -= velocity;

    if(cameraPosition.z >= (targetPosition.z - velocity) && cameraPosition.z  <= (targetPosition.z + velocity))
    {
        finished -= 1;
    }
    else if(cameraPosition.z < targetPosition.z)
        cameraPosition.z += velocity / 4.6;
    else
        cameraPosition.z -= velocity / 4.6;

    var end = false;

    if(finished == 0)
        end = true;

    return end;
}