#🌍 WorldCook – MERN Stack Recipe Platform
## Cocina. Comparte. Explora.
## Una aplicación full-stack de recetas construida con MongoDB, Express, React y Node.js que permite a los usuarios publicar, interactuar y descubrir sabores de todo el mundo.
## 🎯 ¿Qué hace especial a WorldCook?
##Table
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
### Avatar real
## Mis recetas
### Editar perfil / cambiar foto
### 2. Publicar receta
### Cover + galería de pasos
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
### Mejora	Detalle
## ✅ Edición inline	Comentarios editables sin modal
## ✅ Favoritos dinámicos	Botón “Quitar” + vista “Recetas guardadas”
## ✅ Avatar real	Se pide por axios si no viene en el objeto
## ✅ Like/Fav siempre visibles	No solo para el dueño
## ✅ Rating en %	Barra visual 0-100 %
## ✅ Búsqueda avanzada	Filtros por título, categoría, tiempo, dieta, alérgenos
## ✅ Imágenes limpias	Se borran del disco al actualizar/eliminar

# 🧪 Próximos pasos (Frontend en construcción)
## ✅ PWA – para instalar como app
## ✅ Notificaciones toast – para likes, comentarios, etc.
## ✅ Búsqueda en tiempo real – con debounce
## ✅ Paginación infinita – en listados

# Creado por RichFullz 💛 – 2025
