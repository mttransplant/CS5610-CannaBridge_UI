import ProductList from './ProductList.jsx';
import RequestList from './RequestList.jsx';
import IssueReport from './IssueReport.jsx';
import ProductEdit from './ProductEdit.jsx';
import RequestEdit from './RequestEdit.jsx';
import About from './About.jsx';
import ContactUs from './ContactUs.jsx';
import AccountRequest from './AccountRequest.jsx';
import NotFound from './NotFound.jsx';


const routes = [
  { path: '/products/:id?', component: ProductList },
  { path: '/requests/:id?', component: RequestList },
  { path: '/edit/product/:id', component: ProductEdit },
  { path: '/edit/request/:id', component: RequestEdit },
  { path: '/report', component: IssueReport },
  { path: '/about', component: About },
  { path: '/contact', component: ContactUs },
  { path: '/accountrequest', component: AccountRequest },
  { path: '*', component: NotFound },
];

export default routes;
