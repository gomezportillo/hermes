#Hermes
Hermes es un herramienta que permite levantar un servidor con Node.js con un chat en tiempo real y un vídeo de YouTube embebido

<p align="center">
  <img width="200" height=210" src=https://github.com/gomezportillo/hermes/blob/master/hermes/images/hermes-logo.png?raw=true" alt="Hermes"/>
</p>

Para ejecutar Hermes necesita instalar [Node.js](https://nodejs.org/) en su sistema.

Hay dos formas de lanzar Hermes:

##Si tiene Python instalado
Ssitúese  en el directorio raiz del proyecto y ejecute
```
python launcher.py
```  
<p align="center">
  <img src=https://github.com/gomezportillo/hermes/blob/master/hermes/images/gui.png?raw=true" alt="GUI"/>
</p>

2.Si Python no se encuentra en su sistema
En el mismo directorio raiz, ejecute
```
node hermes/index.js
```
Aunque si quiere editar la URL del vídeo tendrá que editar a mano el archivo ./hermes/pages/student.html

##Issues
Si tiene algún problema con las dependecias socket.io o express, muévase a ./hermes y ejecute
```
npm install
```  
para descargarlas de nuevo.
