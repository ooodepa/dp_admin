import { Routes, Route } from 'react-router-dom';

import HomePage from '../HomePage/HomePage';
import LoginPage from '../LoginPage/LoginPage';
import GetItemsPage from '../GetItems/GetItems';
import Error404Page from '../Error404Page/Error404Page';
import CreateItemPage from '../CreateItemPage/CreateItemPage';
import UpdateItemPage from '../UpdateItemPage/UpdateItemPage';
import GetItemBrandsPage from '../GetItemBrandsPage/GetItemBrandsPage';
import CreateImemBrandPage from '../CreateItemBrandPage/CreateItemBrandPage';
import UpdateItemBrandPage from '../UpdateItemBrandPage/UpdateItemBrandPage';
import GetItemCategoriesPage from '../GetItemCategoriesPage/GetItemCategoriesPage';
import CreateItemCategoryPage from '../CreateItemCategoryPage/CreateItemCategoryPage';
import UpdateItemCategoryPage from '../UpdateItemCategoryPage/UpdateItemCategoryPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/items" element={<GetItemsPage />} />
      <Route path="/items/:id/" element={<UpdateItemPage />} />
      <Route path="/items/new/create" element={<CreateItemPage />} />
      <Route path="/brands" element={<GetItemBrandsPage />} />
      <Route path="/brands/:id/" element={<UpdateItemBrandPage />} />
      <Route path="/brands/new/create" element={<CreateImemBrandPage />} />
      <Route path="/item-categories/:id" element={<UpdateItemCategoryPage />} />
      <Route
        path="/item-categories/new/create"
        element={<CreateItemCategoryPage />}
      />
      <Route path="/item-categories" element={<GetItemCategoriesPage />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}
