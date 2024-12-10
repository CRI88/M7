<?php
// Verificar si el formulario fue enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cerrar_sesion'])) {
    // Iniciar la sesión
    session_start();

    // Destruir todos los datos de la sesión
    session_unset(); // Libera todas las variables de sesión

    // Destruir la sesión
    session_destroy(); // Destruye la sesión

    // Redirigir al usuario a la página de inicio o login después de cerrar sesión
    header("Location: index.php");
    exit();
}
?>