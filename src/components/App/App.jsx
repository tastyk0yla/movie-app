import { Offline, Online } from 'react-detect-offline'
import { Component, Fragment } from 'react'
import { Alert, Tabs } from 'antd'
import debounce from 'lodash.debounce'

import './App.css'

import { GenresProvider } from '../../context/genre.context'
import Search from '../Search'
import Rated from '../Rated'
import apiService from '../../services'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      sessionId: '',
      genres: [],
      search: {
        query: '',
        items: [],
        totalItems: 0,
        isLoading: false,
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
      .then((response) => {
        if (response.total_results === 0) throw new Error('No results')
        this.setState({
          search: { query, items: response.results, isLoading: false, totalItems: response.total_results, page },
        })
      })
      .catch((err) => {
        this.setState({ search: { isLoading: false, isError: true, error: err } })
      })
  }

  searchHandlerDebounced = debounce(this.getItems, 500)

  getRated = (sessionId, page = 1) => {
    this.setState({ isLoading: true, isError: false })
    this.api
      .getRatedMovies(sessionId, page)
      .then((response) => {
        if (response.total_results === 0) throw new Error('No results')
        this.setState({
          rated: {
            items: response.results,
            totalItems: response.total_results,
            isLoading: false,
            isError: false,
            page,
          },
        })
      })
      .catch((err) => {
        this.setState({ rated: { isLoading: false, isError: true, error: err } })
      })
  }

  componentDidMount() {
    try {
      const sessionId = localStorage.getItem('sessionId')
      if (sessionId === null) throw new Error()
      this.setState({ sessionId })
      this.getRated(sessionId)
    } catch {
      this.api.createGuestSession().then((response) => {
        this.setState({ sessionId: response.guest_session_id })
        localStorage.setItem('sessionId', response.guest_session_id)
        this.getRated(response.guest_session_id)
      })
    } finally {
      this.api
        .getGenres()
        .then((response) => {
          this.setState({ genres: response.genres })
        })
        .catch()
    }
  }

  rateMovie = async (value, movieId) => {
    const sessionId = this.state.sessionId
    const body = { value }
    await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.api._API_KEY}&guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
      }
    )
    let fromStorage = JSON.parse(localStorage.getItem(sessionId)) || {}
    fromStorage[movieId] = value
    localStorage.setItem(sessionId, JSON.stringify(fromStorage))
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
                        sessionId={this.state.sessionId}
                        rateMovie={this.rateMovie}
                        searchHandlerDebounced={this.searchHandlerDebounced}
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
                        sessionId={this.state.sessionId}
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
