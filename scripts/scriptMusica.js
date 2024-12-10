//import crearListaDeReproduccion from '../script/listaDeReproduccion.js';
//import listaCanciones from '../script/listaCanciones.js';
//import crearTableroConfiguracion from '../script/configuracion.js';
//import { reproducirPista, pause, play } from '../script/howler.js';

//sessionStorage.setItem("reproduciendo", false);



let listaCanciones;

document.addEventListener('DOMContentLoaded', function() {

    cargarListaCanciones();

   

    canvas = document.getElementById('equalizer');
    context = canvas.getContext('2d');

    //if ()
    
});
async function cargarListaCanciones() {
    let response = await fetch('docs/listaCanciones.json');
    listaCanciones = await response.json();
    listaCanciones.forEach(cancion => {
        console.log(cancion.titulo);
    });
    console.log(listaCanciones);
}

let listaCancionesFiltro = [];


const desplegableOpciones = document.getElementById("desplegableOpciones");
desplegableOpciones.addEventListener("change", function(){
    const opcionSeleccionada = desplegableOpciones.value;
    
    console.log("Opcion seleccionada: " + opcionSeleccionada);

    cargarListaReproduccion(opcionSeleccionada);


    crearListaDeReproduccion();

}, false);


let cancionActual = null; 
let intervaloProgreso = null; // Intervalo para actualizar la barra de progreso
let pistaActual;
let reproduciendo = false;

//Some howler variables
let songVolume = 0.5;
let howler;


//Equalizer
//Get the audio context for the analyzer and get the number of samples
let analyser;
let bufferLength;
let dataArray;
let animationFrame;

let canvas;
let context;

const barraProgreso = document.getElementById("barraTiempo");
const tiempoActualSpan = document.getElementById("tiempoActual");
const duracionTotal = document.getElementById("duracionTotal");
    

const barraVolumen = document.getElementById("barraVolumen");
barraVolumen.addEventListener("input", function(event){
    let valor = event.target.value;
    modifyVolume(valor);

}, false);

const barraAgudos = document.getElementById("barraAgudos");
barraAgudos.addEventListener("input", function(event){
    let valor = event.target.value;
    modificarAgudos(valor);

}, false);

const barraGraves = document.getElementById("barraGraves");
barraGraves.addEventListener("input", function(event){
    let valor = event.target.value;
    modificarGraves(valor);

}, false);

const textViewTituloCancion = document.getElementById("textViewTituloCancion");
const textViewArtistaCancion = document.getElementById("textViewArtistaCancion");
const imageViewDiscoCancion = document.getElementById("imageViewDiscoCancion");

const botonPistaAnterior = document.getElementById("botonPistaAnterior");
botonPistaAnterior.addEventListener("click", function() {

    let posicionArrayCancionAnterior = buscarCancionAnteriorSiguiente(listaCancionesFiltro, 'A');
    //let rutaCancionAnterior = buscarRutaCancionPorId(listaCancionesFiltro, idCancionAnterior);

    reproducirPista(listaCancionesFiltro[posicionArrayCancionAnterior].archivo);

    textViewTituloCancion.innerHTML = listaCancionesFiltro[posicionArrayCancionAnterior].titulo;
    textViewArtistaCancion.innerHTML = listaCancionesFiltro[posicionArrayCancionAnterior].artista;
    imageViewDiscoCancion.src = "img/Discos/" + listaCancionesFiltro[posicionArrayCancionAnterior].idCancion + ".png";

    pistaActual = listaCancionesFiltro[posicionArrayCancionAnterior].idCancion;

}, false);

const botonPlayPause = document.getElementById("botonPlayPause");
botonPlayPause.addEventListener("click", function(){

    console.log("Se pulsa el boton playPause");

    if (reproduciendo){
        //Pausar cancion
        pause();

        //Establecer reproduciendo a false
        reproduciendo = false;

        //Cambiar icono boton
        botonPlayPause.style.backgroundImage = "url(img/play.png)";
    } else {

        play();

        reproduciendo = true;

        botonPlayPause.style.backgroundImage = "url(img/pause.png)";
    }

}, false);

