import React from 'react';
import store from './store.js';
import graphQLFetch from './graphQLFetch.js';

export default class About extends React.Component {
  static async fetchData() {
    let data = await graphQLFetch('query {about}');
    data = { about: 'CannaBridge API v0.9' };
    return data;
  }

  constructor(props) {
    super(props);
    const apiAbout = store.initialData ? store.initialData.about : null;
    delete store.initialData;
    this.state = { apiAbout };
  }

  async componentDidMount() {
    const { apiAbout } = this.state;
    if (apiAbout == null) {
      const data = await About.fetchData();
      this.setState({ apiAbout: data.about });
    }
  }

  render() {
    const { apiAbout } = this.state;
    return (
      <div className="text-center">
        <h3>CannaBridge UI v0.9</h3>
        <h4>{apiAbout}</h4>
      </div>
    );
  }
}
