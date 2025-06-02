# InstadrunaDeploy
TFG de Diana Pascual: Front de Instadruna para EAS Build

## Índice

1. [Introducción](#1-Introducción)
2. [Funcionalidades del proyecto](#2-Funcionalidades-del-proyecto)
3. [Tecnologías utilizadas](#3-Tecnologías-utilizadas)
4. [Guía de Instalación](#4-Guía-de-instalación)
5. [Guía de Uso](#5-Guía-de-uso)
6. [Enlace a interfaz](#6-Enlace-a-interfaz)
7. [Conclusión](#7-Conclusión)
8. [Agradecimientos](#8-Agradecimientos)
9. [Licencia](#9-Licencia)
10. [Contacto](#10-Contacto)
11. [Referencias](#11-Referencias-y-recursos-empleados)

## 1. Introducción

### 1.1. Descripción del proyecto

**Instadruna** es una red social móvil que permite a estudiantes, profesores y otros miembros de la comunidad Vedruna compartir publicaciones, comentar, seguir a otros usuarios, chatear en tiempo real y gestionar incidencias mediante un sistema de tickets. Inspirada en plataformas como Instagram, pero adaptada al entorno educativo, esta aplicación busca ofrecer una experiencia completa de comunicación, interacción y gestión interna desde una app intuitiva, moderna y accesible para toda la comunidad escolar.

### 1.2. Justificación

En un entorno educativo donde la comunicación entre estudiantes, docentes y otros miembros de la comunidad es clave, contar con una plataforma propia que centralice interacciones y necesidades resulta fundamental. Las redes sociales tradicionales, aunque populares, no están diseñadas para adaptarse a los contextos y dinámicas de una comunidad escolar.

**Instadruna** surge como respuesta a esa necesidad: una red social segura, funcional y adaptada a la realidad educativa del centro, que permite compartir información de forma ordenada, promover la interacción entre usuarios y facilitar la gestión de incidencias técnicas a través de un sistema de tickets.

Además, con su uso, se promueve el aprendizaje digital en todos los niveles: desde el manejo de la app hasta la participación en su mejora, convirtiendo la tecnología en una aliada para la comunicación y la organización dentro del centro educativo.

### 1.3. Objetivos

Objetivo general:

Desarrollar una aplicación móvil que funcione como red social interna del centro educativo Vedruna, permitiendo a los miembros de la comunidad compartir contenidos, comunicarse entre sí y gestionar incidencias de forma ágil, segura y adaptada al contexto escolar.

Objetivos específicos:

- Facilitar la creación y visualización de publicaciones y comentarios entre los usuarios.
- Fomentar la interacción mediante funciones de “me gusta”, seguidores y sistema de historias temporales.
- Proveer un canal de comunicación privada entre usuarios a través de chat en tiempo real.
- Permitir la gestión de incidencias técnicas mediante un sistema de tickets accesible desde la app.
- Garantizar un entorno digital seguro, con autenticación a través de Google y almacenamiento responsable de la información.
- Utilizar herramientas modernas de desarrollo para ofrecer una experiencia intuitiva y fluida.
- Favorecer el uso pedagógico de las tecnologías digitales dentro del contexto educativo.

### 1.4. Motivación

La idea de crear **Instadruna** nace de la observación de nuestros docentes, quienes detectan una necesidad real dentro del centro educativo: disponer de un espacio propio donde alumnos, profesionales y demás miembros de la comunidad puedan expresarse, compartir y comunicarse de forma efectiva.

Las plataformas actualmente empleadas, como Classroom, Alexia o el correo electrónico tradicional, aunque funcionales en determinados aspectos, no siempre cubren las necesidades comunicativas reales del día a día ni se adaptan con flexibilidad a la dinámica de una comunidad educativa moderna. A menudo resultan poco intuitivas, están pensadas más para la gestión académica que para la interacción social, y no ofrecen un entorno cercano, seguro y adaptado al contexto del centro.

Frente a esta realidad, surge la motivación de construir una red social diseñada desde dentro, con las necesidades del propio centro como eje central.

Además, el desarrollo de **Instadruna** no solo cubre una necesidad comunicativa, sino que se convierte en un proyecto formativo y enriquecedor a nivel técnico. Ha sido una oportunidad única para aplicar de forma práctica los conocimientos adquiridos en programación, diseño de interfaces, bases de datos y despliegue, permitiéndome crecer como desarrolladora y enfrentarme a los retos reales del ciclo de vida de una aplicación.

Pero, más allá del aspecto técnico, lo verdaderamente motivador ha sido la posibilidad de aplicar todo ese aprendizaje en algo tangible, útil y con impacto directo en mi entorno. **Instadruna** es, en cierto modo, una forma de devolver al centro parte de lo que me ha brindado durante estos dos años de formación. Un pequeño legado con el que contribuir al fortalecimiento de la comunidad educativa desde la tecnología.

## 2. Funcionalidades del proyecto

**Instadruna** está diseñada para ofrecer una experiencia completa de interacción, comunicación y gestión dentro de un entorno educativo. Inspirada en redes sociales populares pero adaptada a las necesidades de un centro escolar, la aplicación incorpora las siguientes funcionalidades clave:

- **Publicaciones:** Permite crear publicaciones públicas o privadas con texto y, opcionalmente, imagen, para compartir información, ideas o mensajes con la comunidad o con personas concretas.

- **Comentarios y reacciones:** Las publicaciones pueden recibir comentarios (padre e hijo) y reacciones en forma de "me gusta", fomentando el diálogo y la participación.

- **Sistema de historias (Stories):** Posibilita compartir historias efímeras visibles durante un tiempo determinado, siguiendo el estilo de otras redes sociales visuales.

- **Gestión de incidencias:** A través de un sistema de tickets, se pueden comunicar incidencias técnicas o necesidades específicas al equipo de IT del centro, haciendo seguimiento del estado de cada caso.

- **Mensajería instantánea:** Ofrece un sistema de chat para comunicación directa y en tiempo real entre usuarios que se siguen mutuamente.

- **Red de seguidores:** Permite seguir o dejar de seguir a otros miembros de la comunidad y consultar quiénes le siguen y a quién sigue cada usuario.

- **Perfil personal:** Permite visualizar las publicaciones del usuario, los contenidos que le han gustado, sus datos personales, imagen (editable), y consultar estadísticas básicas como número de publicaciones, seguidores y seguidos.

- **Autenticación con Google:** Utiliza un sistema de acceso seguro mediante cuentas de Google, lo que simplifica el inicio de sesión y garantiza un entorno protegido.

- **Notificaciones:** Mantiene a los usuarios actualizados sobre nuevos cambios en la plataforma.

## 3. Tecnologías utilizadas

**Instadruna** se ha desarrollado aplicando una arquitectura modular por capas, que combina un frontend móvil, un backend principal y un microservicio independiente para el chat. Esta separación facilita la escalabilidad, el mantenimiento independiente de cada módulo y una arquitectura más limpia y organizada. En este espacio hablaremos de las tecnologías utilizadas en el frontend.

### Frontend (Aplicación móvil con React Native)

- **React Native:** Framework utilizado para construir la aplicación móvil nativa desde una base de código única en JavaScript.
- **Expo:** Herramienta que simplifica el desarrollo, pruebas y ejecución de apps en React Native.
- **React Navigation (@react-navigation/*):** Librerías para la gestión de la navegación entre pantallas.
- **Expo Auth Session:** Para el inicio de sesión con cuentas de Google.
- **React Native WebView:** Permite mostrar contenido web dentro de la app.
- **React Native Async Storage:** Para el almacenamiento local de datos.
- **Expo Image Picker:** Para seleccionar imágenes del dispositivo.
- **Jest + Jest Expo:** Herramientas utilizadas en las pruebas del frontend.
- **TypeScript:** Utilizado en combinación con React Native para un tipado más seguro.

### Servicios Adicionales

- **Autenticación con Google:** Login mediante Google Sign-In con Expo Auth Session.
- **Expo Push Notifications:** Notificaciones en tiempo real mediante Expo Push Notifications.

## 4. Guía de Instalación

## 4.1. Requisitos previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

- **Node.js** (versión 16 o superior)
- **npm**
- **Java 17** (o versión compatible con **Spring Boot 3**)
- **Docker** (para contenerización y despliegue en MV Azure)
- **Expo CLI** (**npm install -g expo-cli**)
- **MySQL** (local o servidor flexible en Azure, accesible desde la MV Azure)
- Cuenta activa en **Turso** (para almacenamiento de bases de datos del chat en la nube).
- Cuenta activa en **Azure** (para despliegue en la MV Azure).
- Cuenta activa en **Google** (para autenticación con Google Sign-In).
- Cuenta activa en **Expo** (para notificaciones en tiempo real).  

## 4.2. Instalación del Frontend (Aplicación móvil React Native)

### 4.2.1. Instalación local

1. Clona el repositorio del frontend:

```bash
git clone https://github.com/DiMaPaGa/InstadrunaDeploy.git
cd InstadrunaDeploy
``` 

2. Instala las dependencias del frontend:

```bash
npm install
```

3. Inicia la aplicación:

```bash
npm expo start
```

Sigue las instrucciones en pantalla para abrirla en un emulador o dispositivo físico.

### 4.2.2 Arrancar el frontend en Expo EAS Build

1. Busca la siguiente URL en el navegador de tu dispositivo:
https://expo.dev/accounts/diana7/projects/instadruna/builds/da2bd97c-e429-4e70-8714-e4fae1d30faa

2. Descarga la app Expo Go y la instala en tu dispositivo.

3. Una vez instalada, aceptando los permisos, inicia la aplicación desde tu dispositivo.
   
4. Recuerda aceptar las notificaciones en tu dispositivo para recibir notificaciones en tiempo real, autenticación con Google y los permisos de cámara y galería.

## 5. Guía de Uso

### 5.1. Autenticación

Al abrir la aplicación, se te solicitará iniciar sesión con tu cuenta de Google mediante Expo Auth Session. Este paso es necesario para acceder a todas las funcionalidades de la app. 

> *Nota: Si le das a cancelar antes de loguearte o cierras sesión una vez iniciada, podrás volver a iniciar sesión desde otra cuenta sin necesidad de reinstalar la aplicación.*



### 5.2. Navegación general

Una vez dentro de la aplicación, accederás a la pantalla principal donde podrás:

- Ver publicaciones propias y ajenas (públicas o privadas de aquellas personas a las que sigues).
- Ver acceso para crear Historias o acceder a las de otros usuarios.
- Reaccionar a publicaciones con “Me gusta” (click en el **corazón**, si aparece en azul está seleccionado).
- Consultar el número de likes y comentarios en cada publicación.
- Cambiar de sección a través del menú de navegación inferior.
- Cerrar sesión desde el botón **Logout** de la parte superior.


### 5.3. Historias

Puedes crear una Historia (publicación de conjunto de imágenes públicas con o sin texto) 
pulsando el botón de **“Tu Historia”** que encontrarás al inicio del carrusel horizontal de la página principal.

Desde ahí:

- Accedes a Nueva Historia.
- Pincha en el botón de **Seleccionar Imágenes**. Podrás seleccionar hasta 5 imágenes de una vez.
- Puedes incluir un texto en la Historia si lo deseas.
- Pulsa el botón de **Publicar Historia** para crearla.

Si deseas ver las Historias de otros usuarios, puedes hacerlo pulsando sobre el botón de sus historias.

Desde ahí:

- Accedes a la historia de la persona seleccionada.
- Verás las imágenes de seguido transcurriendo 3 segundos por imagen.
- Podrás ver el texto de la historia si lo hubiera incluido el creador.
- Verás sobre la imagen un indicador que se irá rellenando conforme se avance el recorrido de la historia.
- En cualquier puedes mantener pulsado el botón de la imagen para pausar la historia y volverla a reproducir.
- También puedes hacer tap en los laterales de la propia imagen para avanzar o retroceder en la historia.
- En cualquier momento puedes salir punsando sobre la flecha de retroceso en la parte superior izquierda de la pantalla.

> *Nota: Las historias estarán disponibles 24 horas.*

### 5.4. Publicaciones

Puedes crear una publicación pulsando el botón de **“Agregar”** del menú de navegación. Desde ahí:

- Escribe un título, una descripción (obligatorio).
- Selecciona la imagen que quieras incluir (opcional). Podrás elegirla de la galería o hacerla con la cámara.
- Elige si será una publicación pública (todos pueden verla) o privada (unicamente tú y tus seguidores podrán verla).
- Publica para que esté disponible.


### 5.5. Interacciones con publicaciones

Puedes interactuar con las publicaciones de otros usuarios pinchando sobre la propia publicación individual.

Desde ahí:

- Da “Me gusta” a las publicaciones que te interesen pinchando en el corazón.
- Comenta en publicaciones de otros usuarios accediendo desde el boton de comentarios.
- Responde a comentarios en hilos dentro de cada publicación.
- Elimina tus comentarios y respuestas si lo deseas.
- Vuelve a la pagina principal pulsando sobre la flecha de retroceso en la parte superior izquierda de la pantalla.


### 5.6. Gestión de incidencias

Desde la pestaña de **“Ticket”** del menú de navegación podrás informar en el caso de incidencias en los equipos del centro.

Desde ahí:

- Comprueba el listado de incidencias comunicadas y su estado.
- Describe el problema detectado en los equipos o servicios del centro accediendo al formulario.
- Puedes incorporar una imagen si lo deseas desde la cámara o la galería, así como eliminarla si finalmente no deseas incluirla.
- Envía el ticket y el equipo de soporte recibirá por correo el problema detectado.

### 5.7. Perfil de usuario

Desde la pestaña de **“Perfil”** del menú de navegación podrás:

- Modificar tu imagen de perfil (pulsando sobre tu imagen).
- Desloguearte pulsando sobre el botón Logout que aparece al pulsar sobre tus datos.
- Ver estadísticas personales (número de publicaciones, seguidores, seguidos).
- Ver tus publicaciones ordenadas cronológicamente.
- Consultar las publicaciones que has marcado como que te gustan.
- Acceder a las mismas pulsando sobre la imagen de cada publicación.


### 5.8. Búsqueda y gestión de usuarios

En la pestaña **“People”** del menú de navegación podrás:

- Busca usuarios mediante el buscador interactivo. Se irán filtrando los resultados a medida que escribes.
- Solicita seguir a otros usuarios.
- Si la solicitud es aceptada, ambos podrán:
  - Enviar mensajes directamente.
  - Ver publicaciones privadas del otro.
  - Cancelar seguimiento en cualquier momento.
-  Gestionar tus seguidores y seguidos (ver, dejar de seguir, aceptar solicitudes).
- Explorar sugerencias de personas a seguir.

> *Nota: Al aceptar una solicitud, no se requiere una segunda aceptación para el seguimiento mutuo, unicamente que la otra persona le de a “Seguir”. Llegará una notificación Expo Push de Nueva solicitud de amistad*


### 5.9. Mensajería

Desde la misma página de **“People”**, para comenzar una conversación privada con otra persona:

- Pulsa el botón de chat que aparece junto a la persona.
- Accederás a la pantalla de chat con la persona seleccionada. El sistema de mensajería es en tiempo real mediante sockets.
- Puedes escribir mensajes y enviarlos pulsando el botón de enviar.
- Podrás ver la conversación fechada bajo cada mensaje.
- Si la otra persona no contesta, los diferentes mensajes del mismo interlocutor se irán agrupando en la misma burbuja de chat pendiente.

## 6. Enlace a interfaz

El diseño de la interfaz de **Instadruna** ha sido prototipado utilizando **Figma**, herramienta de diseño colaborativo ampliamente utilizada en proyectos de desarrollo de interfaces modernas.

En este prototipo se incluyen:

- Estructura de navegación general  
- Pantallas de autenticación  
- Página principal de visionado de publicaciones  
- Página de creación de publicación individual  
- Detalles de publicaciones y comentarios  
- Sección de historias   
- Pantallas para el acceso al sistema de gestión de incidencias (tickets)  
- Perfil de usuario  
- Visionado y gestión de seguidores/seguidos  
- Acceso y estilo de la pantalla de mensajería instantánea  

Estas pantallas han servido como guía visual y funcional para el desarrollo de la aplicación, ayudando a mantener una coherencia estética y de experiencia de usuario. 

Si deseas acceder directamente al enlace, pincha [**aquí**.](https://www.figma.com/design/aej2xooQEUW4LGMnulCMy1/INSTADRUNA?node-id=0-1&t=qFSFNasy5dVvsXTS-1)



## 7. Conclusión

**Instadruna** ha sido concebida como una red social interna para el centro educativo que promueva en esta comunidad la comunicación fluida, la interacción entre usuarios y la gestión de incidencias de forma directa y eficaz. El desarrollo del proyecto ha seguido una arquitectura modular por capas, incorporando un frontend móvil con React Native, un backend principal robusto con Spring Boot y un microservicio de mensajería en tiempo real basado en Node.js y WebSockets.

El uso de tecnologías modernas, patrones de diseño claros y una división lógica de responsabilidades permite no solo una experiencia de usuario intuitiva y responsiva, sino también una plataforma fácilmente escalable, mantenible y abierta a futuras ampliaciones. Entre las funcionalidades destacadas se incluyen la publicación y reacción a contenido, la mensajería instantánea, la autenticación con Google, el envío de notificaciones y la comunicación de incidencias.

Este proyecto comenzó como una simple idea planteada en el segundo trimestre del curso, con el objetivo de dar respuesta a una necesidad real dentro de los entornos formativos. A lo largo del proceso, se ha transformado en algo mucho más grande: una propuesta funcional, con una arquitectura sólida, pensada para crecer.

Más allá de su estado actual, **Instadruna** representa una muestra del poder que tienen las nuevas tecnologías para conectar comunidades, facilitar la colaboración y dar forma a soluciones útiles. Ojalá esta primera piedra sirva para que otros puedan construir sobre ella: adaptándola, ampliándola y mejorándola según las nuevas necesidades que surjan. Porque, al final, esto no solo ha sido un proyecto de fin de grado. Ha sido una oportunidad para aprender haciendo, y despedirme sabiendo que, de alguna forma, también dejo algo aportado.

**Instadruna** es apenas el comienzo de una historia más grande. Que quienes vengan después sigan caminando este sendero, ya sea guiados por la luz de Eärendil… o impulsados por la Fuerza. ***Porque toda aventura merece ser continuada***.


## 8. Agradecimientos

A todos aquellos amigos y familiares que han estado apoyándome desde el primer momento en que inicié esta locura. Gracias por seguir a mi lado a pesar de las quedadas pospuestas, de las ausencias justificadas por el trabajo, y de todo el tiempo que esta etapa ha exigido. Cada palabra de aliento, cada gesto, cada comprensión, ha contado más de lo que imagináis.

A mis profesores, por la confianza que siempre han depositado en mí, incluso aquellos con los que ya no coincidí en este último curso, pero que dejaron huella con su apoyo y enseñanzas.

A mis compañeros, por hacerme sentir especial sin serlo, por esos ánimos constantes que me han acompañado en cada fase del proyecto, y por sostenerme en los momentos donde flaquear parecía más fácil que continuar.

A mi pareja, que ha hecho de la paciencia una virtud. No sabría contar cuántas veces se ha asomado al cuarto donde programaba, solo para comprobar si seguía viva o si necesitaba algo. También ha estado ahí para soportar mis momentos de duda y agotamiento, y eso vale más que cualquier línea de código.

A los nuevos compañeros, colegas y superiores que me empiezan a acompañar en esta nueva etapa profesional y personal. Me habéis demostrado que hay formas sanas y humanas de crecer en equipo, y que confiar en uno mismo es más fácil cuando otros también creen en ti.

Gracias. A todos los que estáis y estaréis. Este producto, este avance, esta evolución... han sido posibles porque me habéis hecho creer e ilusionarme con la idea de que **sí, era posible**.

## 9. Licencia

**Instadruna** está bajo la licencia **MIT**, lo que te permite utilizar, modificar y distribuir este proyecto bajo las siguientes condiciones:

- Permiso para usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y vender copias del software.
- El software se proporciona “tal cual”, sin ninguna garantía expresa o implícita.

### Licencias de Dependencias

Este proyecto también incluye dependencias de diversas librerías y tecnologías que tienen sus propias licencias. A continuación, se detalla el tipo de licencia de cada una de las dependencias del frontend:

- **React Native**: [Licencia MIT](https://github.com/facebook/react-native/blob/main/LICENSE)
- **Expo**: [Licencia MIT](https://github.com/expo/expo/blob/main/LICENSE)

## 10. Contacto

Para cualquier consulta, sugerencia o propuesta relacionada con el proyecto **Instadruna**, no dudes en ponerte en contacto a través de los siguientes canales:

- 📧 **Correo electrónico**: dianamariapascual@gmail.com  
- 💼 **LinkedIn**: [Diana Pascual García](https://www.linkedin.com/in/diana-pascual-garc%C3%ADa-47209431) 
- 💻 **GitHub**: [https://github.com/DiMaPaGa](https://github.com/DiMaPaGa)

Estaré encantada de atenderte y colaborar en todo lo posible.  
Gracias de antemano por tu interés.

## 11. Referencias y recursos empleados:

A continuación se presenta una recopilación de las principales fuentes de información y recursos utilizados durante el desarrollo del proyecto.

### 📚 Documentación oficial
  
- [React Native – Documentación oficial](https://reactnative.dev/docs/getting-started)  

### 🧰 Herramientas de desarrollo y diseño
 
- [Figma – Diseño UI/UX](https://www.figma.com/)  
- [Canva – Recursos visuales](https://www.canva.com/)  
- [Expo – Desarrollo React Native](https://expo.dev/accounts/diana7/projects)  
- [EAS Build (Expo Application Services) – Compilación y distribución](https://docs.expo.dev/build/introduction/)   