const botonPistaSiguiente = document.getElementById("botonPistaSiguiente");
botonPistaSiguiente.addEventListener("click", function() {

    let posicionArrayCancionAnterior = buscarCancionAnteriorSiguiente(listaCancionesFiltro, 'S');
    //let rutaCancionAnterior = buscarRutaCancionPorId(listaCancionesFiltro, idCancionAnterior);

    reproducirPista(listaCancionesFiltro[posicionArrayCancionAnterior].archivo);

    textViewTituloCancion.innerHTML = listaCancionesFiltro[posicionArrayCancionAnterior].titulo;
    textViewArtistaCancion.innerHTML = listaCancionesFiltro[posicionArrayCancionAnterior].artista;
    imageViewDiscoCancion.src = "img/Discos/" + listaCancionesFiltro[posicionArrayCancionAnterior].idCancion + ".png";

    pistaActual = listaCancionesFiltro[posicionArrayCancionAnterior].idCancion;

}, false);

//const buttonConfiguracion = document.getElementById("buttonConfiguracion");
/*buttonConfiguracion.addEventListener("click", function(){
    crearTableroConfiguracion();

    activarEcualizador();
    buttonConfiguracion.style.visibility = "hidden";
}, false);*/

/*document.addEventListener('DOMContentLoaded', function () {


    //Cargar fondo de pantalla seleccionado
    document.body.style.backgroundImage = sessionStorage.getItem("temaWeb");
    document.body.style.backgroundSize = "cover";

    //Poner todo invisible
    botonPistaAnterior.style.visibility = "hidden";
    botonPlayPause.style.visibility = "hidden";
    botonPistaSiguiente.style.visibility = "hidden";
    barraProgreso.style.visibility = "hidden";
    tiempoActualSpan.style.visibility = "hidden";
    duracionTotal.style.visibility = "hidden";
    
    crearListaDeReproduccion();

    canvas = document.getElementById('equalizer');
    context = canvas.getContext('2d');

});*/

function buscarCancionAnteriorSiguiente(listaCancionesFiltro, accion){

    console.log("listaCancionesFiltro");
    console.log(listaCancionesFiltro);

    
    console.log("PistaActual: " + pistaActual);

    let posicionListaPistaActual = -1;

    let i = 0;
    let encontrado = false;

    while (!encontrado && i < listaCancionesFiltro.length){
        if (listaCancionesFiltro[i].idCancion == pistaActual){
            encontrado = true;

            posicionListaPistaActual = i;
        }
        i++;
    }

    if (posicionListaPistaActual == -1){
        console.log("La pista no se ha encontrado");
    } else {
        console.log("La pista se ha encontrado");

        if (accion == 'A'){
            posicionListaPistaActual--;


            if (posicionListaPistaActual == -1){
                posicionListaPistaActual = listaCancionesFiltro.length-1;
            }
        } else {
            posicionListaPistaActual++;


            if (posicionListaPistaActual == listaCancionesFiltro.length-1){
                posicionListaPistaActual = 0;
            }
        }
        

    }

    console.log("return posicionListaPistaActual: " + posicionListaPistaActual);
    return posicionListaPistaActual;
}





function reproducirPista(rutaCancion) {

    botonPistaAnterior.style.visibility = "visible";
    botonPlayPause.style.visibility = "visible";
    botonPistaSiguiente.style.visibility = "visible";
    barraProgreso.style.visibility = "visible";
    tiempoActualSpan.style.visibility = "visible";
    duracionTotal.style.visibility = "visible";

    if (cancionActual != null){
        console.log("Se detiene la pista anterior");
        detener();
    }

    if (!Howler.ctx) {
        new Howl({ src: [""], volume: 0 }).play();
    }

    cancionActual = new Howl({
        src: [rutaCancion],
        volume: 0.5,
        loop: false,
        onplay: iniciarBarraProgreso(),
        onload: activarEcualizador(cancionActual),
        onend: () => console.log("He terminado"),

        //onload: ;
    });

    //sessionStorage.setItem("cancionActual", cancionActual);

    //cancionActual.currentTime = 0;
    cancionActual.play();

    botonPlayPause.style.backgroundImage = "url(img/pause.png)";

    return cancionActual;
    

}

function cargarListaReproduccion(opcionSeleccionada) {

    listViewListaReproduccion.innerHTML = "";

    let listaCancionesFiltradas = [];

    for (const cancion of listaCanciones) {
        if (cancion["estadoAnimo"] == opcionSeleccionada){
            listaCancionesFiltradas.push(cancion);
        }
        
    }
    listaCancionesFiltro = listaCancionesFiltradas;
}

