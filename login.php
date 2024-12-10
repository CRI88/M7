<?php

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre = $_POST['nombre'];
    $contraseña = $_POST['contraseña'];
    $data = json_decode(file_get_contents('users.json'), true);

    $recordarme = isset($_POST['recordarme']) ? true : false;

    foreach ($data['usuarios'] as $usuario) {
        if ($usuario['nombre'] === $nombre) {
            if (password_verify($contraseña, $usuario['contraseña'])) {

                $_SESSION['nombre'] = $nombre;
                $_SESSION['rol'] = $usuario['rol'];
                if ($usuario['rol'] == "administrador") {
                    header("Location: dashboard.php");
                } else header("Location: musica.php");

                if ($recordarme) {
                    setcookie("usuario", $nombre, time() + (86400 * 30), "/");
                    exit(); }
            } else {
                die("Contraseña incorrecta.");
            }
        }
    }

    die("El usuario no existe.");
}
?>