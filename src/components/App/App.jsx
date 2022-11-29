import { Offline, Online } from 'react-detect-offline'
import { Component, Fragment } from 'react'
import { Alert, Tabs } from 'antd'
import debounce from 'lodash.debounce'

import './App.css'

import { GenresProvider } from '../Context'
import Search from '../Search'
import Rated from '../Rated'
import apiService from '../apiService'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      sessId: '',
      genres: [],
      search: {
        query: '',
        items: [],
        totalItems: 0,
        isLoading: true,
        isError: false,
        error: null,
        page: 1,
      },
      rated: {
        items: [],
        totalItems: 0,
        isLoading: true,
        isError: false,
        error: null,
        page: 1,
      },
    }
  }
  api = new apiService()

  getItems = (query, page = 1) => {
    if (!query) return
    this.setState({ search: { isLoading: true, isError: false } })
    this.api
      .searchMovies(query, page)
      .then((res) => {
        if (res.total_results === 0) throw new Error('No results')
        this.setState({ search: { query, items: res.results, isLoading: false, totalItems: res.total_results, page } })
      })
      .catch((err) => {
        this.setState({ search: { isLoading: false, isError: true, error: err } })
      })
  }

  handleSearch_debounced = debounce(this.getItems, 500)

  getRated = (sessId, page = 1) => {
    this.setState({ isLoading: true, isError: false })
    this.api
      .getRatedMovies(sessId, page)
      .then((res) => {
        if (res.total_results === 0) throw new Error('No results')
        this.setState({
          rated: { items: res.results, totalItems: res.total_results, isLoading: false, isError: false, page },
        })
      })
      .catch((err) => {
        this.setState({ rated: { isLoading: false, isError: true, error: err } })
      })
  }

  componentDidMount() {
    try {
      const sessId = localStorage.getItem('sessId')
      if (sessId === null) throw new Error()
      this.setState({ sessId })
      this.getRated(sessId)
    } catch {
      this.api.createGuestSession().then((res) => {
        this.setState({ sessId: res.guest_session_id })
        localStorage.setItem('sessId', res.guest_session_id)
        this.getRated(res.guest_session_id)
      })
    } finally {
      this.api
        .getGenres()
        .then((res) => {
          this.setState({ genres: res.genres })
        })
        .catch()
      this.getItems('return')
    }
  }

  rateMovie = async (value, sessId, movieId) => {
    const body = { value }
    await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.api._API_KEY}&guest_session_id=${sessId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
      }
    )
    let fromStorage = JSON.parse(localStorage.getItem(sessId)) || {}
    fromStorage[movieId] = value
    localStorage.setItem(sessId, JSON.stringify(fromStorage))
  }

  render() {
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
          <GenresProvider value={this.state.genres}>
            <section className="app">
              <Tabs
                destroyInactiveTabPane
                centered
                defaultActiveKey="1"
                items={[
                  {
                    label: 'Search',
                    key: '1',
                    children: (
                      <Search
                        stateObj={this.state.search}
                        sessId={this.state.sessId}
                        rateMovie={this.rateMovie}
                        handleSearch_debounced={this.handleSearch_debounced}
                        getItems={this.getItems}
                      />
                    ),
                  },
                  {
                    label: 'Rated',
                    key: '2',
                    children: (
                      <Rated
                        stateObj={this.state.rated}
                        sessId={this.state.sessId}
                        rateMovie={this.rateMovie}
                        getRated={this.getRated}
                      />
                    ),
                  },
                ]}
              />
            </section>
          </GenresProvider>
        </Online>
      </Fragment>
    )
  }
}