function modificarGraves(nuevaFrecuencia) {

    
    if (reproduciendo){
        console.log("Entra en modificarGraves()");

        // Obtener el contexto de audio de Howler
        const audioContext = Howler.ctx;

        // Crear nodos de filtro para graves y agudos
        const filtroGraves = audioContext.createBiquadFilter();
        filtroGraves.type = "lowshelf"; // Ajusta el filtro para los graves
        filtroGraves.frequency.value = 150; // Frecuencia de corte en Hz para graves
        filtroGraves.gain.value = nuevaFrecuencia; // Frecuencia de corte para graves
    }
    

}

function modificarAgudos(nuevaFrecuencia) {
    

    if(reproduciendo) {
        console.log("Entra en modificarAgudos()");

        // Obtener el contexto de audio de Howler
        const audioContext = Howler.ctx;

        // Crear nodos de filtro para graves y agudos
        const filtroAgudos = audioContext.createBiquadFilter();
        filtroAgudos.type = "highshelf"; // Ajusta el filtro para los graves
        filtroAgudos.frequency.value = 3000; // Frecuencia de corte en Hz para graves
        filtroAgudos.gain.value = nuevaFrecuencia; // Frecuencia de corte para graves
    }
    
}
function modifyVolume(nuevoVolumen) {
    if(cancionActual != null){
        cancionActual.volume(nuevoVolumen);
    }
    
}
function pause() {
    cancionActual.pause();
}

function play() {
    cancionActual.play();
}

function detener() {
    cancionActual.stop(); //onLoad();
}
function iniciarBarraProgreso() {
    

    // Intervalo que actualiza la barra de progreso cada segundo
    intervaloProgreso = setInterval(() => {
        if (cancionActual && cancionActual.playing()) {
            // Posición actual y duración de la canción
            const tiempoActual = cancionActual.seek();
            const duracion = cancionActual.duration();
            

            // Actualiza la barra de progreso y el tiempo actual
            barraProgreso.value = (tiempoActual / duracion) * 100;
            tiempoActualSpan.innerText = formatoTiempo(tiempoActual);
            duracionTotal.innerHTML = formatoTiempo(duracion);
        }
    }, 1000); // Actualiza cada segundo
}
function formatoTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);
    return minutos + ":" + (segundosRestantes < 10 ? "0" : "") + segundosRestantes;
}


/*------------------------------Lista de reproduccion---------------------------*/

function crearListaDeReproduccion() {

    console.log("Entra en crearListaDeReproduccion()");

    console.log("Lista de reproduccion filtrada");
    console.log(listaCanciones);

    const listViewListaReproduccion = document.getElementById("listViewListaReproduccion");
    
    const imageViewDiscoCancion = document.getElementById("imageViewDiscoCancion");
    const textViewTituloCancion = document.getElementById("textViewTituloCancion");
    const textViewArtistaCancion = document.getElementById("textViewArtistaCancion");


    for (const cancion of listaCancionesFiltro) {
        
        //Crear contenido del adapter

        //Agregar todo a este contenedor
        let divContenidoCancion = document.createElement("div");
        divContenidoCancion.className = "divContenidoAdapterListView";
        divContenidoCancion.addEventListener("click", function() {

            //Reproducir pista seleccionada
            console.log("Se reproduce la pista " + cancion.idCancion);

            imageViewDiscoCancion.src = "img/Discos/" + cancion.idCancion + ".png";
            textViewTituloCancion.innerHTML = cancion.titulo;
            textViewArtistaCancion.innerHTML = cancion.artista;

            
            reproducirPista(cancion.archivo);

            pistaActual = cancion.idCancion;
            reproduciendo = true;



        }, false);

        //Crear div contenedor imagen
        let divContenedorImagen = document.createElement("div");
        divContenedorImagen.className = "divImagenAdapterListView";

        //Crear imageView
        let imageViewCancionAdapter = document.createElement("img");
        imageViewCancionAdapter.id = "imageViewCancionAdapter";
        imageViewCancionAdapter.className = "imageViewCancionAdapter";
        imageViewCancionAdapter.src = "img/Discos/" + cancion.idCancion + ".png";
        
        
        //Agregar imageView al div
        divContenedorImagen.appendChild(imageViewCancionAdapter);

        //Agregar div imagen al contenedorPrincipal
        divContenidoCancion.appendChild(divContenedorImagen);

        //Crear div titulos
        let divTitulos = document.createElement("div");
        divTitulos.className = "divTitulosAdapterListView";

        //Crear textView titulo y artista
        let textViewTituloAdapter = document.createElement("h4");
        textViewTituloAdapter.id = "textViewTituloAdapter";
        textViewTituloAdapter.innerHTML = cancion.titulo
        
        let textViewArtistaAdapter = document.createElement("p");
        textViewArtistaAdapter.id = "textViewArtistaAdapter";
        textViewArtistaAdapter.innerHTML = cancion.artista

        //Añadir textView al div
        divTitulos.appendChild(textViewTituloAdapter);
        divTitulos.appendChild(textViewArtistaAdapter);

        //Añadir divTitulos al divPrincipal
        divContenidoCancion.appendChild(divTitulos);


        //Al final agregar el contenedoral listView
        listViewListaReproduccion.appendChild(divContenidoCancion);
        listViewListaReproduccion.appendChild(document.createElement("br"));
    }



}


