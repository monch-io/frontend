import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./routes";
import Recipes from "./routes/recipes";
import ViewRecipe from "./routes/recipes/view";
import CreateRecipe from "./routes/recipes/create";
import ViewIngredient from "./routes/ingredients/view";
import CreateIngredient from "./routes/ingredients/create";
import Ingredients from "./routes/ingredients";
import Meals from "./routes/meals";
import CreateMeal from "./routes/meals/create";
import ViewMeal from "./routes/meals/view";
import NotFound from "./routes/not-found";
import ContentLayout from "./views/Content";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route
            path="recipes"
            element={<ContentLayout title="Recipes" kind="recipes" />}
          >
            <Route path=":recipeId" element={<ViewRecipe />} />
            <Route path="new" element={<CreateRecipe />} />
            <Route index element={<Recipes />} />
          </Route>
          <Route
            path="ingredients"
            element={<ContentLayout title="Ingredients" kind="ingredients" />}
          >
            <Route path=":ingredientId" element={<ViewIngredient />} />
            <Route path="new" element={<CreateIngredient />} />
            <Route index element={<Ingredients />} />
          </Route>
          <Route
            path="meals"
            element={<ContentLayout title="Meals" kind="meals" />}
          >
            <Route path=":mealId" element={<ViewMeal />} />
            <Route path="new" element={<CreateMeal />} />
            <Route index element={<Meals />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
