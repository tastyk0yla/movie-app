import { Offline, Online } from 'react-detect-offline'
import { Component, Fragment } from 'react'
import { Alert, Spin, Input, Tabs, Pagination } from 'antd'
import debounce from 'lodash.debounce'

import './App.css'

import CardList from '../CardList'
import apiService from '../apiService'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      query: '',
      items: [],
      totalItems: 0,
      isLoading: true,
      isError: false,
      error: null,
    }
  }
  api = new apiService()

  getItems = (query, page = 1) => {
    if (!query) return
    this.setState({ query, isLoading: true, isError: false })
    this.api
      .searchMovies(query, page)
      .then((res) => {
        if (res.total_results === 0) throw new Error('No results')
        this.setState({ items: res.results, isLoading: false, totalItems: res.total_results })
      })
      .catch((err) => {
        this.onError(err)
      })
  }

  onError = (err) => {
    this.setState({ isLoading: false, isError: true, error: err })
  }
  componentDidMount() {
    this.getItems('return')
  }

  handleSearch = (query, page = 1) => {
    this.getItems(query, page)
  }

  handleSearch_debounced = debounce(this.handleSearch, 500)

  handlePagination = (current) => {
    console.log(this.state.query, current)
    this.getItems(this.state.query, current)
  }

  render() {
    const { isLoading, isError, error, totalItems } = this.state
    const errEl = isError ? (
      <Alert
        style={{ margin: 'auto' }}
        message={error.message}
        showIcon
        description={
          error.message === 'No results'
            ? `We didn't find anything for your request! :( 
            Please change your request and we will try again.`
            : error.stack
        }
        type="error"
      />
    ) : null
    const spinner = isLoading ? <Spin size="large" style={{ margin: 'auto' }} /> : null
    const success = !(isLoading || isError) ? <CardList data={this.state} /> : null

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
            <Tabs centered>
              <Tabs.TabPane tab="Search" key="search">
                <Search
                  totalItems={totalItems}
                  elements={[errEl, spinner, success]}
                  handlers={[this.handleSearch_debounced, this.handlePagination]}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Rated" key="rated">
                Content 2
              </Tabs.TabPane>
            </Tabs>
          </section>
        </Online>
      </Fragment>
    )
  }
}

const Search = (props) => {
  const totalItems = props.totalItems
  console.log(totalItems)
  const [errEl, spinner, success] = props.elements
  const [handleSearch_debounced, handlePagination] = props.handlers
  return (
    <Fragment>
      <Input
        placeholder="Type to search"
        size="large"
        style={{ width: '938px', margin: '20px auto 34px auto' }}
        onChange={(event) => {
          handleSearch_debounced(event.target.value)
        }}
      />
      {errEl}
      {spinner}
      {success}
      <Pagination
        onChange={handlePagination}
        defaultCurrent={1}
        total={totalItems}
        showSizeChanger={false}
        pageSize={20}
      />
    </Fragment>
  )
}
