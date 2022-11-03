import { Offline, Online } from 'react-detect-offline'
import { Component, Fragment } from 'react'
import { Alert, Spin } from 'antd'

import './App.css'

import CardList from '../CardList'
import apiService from '../apiService'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      page: 1,
      items: [],
      isLoading: true,
      isError: false,
      error: null,
    }
  }
  api = new apiService()

  getItems = () => {
    this.api
      .searchMovies('return')
      .then((res) => {
        this.setState({ items: res.results, isLoading: false })
      })
      .catch((err) => {
        this.onError(err)
      })
  }

  onError = (err) => {
    this.setState({ isLoading: false, isError: true, error: err })
  }
  componentDidMount() {
    this.getItems()
  }

  render() {
    const { isLoading, isError, error } = this.state
    const errEl = isError ? (
      <Alert style={{ margin: 'auto' }} message={error.message} showIcon description={error.stack} type="error" />
    ) : null
    const spinner = isLoading ? <Spin size="large" style={{ margin: 'auto' }} /> : null
    const success = !(isLoading || error) ? <CardList data={this.state} /> : null
    return (
      <Fragment>
        <Offline>
          <Alert
            style={{ margin: 'auto' }}
            message="You are offline"
            showIcon
            description="Check your connection and refresh the page"
            type="error"
          />
        </Offline>
        <Online>
          <section className="app">
            {errEl}
            {spinner}
            {success}
          </section>
        </Online>
      </Fragment>
    )
  }
}
