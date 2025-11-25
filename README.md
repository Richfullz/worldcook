# 🍽️ Recetas App – Backend (MERN Stack)

## Esta App es una aplicacion de recetas de cocina construida con tecnologías Full-Stack MERN,
## permite a los usuarios registrarse, publicar recetas, interactuar con ellas aportando likes, favoritos,comentarios y valoraciones a las recetas
## nuestras o a otros usuarios y tambien subir imagenes, una para ponerla de perfil y otra para ver los pasos como se hacen o algun punto importante que destaque
## en la receta

# Arquitectura
## Backend
### backend/
### ├─ 📁 controllers/     # Lógica de negocio
### ├─ 📁 middleware/      # Auth & multer
### ├─ 📁 models/          # Esquemas MongoDB
### ├─ 📁 routes/          # Endpoints API
### ├─ 📁 uploads/         # Imágenes (users & recipes)
### ├─ .env                # Variables de entorno (NO subir)
### ├─ .gitignore
### ├─ server.js           # Entrada de la aplicación
### └─ README.md

## 🚀 Stack Tecnológico

### | Capa        | Tecnología              |
### |-------------|-------------------------|
### | Runtime     | Node.js                 |
### | Framework   | Express.js              |
### | Base datos  | MongoDB (Mongoose)      |
### | Auth        | JWT (jsonwebtoken)      |
### | Img upload  | Multer                  |
### | Hash pwd    | bcryptjs                |
### | Entorno     | dotenv                  |

## 🔐 Autenticación
### POST /api/users/register     ➜ Crear cuenta (+ avatar)
### POST /api/users/login        ➜ Login (email o nickname)
### GET  /api/users/profile/:id  ➜ Ver perfil público
### PUT  /api/users/update/:id   ➜ Editar perfil / cambiar avatar
### DELETE /api/users/delete/:id ➜ Eliminar cuenta + avatar

## **Header protegido:**  
### `Authorization: <JWT_TOKEN>`

## 🧑‍🍳 Recetas (CRUD completo)
### POST   /api/recipe/create        ➜ Nueva receta (+ imágenes)
### GET    /api/recipe/my            ➜ Mis recetas
### GET    /api/recipe/view/:id      ➜ Detalle receta (público)
### PUT    /api/recipe/update/:id    ➜ Editar (solo autor)
### DELETE /api/recipe/delete/:id    ➜ Eliminar (borra imgs)
### GET    /api/recipe/search        ➜ Filtros: título, categoría, dieta, alérgenos, tiempo máximo, ordenación
### Copy

##**Ejemplo de búsqueda:**  
### /api/recipe/search?title=tarta&category=Postres&maxTime=60&sort=title`

## 💬 Interacciones

### | Recurso   | Método | Endpoint (base `/api`) | Descripción |
### |-----------|--------|------------------------|-------------|
### | **Comentarios** | POST | `/comments/add/:id` | Agregar |
### |               | GET  | `/comments/view/:id` | Ver todos |
### |               | PUT  | `/comments/update/:id` | Editar (autor) |
### |               | DELETE | `/comments/delete/:id` | Borrar (autor) |
### |               | GET | `/comments/count/:id` | Total |
### | **Likes** | POST | `/likes/toggle/:id` | Like / unlike |
### |           | GET  | `/likes/count/:id` | Total likes |
### | **Favoritos** | POST | `/favorites/toggle/:id` | Fav / unfav |
### |               | GET  | `/favorites/count/:id` | Total favoritos |
### | **Ratings** | POST | `/ratings/add/:id` | Valorar 1-5 ⭐ |
### |             | GET  | `/ratings/get/:id` | Promedio + total |

### > El mismo endpoint **crea** o **elimina** el like/favorito si se pulsa dos veces.

## 📸 Subida de imágenes

### | Tipo | Ruta almacenamiento | Cantidad / tamaño |
### |------|---------------------|-------------------|
### | Avatar usuario | `/uploads/users/` | 1 archivo |
### | Cover receta   | `/uploads/recipes/cover/` | 1 archivo |
### | Steps receta   | `/uploads/recipes/steps/` | hasta 10 archivos |
### | Límite individual | 5 MB | JPG, PNG, WebP |

### Al actualizar/eliminar receta o usuario **se borran los archivos antiguos del disco**.

## 🌍 Variables de entorno (.env)

## bash
### `MONGO_URI=mongodb+srv://...`
### `JWT_SECRET=super_secreto`
### `PORT=5000`
