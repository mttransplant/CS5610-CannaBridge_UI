import ProductList from './ProductList.jsx';
import RequestList from './RequestList.jsx';
import IssueReport from './IssueReport.jsx';
import ProductEdit from './ProductEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';

const routes = [
  { path: '/products/:id?', component: ProductList },
  { path: '/requests/:id?', component: RequestList },
  { path: '/edit/product/:id', component: ProductEdit },
  { path: '/report', component: IssueReport },
  { path: '/about', component: About },
  { path: '*', component: NotFound },
];

export default routes;
