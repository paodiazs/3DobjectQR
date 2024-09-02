//Define las variables que se usarán para la cámara (camera), la escena (scene), el renderizador (renderer), el modelo 3D del corazón (heart), el elemento de video (video), la textura del video (texture), y los controles (controls).
let camera, scene, renderer, heart, video, texture, controls;

init(); //configurar la escena
animate(); //iniciar bucle de animación

function init() {
    // Capturar la transmisión de la cámara
    video = document.getElementById('cameraFeed');
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream;
        video.play();
    }).catch(function(error) {
        console.error("Error al acceder a la cámara: ", error);
    });

    // Crear la escena
    scene = new THREE.Scene();

    // Configurar la cámara
    //Inicializa una cámara de perspectiva con un campo de visión de 75 grados, una relación de aspecto basada en el tamaño de la ventana, y un rango de visión entre 0.1 y 1000 unidades.
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Configurar el renderizador
    renderer = new THREE.WebGLRenderer({ alpha: true });//Inicializa un WebGLRenderer con un fondo transparente (alpha: true).
    renderer.setSize(window.innerWidth, window.innerHeight);////Ajusta el tamaño del renderizador al tamaño de la ventana.
    document.body.appendChild(renderer.domElement); //Añade el elemento canvas del renderizador al body del documento HTML.

    // Crear una textura de video y aplicarla a un plano
    texture = new THREE.VideoTexture(video);
    const videoMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const videoGeometry = new THREE.PlaneGeometry(16, 9);
    videoGeometry.scale(0.9, 0.9, 0.9);  // Ajustar la escala del video
    const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
    videoMesh.position.z = -15;  // Posicionar detrás del objeto 3D
    scene.add(videoMesh);

    // Cargar el modelo 3D del corazón
    const loader = new THREE.GLTFLoader();
    loader.load('heart_emoji.glb', function(gltf) {
        heart = gltf.scene;

          // Aplicar un material básico a los objetos en el modelo
    heart.traverse(function(node) {
        if (node.isMesh) {
            node.material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rojo de prueba
        }
    });



        
        heart.position.set(0, 0, -3);  // Posicionar el corazón frente a la cámara
        scene.add(heart);
    }, undefined, function(error) {
        console.error("Error al cargar el modelo: ", error);
    });

    // Configurar los controles de OrbitControls para mover la cámara
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;  // Habilitar amortiguación
    controls.dampingFactor = 0.25;  // Suavizar los movimientos
    controls.screenSpacePanning = false;
    controls.minDistance = 1;       // Distancia mínima de zoom
    controls.maxDistance = 10;      // Distancia máxima de zoom
    controls.target.set(0, 0, 0);   // Punto de enfoque de la cámara
    controls.update();

    // Ajustar la ventana al cambiar de tamaño
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();  // Actualizar controles en cada cuadro

    renderer.render(scene, camera);
}
