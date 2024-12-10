<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre = $_POST['nombre'];
    $contraseña = $_POST['contraseña'];
    $confirmar_contraseña = $_POST['confirmar_contraseña'];

    if ($contraseña !== $confirmar_contraseña) {
        die("Las contraseñas no coinciden.");
    }

    $data = json_decode(file_get_contents('users.json'), true);

    foreach ($data['usuarios'] as $usuario) {
        if ($usuario['nombre'] === $nombre) {
            die("El usuario ya existe.");
        }
    }

    $nuevo_usuario = [
        "nombre" => $nombre,
        "contraseña" => password_hash($contraseña, PASSWORD_DEFAULT),
        "rol" => "visitante",
        "id" => uniqid()
    ];

    $data['usuarios'][] = $nuevo_usuario;

    file_put_contents('users.json', json_encode($data, JSON_PRETTY_PRINT));

    header("Location: index.php");
}
?>