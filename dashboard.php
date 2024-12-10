<?php
session_start();

// Función para leer el archivo JSON y convertirlo en un array
function leerUsuarios()
{
    $json = file_get_contents('users.json');
    return json_decode($json, true);
}

// Función para guardar el array de usuarios en el archivo JSON
function guardarUsuarios($usuarios)
{
    file_put_contents('users.json', json_encode($usuarios, JSON_PRETTY_PRINT));
}

// Validación de los datos del usuario
function validarUsuario($nombre, $contraseña, $rol)
{
    if (empty($nombre) || empty($contraseña) || empty($rol)) {
        return "Todos los campos son requeridos.";
    }
    return null; // Si no hay errores, se retorna null
}

// Crear un nuevo usuario (Para la solicitud AJAX)
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['accion']) && $_POST['accion'] == 'crear') {
    $nombre = $_POST['nombre'];
    $contraseña = password_hash($_POST['contraseña'], PASSWORD_BCRYPT);
    $rol = $_POST['rol'];

    // Validación de los datos
    $error = validarUsuario($nombre, $_POST['contraseña'], $rol);
    if ($error) {
        echo json_encode(["status" => "error", "message" => $error]);
        exit;
    } else {
        // Leer usuarios y añadir el nuevo
        $usuarios = leerUsuarios();
        $nuevoUsuario = [
            'id' => uniqid(),
            'nombre' => $nombre,
            'contraseña' => $contraseña,
            'rol' => $rol
        ];
        $usuarios['usuarios'][] = $nuevoUsuario;
        guardarUsuarios($usuarios);
        echo json_encode(["status" => "success", "message" => "Usuario creado con éxito.", "usuarios" => $usuarios['usuarios']]);
        exit;
    }
}

// Editar un usuario (Para la solicitud AJAX)
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['accion']) && $_POST['accion'] == 'editar') {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $contraseña = password_hash($_POST['contraseña'], PASSWORD_BCRYPT);
    $rol = $_POST['rol'];

    // Validación de los datos
    $error = validarUsuario($nombre, $_POST['contraseña'], $rol);
    if ($error) {
        echo json_encode(["status" => "error", "message" => $error]);
        exit;
    } else {
        // Leer usuarios y actualizar el usuario
        $usuarios = leerUsuarios();
        foreach ($usuarios['usuarios'] as &$usuario) {
            if ($usuario['id'] == $id) {
                $usuario['nombre'] = $nombre;
                $usuario['contraseña'] = $contraseña;
                $usuario['rol'] = $rol;
                break;
            }
        }
        guardarUsuarios($usuarios);
        echo json_encode(["status" => "success", "message" => "Usuario actualizado con éxito.", "usuarios" => $usuarios['usuarios']]);
        exit;
    }
}

// Eliminar un usuario (Para la solicitud AJAX)
if (isset($_GET['accion']) && $_GET['accion'] == 'eliminar') {
    $id = $_GET['id'];
    $usuarios = leerUsuarios();
    $usuarios['usuarios'] = array_filter($usuarios['usuarios'], function ($usuario) use ($id) {
        return $usuario['id'] != $id;
    });
    guardarUsuarios($usuarios);
    echo json_encode(["status" => "success", "message" => "Usuario eliminado con éxito.", "usuarios" => $usuarios['usuarios']]);
    exit;
}

$usuarios = leerUsuarios();
?>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const formularioCrear = document.querySelector('#formCrear');
        const formularioEditar = document.querySelector('#formEditar');
        const tablaUsuarios = document.querySelector('#tablaUsuarios');
        const mensaje = document.querySelector('#mensaje');

        // Función para actualizar la tabla de usuarios
        function actualizarTabla(usuarios) {
            let filas = '';
            usuarios.forEach(usuario => {
                filas += `
                <tr>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <button onclick="editarUsuario('${usuario.id}', '${usuario.nombre}', '${usuario.rol}')">Editar</button>
                        <button onclick="eliminarUsuario('${usuario.id}')">Eliminar</button>
                    </td>
                </tr>
            `;
            });
            tablaUsuarios.innerHTML = filas;
        }

        // Crear usuario (Fetch API)
        formularioCrear.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(formularioCrear);
            formData.append('accion', 'crear');

            fetch('dashboard.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    mensaje.innerHTML = data.message;
                    if (data.status === 'success') {
                        actualizarTabla(data.usuarios);
                        formularioCrear.reset();
                    }
                });
        });

        // Editar usuario (Fetch API)
        window.editarUsuario = function (id, nombre, rol) {
            formularioEditar.querySelector('[name="id"]').value = id;
            formularioEditar.querySelector('[name="nombre"]').value = nombre;
            formularioEditar.querySelector('[name="rol"]').value = rol;
            document.querySelector('#editarModal').style.display = 'block';
        };

        formularioEditar.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(formularioEditar);
            formData.append('accion', 'editar');

            fetch('dashboard.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    mensaje.innerHTML = data.message;
                    if (data.status === 'success') {
                        actualizarTabla(data.usuarios);
                        formularioEditar.reset();
                        document.querySelector('#editarModal').style.display = 'none';
                    }
                });
        });

        // Eliminar usuario (Fetch API)
        window.eliminarUsuario = function (id) {
            if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
                fetch(`dashboard.php?accion=eliminar&id=${id}`)
                    .then(response => response.json())
                    .then(data => {
                        mensaje.innerHTML = data.message;
                        if (data.status === 'success') {
                            actualizarTabla(data.usuarios);
                        }
                    });
            }
        };

        // Inicializar la tabla con los usuarios existentes
        actualizarTabla(<?php echo json_encode($usuarios['usuarios']); ?>);
    });
</script>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="dashboard.css">
</head>

<body>
    <h1>Administrar Usuarios</h1>

    <!-- Mensaje de retroalimentación -->
    <div id="mensaje"></div>

    <!-- Formulario para crear usuario -->
    <h2>Crear Usuario</h2>
    <form id="formCrear" method="POST">
        <input type="text" name="nombre" placeholder="Nombre" required><br>
        <input type="password" name="contraseña" placeholder="Contraseña" required><br>
        <select name="rol" required>
            <option value="administrador">Administrador</option>
            <option value="visitante">Visitante</option>
        </select><br>
        <button type="submit">Crear Usuario</button>
    </form>


    <a href="musica.php"><button>Música</button></a>

    <h2>Lista de Usuarios</h2>
    <table id="tablaUsuarios" border="1">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- La tabla se llenará dinámicamente -->
        </tbody>
    </table>

    <!-- Modal para editar usuario -->
    <div id="editarModal" style="display: none;">
        <h2>Editar Usuario</h2>
        <form id="formEditar" method="POST">
            <input type="hidden" name="id">
            <input type="text" name="nombre" required><br>
            <input type="password" name="contraseña" placeholder="Nueva contraseña" required><br>
            <select name="rol" required>
                <option value="administrador">Administrador</option>
                <option value="visitante">Visitante</option>
            </select><br>
            <button type="submit">Actualizar Usuario</button>
        </form>
    </div>

</body>

</html>