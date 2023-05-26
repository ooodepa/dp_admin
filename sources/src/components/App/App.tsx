import { Routes, Route } from 'react-router-dom';

import HomePage from '../HomePage/HomePage';
import LoginPage from '../LoginPage/LoginPage';
import GetItemsPage from '../GetItems/GetItems';
import GetBrandsPage from '../GetBrandsPage/GetBrandsPage';
import CreateBrandPage from '../CreateBrandPage/CreateBrandPage';
import UpdateBrandPage from '../UpdateBrandPage/UpdateBrandPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/items" element={<GetItemsPage />} />
      <Route path="/brands" element={<GetBrandsPage />} />
      <Route path="/brands/:id/" element={<UpdateBrandPage />} />
      <Route path="/brands/new/create" element={<CreateBrandPage />} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}
