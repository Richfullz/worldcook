# 🌍 WorldCook – MERN Stack Recipe Platform
## Cocina. Comparte. Explora.
## Una aplicación full-stack de recetas construida con MongoDB, Express, React y Node.js que permite a los usuarios publicar, interactuar y descubrir sabores de todo el mundo.
## 🎯 ¿Qué hace especial a WorldCook?
## Table
## Copy
## Característica	Descripción rápida
### 🔐 Auth inteligente	Login con email o nickname + JWT
### 📸 Imágenes reales	Avatar de perfil + cover + galería de pasos
### 💬 Interacción total	Like, favorito, comentario editable y rating 0-5 ⭐
### 🔍 Búsqueda avanzada	Filtros por título, categoría, tiempo, dieta, alérgenos
### ✏️ Edición inline	Edita tus comentarios sin salir de la receta
### 💔 Favoritos dinámicos	Botón “Quitar” + vista “Recetas guardadas”
### 🌗 Diseño oscuro premium	Sin CSS nuevo, solo clases existentes
### 🧪 Demo interactiva (Backend)

## Levanta la API en 30 segundos:
#### bash
### Copy
### git clone https://github.com/TU_USUARIO/worldcook-backend.git
### cd backend
### npm install
### cp .env.example .env              # Completa MONGO_URI y JWT_SECRET
### npm run dev                       # 🚀 Escucha en :5000

## 📸 Vista previa de funciones
### 1. Perfil de usuario
### Avatar real + datos personales + boton de editar +
### acceso a sus recetas + acceso a favoritos guardados+ eliminar cuenta
## Mis recetas
### Editar receta
### 2. Publicar receta
### Formulario
### Ingredientes, tiempo, porciones, categoría, dieta, alérgenos
### Imágenes se borran al actualizar/eliminar
### 3. Interacciones en tiempo real
### Like ❤️ – alterna estado
### Favorito 💾 – vista “Mis guardados” con botón “Quitar”
### Comentarios que puede editar su autor ✏️ 
### Rating ⭐ – barra de % + estrellas interactivas

## 🔧 Stack técnico (Backend)
### Table
### Copy
### Capa	Tecnología
### Runtime	Node.js
### Framework	Express.js
### Base datos	MongoDB (Mongoose)
### Auth	JWT (jsonwebtoken)
### Img upload	Multer (5 MB, JPG/PNG/WebP)
### Hash pwd	bcryptjs
### Entorno	dotenv
## 🧪 Endpoints destacados
## 🔐 Auth
### http
### Copy
### POST /api/users/register → Crear cuenta (+ avatar)
### POST /api/users/login → Login (email o nickname)
### GET /api/users/profile/:id → Perfil público
## 🧑‍🍳 Recetas
### http
### Copy
### POST /api/recipes/create → Nueva receta (+ imágenes)
### GET /api/recipes/search?title=tarta&category=Postres&maxTime=60
### GET /api/recipes/view/:id → Detalle público
## 💬 Interacciones
### http
### Copy
### POST /likes/toggle/:id → Like / unlike
### POST /favorites/toggle/:id → Fav / unfav
### PUT /comments/update/:id → Editar comentario (autor)
### POST /ratings/add/:id → Valorar 1-5 ⭐
### 🌟 Mejoras implementadas
### Table
### Copy

## 🧱 Stack técnico (Backend)
### Table
### Copy
### Capa	Tecnología
### Runtime	Node.js
### Framework	Express.js
### Base datos	MongoDB (Mongoose)
### Auth	JWT (jsonwebtoken)
### Img upload	Multer (5 MB, JPG/PNG/WebP)
### Hash pwd	bcryptjs
### Entorno	dotenv

## 🔐 Autenticación (JWT)
### Table
### Copy
### Método	Endpoint	Descripción
### POST	/api/users/register	Crear cuenta (+ avatar)
### POST	/api/users/login	Login (email o nickname)
### GET	/api/users/profile/:id	Perfil público
### PUT	/api/users/update/:id	Editar perfil / avatar
### DELETE	/api/users/delete/:id	Eliminar cuenta + avatar
### Header protegido:
### http
### Copy
### Authorization: <tu_JWT>

## 🧑‍🍳 Recetas (CRUD + imágenes)
### Table
### Copy
### Método	Endpoint	Uso
### POST	/api/recipes/create	Nueva receta (+ imágenes)
### GET	/api/recipes/my	Mis recetas
### GET	/api/recipes/view/:id	Detalle (público)
### PUT	/api/recipes/update/:id	Editar (autor)
### DELETE	/api/recipes/delete/:id	Eliminar (+ imágenes)
### GET	/api/recipes/search	Filtros avanzados
### Ejemplo de búsqueda:
### /api/recipes/search?title=tarta&category=Postres&maxTime=60&sort=title

## 💬 Interacciones (Like, Fav, Comentario, Rating)
### Table
### Copy
### Recurso	Método	Endpoint	Acción
### Comentarios	POST	/comments/add/:id	Agregar
### PUT	/comments/update/:id	Editar (autor)
### DELETE	/comments/delete/:id	Borrar (autor)
### Likes	POST	/likes/toggle/:id	Like / unlike
### Favoritos	POST	/favorites/toggle/:id	Fav / unfav
### Ratings	POST	/ratings/add/:id	Valorar 1-5 ⭐
### Cada endpoint de like/fav alterna estado (si das like 2 veces → se quita).

