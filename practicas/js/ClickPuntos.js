/**
*   Seminario GPC #1. Hacer click y pintar un punto rojo
*/

// SHADER DE VERTICES
var VSHADER_SOURCE = 
'attribute vec4 posicion;      \n' +
'void main(){                  \n' +
' gl_Position = posicion;      \n' +
' gl_PointSize = 10.0;         \n' +
'}  \n';

// SHADER DE FRAGMENTOS
var FSHADER_SOURCE = 
'void main(){                  \n' +
' gl_FragColor = vec4(1.0,0.0,0.0,1.0);      \n' +
'}  \n';

function main()
{
    //recuperar el canvas(lienzo)
    var canvas = document.getElementById("canvas");

    // obtener el contexto de render (herramientas de dibujo)
    var gl = getWebGLContext(canvas);

    // fijar color de borrado del lienzo
    gl.clearColor(0.0,0.0,0.0,1.0);

    //Cargar, compilar y montar los shader en un 'program'
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        console.log("Fallo en la carga de los shaders");
        return;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    // enlace del script con el shader
    var coordenadas = gl.getAttribLocation(gl.program, 'posicion');

    // escuchar eventos de raton 
    canvas.onmousedown = function(evento)
    {
        click(evento, gl, canvas, coordenadas);
        //render(gl);
    };
}

var puntos = [];
var lineas = [];
var triangulos = [];
var aux = 0;


function click(evento, gl, canvas, coordenadas)
{
    var x = evento.clientX;
    var y = evento.clientY;
    var rect = evento.target.getBoundingClientRect();

    //conversion de coordenadas al sistema de webgl por defecto
    //cuadrado de 2x2 centrado < ---- ejercicio
    x = ((x-rect.left) - canvas.width/2) * 2 / canvas.width;
    y = (canvas.height/2 - (y - rect.top)) * 2/ canvas.height;

    //guardar coordenadas
    puntos.push(x); 
    puntos.push(y);

    lineas.push(x);
    lineas.push(y);
    lineas.push(0.0);

    triangulos.push(aux);
    aux++;

    //borrar el canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

     //Draw lines
     var bufferVertices = gl.createBuffer();
     var bufferIndices = gl.createBuffer();
 
     gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineas), gl.STATIC_DRAW);
 
     var coordenadas = gl.getAttribLocation(gl.program, 'posicion');
     gl.vertexAttribPointer(coordenadas, 3, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(coordenadas);
 
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(triangulos), gl.STATIC_DRAW);
 
     gl.drawElements(gl.POINTS, puntos.length/2, gl.UNSIGNED_BYTE,0);
     gl.drawElements(gl.LINE_STRIP, puntos.length/2, gl.UNSIGNED_BYTE,0);

    /*
    for(var i = 0; i < puntos.length; i += 2) 
    {
        gl.vertexAttrib3f(coordenadas, puntos[i], puntos[i+1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }*/
   
    //insertar las coordenadas como atributo y dibujarlos uno a uno 
}

function render(gl)
{
    var coord = [0.0, 0.0, 0.5,
                0.0, 0.9, 0.0,
                0.7, -0.6, 0.0,
                -0.7, -0.6, 0.0];
            
    var triangulos = [0,3,2, 0,2,1, 0,1,3, 1,3,2];

    gl.clear(gl.COLOR_BUFFER_BIT);

    var bufferVertices = gl.createBuffer();
    var bufferIndices = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coord), gl.STATIC_DRAW);

    var coordenadas = gl.getAttribLocation(gl.program, 'posicion');
    gl.vertexAttribPointer(coordenadas, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordenadas);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(triangulos), gl.STATIC_DRAW);

    gl.drawElements(gl.LINE_STRIP, 3, gl.UNSIGNED_BYTE,0);
}
