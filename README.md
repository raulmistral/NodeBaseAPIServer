## Codigo base con autenticación vía token
Este código sirve de base para arrancar con la construcción de un servidor API

##### Punto de entrada
La aplicación entra en app. Recuerde la instrucción
- node app
- nodemon app

Si necesita generar todo el servidor descargado desde git, recuerde
- npm init

#### Los modelos están en /models
Existen varios modelos
- Modelo del Servidor
- Modelo del Usuario
- Modelo del DAO

#### Las rutas están /routes
Las rutas habilitan un conjunto de end points relacionados para prestar un conjunto íntegro de servicios. Así, por ejmeplo, se tienen las rutas de usuarios y autorización. Cada una de esas rutas van a hacer referencia a sus controladores respectivos

#### Los middlewares de las rutas están en /middlewares
Una facaultad de express en node es su capacidad de usar middlewares en las llamadas a rutas. Acá están esos componentes. Por ejemplo, los middlewares asociados con autenticación (verificación de token de autenticación y verificación de rol administrador en el usuario) residen en /middlewares/authentication.js y son llamados desde las rutas para validar la autenticación del usuario

#### Los controladores están en /controllers
Los controladores son los encargados de atender los servivios que se solicitan a los end points. En este modelo están agrupados por ruta. Así, la ruta usuarios tiene el controlador usuarios y la ruta auth tiene el controlador auth. Desde los controladores se harán las llamadas a los DAO.

#### Lo relacionado con datos esta en /dbrepos
Dado que se está usando una base de datos SQLite, los datos residen en vc.db dentro de /dbrepos/db. 

Adicionalmente, se tendrá un DAO por cada entidad de negocio manejada. Por ejemplo, el usuario es una entidad de negocio, la cual está definida por /models/userModel.js. Este modelo contendrá la clase que define el objeto de negocio y sus validadores. Ese objeto de negocio consigue expresión en /dbrepos/usuariodbr.js, que es el DAO que manejará la interacción con la base de datos.

#### Cualquier servicio de apoyo está en /helpers
Es el espacio reservado para colocar cualquiier servicio de aporyo a la aplicación.
