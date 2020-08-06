import React from 'react';

import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ListFilter from './ListFilter.jsx';
import RequestTable from './RequestTable.jsx';
import ItemDetail from './ItemDetail.jsx';
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

class RequestList extends React.Component {
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };
    if (params.get('type')) vars.type = params.get('type');

    // TODO: Update these to look for strings
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
    // TODO: Modify query for #Iter2: if(dispensary) show only myRequesets, else show all requests
    const query = `query requestList (
      $type: Type
      $dateMin: Int
      $dateMax: Int
      $hasSelection: Boolean!
      $selectedId: Int!
      $page: Int
    ) {
         requestList (
         type: $type
         dateMin: $dateMin
         dateMax: $dateMax
         page: $page
        ) {
            requests {
            id title type poster
            created status description
            }
            pages
          }
        request(id: $selectedId) @include (if: $hasSelection) {
          id description
        }
      }`;


    const data = await graphQLFetch(query, vars, showError);
    // TODO: Link up to new MongoDB for Products. Hold for #Iter2
    // Note: Next line is just so that old issueTracker data stops appearing
    // data = { requestList: { requests: [], pages: 0 } };
    return data;
  }

  constructor() {
    super();
    const initialData = store.initialData || { requestList: {} };
    const {
      requestList: { requests, pages }, request: selectedRequest,
    } = initialData;
    delete store.initialData;
    this.state = {
      requests,
      selectedRequest,
      pages,
    };
    this.closeRequest = this.closeRequest.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
  }

  componentDidMount() {
    const { reqeusts } = this.state;
    if (reqeusts == null) this.loadData();
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
    const data = await RequestList.fetchData(match, search, showError);
    if (data) {
      this.setState({
        requests: data.requestList.requests,
        selectedRequest: data.request,
        pages: data.requestList.pages,
      });
    }
  }

  async closeRequest(index) {
    // TODO: Update query
    const query = `mutation requestClose($id: Int!) {
      requestUpdate(id: $id, changes: {status: Unlisted}) {
        id title status poster
        created description type
      }
    }`;
    const { requests } = this.state;
    const { showError } = this.props;
    const data = await graphQLFetch(query, { id: requests[index].id }, showError);
    if (data) {
      this.setState((prevState) => {
        const newList = [...prevState.requests];
        // TODO: update to requestUpdate when GraphQL is updated in #Iter2
        newList[index] = data.requestUpdate;
        return { requests: newList };
      });
    } else {
      this.loadData();
    }
  }

  async deleteRequest(index) {
    // TODO: Update query
    const query = `mutation requestDelete($id: Int!) {
      requestDelete(id: $id)
    }`;
    const { requests } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { id } = requests[index];
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { id }, showError);
    // TODO: Update to requestDelete when GraphQL is updated in #Iter2
    if (data && data.requestDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.requests];
        if (pathname === `/requests/${id}`) {
          history.push({ pathname: '/requests', search });
        }
        newList.splice(index, 1);
        const undoMessage = (
          <span>
            {`Deleted request ${id} successfully.`}
            <Button bsStyle="link" onClick={() => this.restoreRequest(id)}>
              UNDO
            </Button>
          </span>
        );
        showSuccess(undoMessage);
        return { requests: newList };
      });
    } else {
      this.loadData();
    }
  }

  async restoreRequest(id) {
    // TODO: Update query in #Iter2
    const query = `mutation requestRestore($id: Int!) {
      requestRestore(id: $id)
    }`;
    const { showSuccess, showError } = this.props;
    const data = await graphQLFetch(query, { id }, showError);
    if (data) { showSuccess(`Request ${id} restored successfully.`); }
    this.loadData();
  }

  render() {
    const { requests } = this.state;
    if (requests == null) return null;
    const { selectedRequest, pages } = this.state;
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
            <ListFilter urlBase="/requests" />
          </Panel.Body>
        </Panel>
        <RequestTable
          requests={requests}
          closeRequest={this.closeRequest}
          deleteRequest={this.deleteRequest}
        />
        <ItemDetail item={selectedRequest} />
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

const RequestListWithToast = withToast(RequestList);
RequestListWithToast.fetchData = RequestList.fetchData;
export default RequestListWithToast;
