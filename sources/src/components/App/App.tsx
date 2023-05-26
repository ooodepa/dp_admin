import { Routes, Route } from 'react-router-dom';

import HomePage from '../HomePage/HomePage';
import LoginPage from '../LoginPage/LoginPage';
import GetItemsPage from '../GetItems/GetItems';
import Error404Page from '../Error404Page/Error404Page';
import GetBrandsPage from '../GetBrandsPage/GetBrandsPage';
import CreateItemPage from '../CreateItemPage/CreateItemPage';
import UpdateItemPage from '../UpdateItemPage/UpdateItemPage';
import CreateBrandPage from '../CreateBrandPage/CreateBrandPage';
import UpdateBrandPage from '../UpdateBrandPage/UpdateBrandPage';
import GetItemCategoriesPage from '../GetItemCategoriesPage/GetItemCategoriesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/items" element={<GetItemsPage />} />
      <Route path="/items/:id/" element={<UpdateItemPage />} />
      <Route path="/items/new/create" element={<CreateItemPage />} />
      <Route path="/brands" element={<GetBrandsPage />} />
      <Route path="/brands/:id/" element={<UpdateBrandPage />} />
      <Route path="/brands/new/create" element={<CreateBrandPage />} />
      <Route path="/item-categories" element={<GetItemCategoriesPage />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}
