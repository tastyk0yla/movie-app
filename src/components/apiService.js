export default class apiService {
  _API_KEY = '63175e6553ce17b3d9f9992902999c9b'
  _API_BASE = 'https://api.themoviedb.org/3'

  async fetchHandler(path, query, page = 1) {
    const res = await fetch(`${this._API_BASE}${path}?api_key=${this._API_KEY}&query=${query}&page=${page}`)

    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status} code`)
    }

    return await res.json()
  }

  async searchMovies(query, page = 1) {
    const PATH = '/search/movie'
    return await this.fetchHandler(PATH, query, page)
  }
}