## 📸 Subida de imágenes (Multer)
### Table
### Copy
### Tipo	Ruta	Límite
### Avatar usuario	/uploads/users/	1 archivo
### Cover receta	/uploads/recipes/cover/	1 archivo
### Steps receta	/uploads/recipes/steps/	hasta 10 archivos
### Individual	5 MB	JPG, PNG, WebP
### Al actualizar/eliminar usuario o receta → imágenes antiguas se borran del disco.

## 🧪 Próximos pasos (Frontend en construcción)
### ✅ PWA – para instalar como app
### ✅ Notificaciones toast – para likes, comentarios, etc.
### ✅ Búsqueda en tiempo real – con debounce
### ✅ Paginación infinita – en listados

## Imagenes del proyecto:

## Home
### <img width="1771" height="914" alt="image" src="https://github.com/user-attachments/assets/f4d46e5f-3bc3-43bd-bc0c-c24632cb4b65" />
### <img width="1766" height="914" alt="image" src="https://github.com/user-attachments/assets/5868e027-82e3-419d-8956-71b6a6b84eda" />

## Register
### <img width="1204" height="895" alt="image" src="https://github.com/user-attachments/assets/73e729b8-50b4-4b1d-93b7-eb2f910593a3" />
### <img width="1296" height="872" alt="image" src="https://github.com/user-attachments/assets/7a3aa372-0ca0-4e2e-a1e0-7085a3c2e6d2" />

## Login
### <img width="1077" height="850" alt="image" src="https://github.com/user-attachments/assets/4008b627-0b46-4159-b209-0f4ebc0902fd" />

## Profile
### <img width="1164" height="910" alt="image" src="https://github.com/user-attachments/assets/4b05932b-3a39-4f02-8db9-43f9ef82f4dd" />

## Edit Profile
### <img width="1836" height="917" alt="image" src="https://github.com/user-attachments/assets/6669676e-58a8-4b4a-aac4-da257603d339" />
### <img width="981" height="878" alt="image" src="https://github.com/user-attachments/assets/1fcd15fe-66a8-459b-b168-921489ea24e5" />

## boton eliminar cuenta
### <img width="1533" height="864" alt="image" src="https://github.com/user-attachments/assets/24c9c3e0-a2e4-4cf4-8337-7ecfb10c4105" />

## Mis recetas
### <img width="1602" height="868" alt="image" src="https://github.com/user-attachments/assets/f8ee6cfd-3ffd-42d9-953e-a9cfde452f22" />

## ver receta
### <img width="1670" height="897" alt="image" src="https://github.com/user-attachments/assets/84469c9c-86cf-48b9-b530-7c72f04143d5" />
### <img width="1282" height="591" alt="image" src="https://github.com/user-attachments/assets/8be7af79-c943-4b4e-a899-cd6b5ee2f5df" />
### <img width="1245" height="895" alt="image" src="https://github.com/user-attachments/assets/0614c6d6-91f5-4229-ac31-1e6780385d5a" />
### <img width="1403" height="918" alt="image" src="https://github.com/user-attachments/assets/16595d29-cfd2-4765-aa8d-17295b905473" />
### <img width="871" height="719" alt="image" src="https://github.com/user-attachments/assets/0a5ccb13-f399-4832-9c7d-57b62da868ed" />
### <img width="1527" height="849" alt="image" src="https://github.com/user-attachments/assets/bbfebdf6-dc12-49e0-a223-e75eab80a56b" />

## Todas las recetas
### <img width="1418" height="861" alt="image" src="https://github.com/user-attachments/assets/297ef435-3365-48c3-be03-4d6fa51192dc" />
### <img width="1532" height="902" alt="image" src="https://github.com/user-attachments/assets/f9db63c5-310c-420d-a700-e463f8fff469" />
### <img width="1172" height="622" alt="image" src="https://github.com/user-attachments/assets/72e4f15e-82b6-48ff-907d-3a7389f09c08" />
### <img width="1356" height="845" alt="image" src="https://github.com/user-attachments/assets/f0841672-0cda-4642-aca3-c0ef3eff0988" />
### <img width="1111" height="659" alt="image" src="https://github.com/user-attachments/assets/3d10feab-f4cf-4424-8aa0-073de7da9f31" />

## Recetas guardadas en favoritos
### <img width="1779" height="783" alt="image" src="https://github.com/user-attachments/assets/b75182ae-0482-4bc7-86f0-2abf8578cd52" />

### MIT License
### Copyright (c) 2025 RichFullz

### Permission is hereby granted, free of charge, to any person obtaining a copy
### of this software and associated documentation files (the "Software"), to deal
### in the Software without restriction, including without limitation the rights
### to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
### copies of the Software, and to permit persons to whom the Software is
### furnished to do so, subject to the following conditions:

### The above copyright notice and this permission notice shall be included in all
### copies or substantial portions of the Software.

### THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
### IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
### FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
### AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
### LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
### OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
### SOFTWARE.

# Creado por RichFullz 💛 – 2025