/*----------------------------------Equalizer-----------------------------*/
function activarEcualizador(cancionActual) {

    console.log("Entra en activarEcualizador()");

    //Get the canvas and the context to use the equalizer
    //let canvas = document.getElementById('equalizer');
    //let context = canvas.getContext('2d');

    //console.log(ctx);

    const audioContext = Howler.ctx;

    //Equilizer
    analyser = audioContext.createAnalyser();    //Proporciona acceso a la frecuencia y los datos de tiempo del audio que está siendo reproducido. 
    bufferLength = analyser.frequencyBinCount; //Indica el número de muestras de datos que se obtendrán del audio.
    dataArray = new Uint8Array(bufferLength);



    loadEqualizer();
    animateEqualizer();
}




//Loading Songs
/*const loadSongs = async () => {
    let response = await fetch('./scripts/songsData.json')
    songs = await response.json();
    howler = new Howl({
        src: [songs[i].src],
        volume: songVolume
    });

    //Falta el tratamiento de las propiedades de la canción y toda la creación de la radio. Falta la creación y gestión de la lista de reproducción

    //Equilizer
    analyser = Howler.ctx.createAnalyser();    //Proporciona acceso a la frecuencia y los datos de tiempo del audio que está siendo reproducido. 
    bufferLength = analyser.frequencyBinCount; //Indica el número de muestras de datos que se obtendrán del audio.
    dataArray = new Uint8Array(bufferLength);
    loadEqualizer();
    animateEqualizer();
}*/





function loadEqualizer() {
    // Conexion del masterGain (el volumen maestro de Howler.js) con el analyzer, permitiendo que el ecualizador recoja datos del audio que se está reproduciendo.
    Howler.masterGain.connect(analyser);

    // Conecta el analyser al destino final (salida de audio)
    analyser.connect(Howler.ctx.destination);

    analyser.fftSize = 2048;
    analyser.getByteTimeDomainData(dataArray);
}


function animateEqualizer() {
    // Limpiar el canvas para redibujar el ecualizador
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Obtener los datos de frecuencia (espectro de audio)
    analyser.getByteFrequencyData(dataArray);

    // Ancho de las barras y separación
    let barWidth = (canvas.width / bufferLength) * 2;
    let barSpacing = 1;

    // Altura máxima de las barras para evitar que se salgan del canvas
    let maxBarHeight = canvas.height - 10; // Dejar un pequeño margen en la parte inferior

    // Crear un gradiente de colores
    for (let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i];

        // Limitar la altura de las barras para que no se salgan del canvas
        barHeight = Math.min(barHeight, maxBarHeight); // Asegura que no se exceda la altura del canvas

        let x = i * (barWidth + barSpacing);

        // Crear una gama de colores basada en el índice de frecuencia
        let hue = (i / bufferLength) * 360; // Hue basado en el índice para un ciclo de colores completo
        let saturation = 100;
        let lightness = 50 + (barHeight / 2); // Ajustar el brillo según la altura de la barra

        // Convertir HSL a RGB para usar en el ecualizador
        context.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        // Dibujar la barra (de abajo hacia arriba)
        context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    }

    // Solicitar el siguiente frame de animación para una transición suave
    animationFrame = requestAnimationFrame(animateEqualizer);
}










// On Load
//loadSongs();
