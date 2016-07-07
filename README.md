#Hermes
Hermes es un herramienta destinada a profesores que impartan clases en streaming a través de YouTube.

<p align="center">
  <img src=https://github.com/gomezportillo/hermes/blob/master/images/hermes-logo-title.png?raw=true" alt="Hermes"/>
</p>

## Instalación
Para ejecutar Hermes necesita tener instalado [Node.js](https://nodejs.org/) en su sistema.

Si tiene algún problema con las dependecias socket.io o express, sitúese en el direcorio raíz y ejecute
```
npm install
```  
para descargarlas de nuevo, aunque inicialmente ya se encuentran descargadas en *node_modules/*

## Ejecución
En el mismo directorio raiz, ejecute
```
node index.js
```

##Uso
Hermes permite desplegar un servidor en Node.js que ofrece dos interfaces para los dos roles posibles,
* Los estudiantes accederán a través de URL/ y podrán ver los usuarios conectados y el vídeo del profesor mientras le escriben preguntas a través del chat.
* El profesor, que accederá a través de URL/admin con una contraseña y podrá cambiar la URL del vídeo de YouTube que ven los estudiantes y ver el chat y los usuarios conectados, aunque no escribir en él.
