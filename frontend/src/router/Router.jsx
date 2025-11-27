import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import MyRecipes from '../pages/MyRecipes';
import AllRecipes from '../pages/AllRecipes';
import EditRecipe from '../pages/EditRecipe';
import RecipesView from '../pages/RecipesView';
import CreateRecipe from '../pages/CreateRecipe';
import FavoriteList from '../pages/FavoriteList';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/my-recipes" element={<MyRecipes />} />
                <Route path="/recipes" element={<AllRecipes />} />
                <Route path="/recipes/create" element={<CreateRecipe />} />
                <Route path="/recipes/view/:id" element={<RecipesView />} />
                <Route path="/recipes/edit/:id" element={<EditRecipe />} />
                <Route path="/mis-favoritos" element={<FavoriteList />} />
            </Routes>
        </BrowserRouter>
    );
}