import React from 'react';

import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ProductFilter from './ProductFilter.jsx';
import ProductTable from './ProductTable.jsx';
import ProductDetail from './ProductDetail.jsx';
import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import store from './store.js';

const SECTION_SIZE = 5;

function PageLink({
  params, page, activePage, children,
}) {
  params.set('page', page);
  if (page === 0) return React.cloneElement(children, { disabled: true });
  return (
    <LinkContainer
      isActive={() => page === activePage}
      to={{ search: `?${params.toString()}` }}
    >
      {children}
    </LinkContainer>
  );
}

class ProductList extends React.Component {
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };
    if (params.get('status')) vars.status = params.get('status');

    const dateMin = parseInt(params.get('dateMin'), 10);
    if (!Number.isNaN(dateMin)) vars.dateMin = dateMin;
    const dateMax = parseInt(params.get('dateMax'), 10);
    if (!Number.isNaN(dateMax)) vars.dateMax = dateMax;

    const { params: { id } } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;
    // TODO: Update Query for #Iter2
    const query = `query issueList (
      $status: StatusType
      $dateMin: Int
      $dateMax: Int
      $hasSelection: Boolean!
      $selectedId: Int!
      $page: Int
    ) {
        issueList (
          status: $status
         effortMin: $dateMin
         effortMax: $dateMax
         page: $page
        ) {
            issues {
            id title status owner
            created effort due
            }
            pages
          }
        issue(id: $selectedId) @include (if: $hasSelection) {
          id description
        }
      }`;


    let data = await graphQLFetch(query, vars, showError);
    // TODO: Link up to new MongoDB for Products. Hold for #Iter2
    data = { productList: { products: [], pages: 0 } };
    return data;
  }

  constructor() {
    super();
    const initialData = store.initialData || { productList: {} };
    const {
      productList: { products, pages }, product: selectedProduct,
    } = initialData;
    delete store.initialData;
    this.state = {
      products,
      selectedProduct,
      pages,
    };
    this.closeProduct = this.closeProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    const { products } = this.state;
    if (products == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { id: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { id } } } = this.props;
    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await ProductList.fetchData(match, search, showError);
    if (data) {
      this.setState({
        products: data.productList.products,
        selectedProduct: data.product,
        pages: data.productList.pages,
      });
    }
  }

  async closeProduct(index) {
    // TODO: Update query
    const query = `mutation issueClose($id: Int!) {
      issueUpdate(id: $id, changes: {status: Closed}) {
        id title status owner
        effort created due description
      }
    }`;
    const { products } = this.state;
    const { showError } = this.props;
    const data = await graphQLFetch(query, { id: products[index].id }, showError);
    if (data) {
      this.setState((prevState) => {
        const newList = [...prevState.products];
        // TODO: update to productUpdate when GraphQL is updated in #Iter2
        newList[index] = data.issueUpdate;
        return { products: newList };
      });
    } else {
      this.loadData();
    }
  }

  async deleteProduct(index) {
    const query = `mutation issueDelete($id: Int!) {
      issueDelete(id: $id)
    }`;
    const { products } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { id } = products[index];
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { id }, showError);
    // TODO: Update to productDelete when GraphQL is updated in #Iter2
    if (data && data.issueDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.products];
        if (pathname === `/products/${id}`) {
          history.push({ pathname: '/products', search });
        }
        newList.splice(index, 1);
        const undoMessage = (
          <span>
            {`Deleted product ${id} successfully.`}
            <Button bsStyle="link" onClick={() => this.restoreIssue(id)}>
              UNDO
            </Button>
          </span>
        );
        showSuccess(undoMessage);
        return { products: newList };
      });
    } else {
      this.loadData();
    }
  }

  async restoreIssue(id) {
    const query = `mutation issueRestore($id: Int!) {
      issueRestore(id: $id)
    }`;
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { id }, showError);
    if (data) { showSuccess(`Product ${id} restored successfully.`); }
    this.loadData();
  }

  render() {
    const { products } = this.state;
    if (products == null) return null;
    const { selectedProduct, pages } = this.state;
    const { location: { search } } = this.props;

    const params = new URLSearchParams(search);
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
    const endPage = startPage + SECTION_SIZE - 1;
    const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
    const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;

    const items = [];
    for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
      params.set('page', i);
      items.push((
        <PageLink key={i} params={params} activePage={page} page={i}>
          <Pagination.Item>{i}</Pagination.Item>
        </PageLink>
      ));
    }

    return (
      <React.Fragment>
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <ProductFilter urlBase="/products" />
          </Panel.Body>
        </Panel>
        <ProductTable
          products={products}
          closeProduct={this.closeProduct}
          deleteProduct={this.deleteProduct}
        />
        <ProductDetail product={selectedProduct} />
        <Pagination>
          <PageLink params={params} page={prevSection}>
            <Pagination.Item>{'<'}</Pagination.Item>
          </PageLink>
          {items}
          <PageLink params={params} page={nextSection}>
            <Pagination.Item>{'>'}</Pagination.Item>
          </PageLink>
        </Pagination>
      </React.Fragment>
    );
  }
}

const ProductListWithToast = withToast(ProductList);
ProductListWithToast.fetchData = ProductList.fetchData;
export default ProductListWithToast;
