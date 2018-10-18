# Hermes
Hermes es un herramienta destinada a profesores que impartan clases en streaming a través de YouTube.

<p align="center">
  <img src="images/hermes-logo-title.png?raw=true" alt="Hermes"/>
</p>

## Instalación
Para ejecutar Hermes necesita tener instalado [Node.js](https://nodejs.org/) en el servidor.

```
apt-get install nodejs npm
```

Si tiene algún problema con las dependecias Socket.io o Express, sitúese en el direcorio raíz y ejecute
```
npm install
```  
para descargarlas de nuevo, aunque inicialmente ya se encuentran descargadas en el directorio *node_modules/*

## Ejecución
En el servidor, sitúese en el directorio raiz y ejecute
```
node index.js
```

y abra en un navegador [localhost:8080](http://localhost:8080).

## Uso
Hermes permite desplegar un servidor en Node.js que ofrece dos páginas web desarrolladas con [Bootstrap](http://getbootstrap.com/) para los dos roles posibles,
* El profesor, que accederá en el navegador a través de *URL/admin* con una contraseña almacenada en el servidor y podrá cambiar la URL del vídeo de YouTube que ven los estudiantes en tiempo real, ver los usuarios conectados y leer y mandar mensajes en el chat.

<p align="center">
  <img src="images/professor.png?raw=true" alt="Alumno"/>
</p>

* Los estudiantes entrarán a través de *URL/*, accediendo tras introducir uno de los pares usuario:contraseña almacenados en el archivo [users.csv](users.csv) del servidor. Podrán ver los usuarios conectados y el vídeo del profesor mientras le escriben preguntas a través del chat.

<p align="center">
  <img src="images/student.png?raw=true" alt="Alumno"/>
</p>

Cada sesión de un usuario tiene asociado un identificador, y hasta que ese identificador no se identifique como un usuario válido no podrá acceder a ninguna de las funcionalidades (ni ver qué vídeo hay, ni los usuarios conectados ni leer y mandar mensajes al chat).
