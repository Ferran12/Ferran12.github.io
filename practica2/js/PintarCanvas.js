/**
 * Seminario GPC #1. Pintar un rectangulo de azul 
 */

 function main()
 {
     //recuperar el canvas(lienzo)
    var canvas = document.getElementById("canvas");

    // obtener el contexto de render (herramientas de dibujo)
    var gl = getWebGLContext(canvas);

    // fijar color de borrado del lienzo
    gl.clearColor(0.0,0.0,3.0,1.0);

    //borrar el canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
 }