//1. IMPORTAR LIBRERIAS
const express = require('express'); //importar marco de trabajo
const path = require('path'); //importar método para gestionar rutas

//2. INICIALIZAR APLICACION Y PUERTO
const app = express(); //crear instancia de servidor
const PORT = process.env.PORT || 3000; //toma puerto activo o asigna uno (en este caso 3000)

//3. GESTION DEL TRAFICO EN LA WEB
// Servir archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public'))); //indicamos que public tiene los archivos visuales

// Middleware para procesar JSON
app.use(express.json()); //indicamos al servidor que lea archivos en json

//4. END POINT - RUTA D EPRUEBA
// Ruta de prueba
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
}); //escuhar petición del usuario y mostrar resultado

//5. ENCENDER SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
}); //activar servidor cuando se escuchan peticiones del puerto activo o 3000