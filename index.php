<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuizSphere</title>
    <link rel="stylesheet" href="index.css">
    <script>
        function toggleForms() {
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            const toggleText = document.getElementById('toggle-text');

            if (loginForm.style.display === "none") {
                loginForm.style.display = "block";
                registerForm.style.display = "none";
                toggleText.innerHTML = 'No tienes cuenta? <a href="#" onclick="toggleForms()">Crear usuario</a>';
            } else {
                loginForm.style.display = "none";
                registerForm.style.display = "block";
                toggleText.innerHTML = 'Volver a <a href="#" onclick="toggleForms()">iniciar sesión</a>';
            }
        }
    </script>
</head>
<body>
    <div class="container">
        
        <form id="login-form" method="POST" action="login.php">
            <h1>Inicio de sesión</h1>
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required>

            <label for="contraseña">Contraseña:</label>
            <input type="password" id="contraseña" name="contraseña" required>

            <label for="recordarme">
                <input type="checkbox" name="recordarme">Recuérdame
            </label>

            <button type="submit">Iniciar Sesión</button>
        </form>

        <p id="toggle-text">No tienes cuenta? <a href="#" onclick="toggleForms()">Crear usuario</a></p>

        <form id="register-form" method="POST" action="register.php" style="display: none;">
            <h1>Registro de Usuario</h1>
            <label for="nombre_registro">Nombre:</label>
            <input type="text" id="nombre_registro" name="nombre" required>

            <label for="contraseña_registro">Contraseña:</label>
            <input type="password" id="contraseña_registro" name="contraseña" required>

            <label for="confirmar_contraseña">Confirmar Contraseña:</label>
            <input type="password" id="confirmar_contraseña" name="confirmar_contraseña" required>

            <button type="submit">Registrar</button>
        </form>
    </div>
</body>
</html>
