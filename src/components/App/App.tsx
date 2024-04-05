import { Routes, Route } from 'react-router-dom';

import HomePage from '../HomePage/HomePage';
import LoginPage from '../LoginPage/LoginPage';
import GetItemsPage from '../../pages/admin/items/items';
import Error404Page from '../Error404Page/Error404Page';
import OpenItemsPage from '../../pages/admin/items/open/open';
import CreateItemPage from '../CreateItemPage/CreateItemPage';
import UpdateItemPage from '../../pages/admin/items/update/UpdateItemPage';
import GetItemBrandsPage from '../GetItemBrandsPage/GetItemBrandsPage';
import CreateImemBrandPage from '../CreateItemBrandPage/CreateItemBrandPage';
import UpdateItemBrandPage from '../UpdateItemBrandPage/UpdateItemBrandPage';
import GetItemCategoriesPage from '../GetItemCategoriesPage/GetItemCategoriesPage';
import CreateItemCategoryPage from '../CreateItemCategoryPage/CreateItemCategoryPage';
import UpdateItemCategoryPage from '../UpdateItemCategoryPage/UpdateItemCategoryPage';
import OpenItemCategoriesPage from '../OpenItemCategoriesPage/OpenItemCategoriesPage';

interface IRouter {
  path: string;
  element: React.ReactNode | null;
}

const routes: IRouter[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/items',
    element: <GetItemsPage />,
  },
  {
    path: '/items/open/',
    element: <OpenItemsPage />,
  },
  {
    path: '/items/update/:id/',
    element: <UpdateItemPage />,
  },
  {
    path: '/items/new',
    element: <CreateItemPage />,
  },
  {
    path: '/item-brands',
    element: <GetItemBrandsPage />,
  },
  {
    path: '/item-brands/:id/',
    element: <UpdateItemBrandPage />,
  },
  {
    path: '/item-brands/new/create',
    element: <CreateImemBrandPage />,
  },
  {
    path: '/item-categories/open/',
    element: <OpenItemCategoriesPage />,
  },
  {
    path: '/item-categories/:id',
    element: <UpdateItemCategoryPage />,
  },
  {
    path: '/item-categories/new/create',
    element: <CreateItemCategoryPage />,
  },
  {
    path: '/item-categories',
    element: <GetItemCategoriesPage />,
  },
  {
    path: '*',
    element: <Error404Page />,
  },
];

export default function App() {
  return (
    <Routes>
      {routes.map((element, index) => {
        return (
          <Route key={index} path={element.path} element={element.element} />
        );
      })}
    </Routes>
  );
}
