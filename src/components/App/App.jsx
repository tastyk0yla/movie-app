import { Component } from 'react'

import './App.css'

import CardList from '../CardList'
import apiService from '../apiService'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      page: 1,
      items: [],
    }
  }
  api = new apiService()

  getItems = () => {
    this.api
      .searchMovies('return')
      .then((res) => {
        this.setState({ items: res.results })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  componentDidMount() {
    this.getItems()
  }

  render() {
    return (
      <section className="app">
        <CardList data={this.state} />
      </section>
    )
  }
}
