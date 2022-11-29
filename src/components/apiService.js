export default class apiService {
  _API_KEY = '63175e6553ce17b3d9f9992902999c9b'
  _API_BASE = 'https://api.themoviedb.org/3'

  async createGuestSession() {
    const res = await fetch(`${this._API_BASE}/authentication/guest_session/new?api_key=${this._API_KEY}`)
    return res.json()
  }

  async fetchHandler(path, query, page) {
    const res = await fetch(`${this._API_BASE}${path}?api_key=${this._API_KEY}&query=${query}&page=${page}`)

    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status} code`)
    }

    return await res.json()
  }

  async getRatedMovies(sessId, page) {
    const PATH = `/guest_session/${sessId}/rated/movies`
    const res = await fetch(`${this._API_BASE}${PATH}?api_key=${this._API_KEY}&page=${page}`)
    return await res.json()
  }

  async searchMovies(query, page) {
    const PATH = '/search/movie'
    return await this.fetchHandler(PATH, query, page)
  }

  async getGenres() {
    const PATH = '/genre/movie/list'
    const res = await fetch(`${this._API_BASE}${PATH}?api_key=${this._API_KEY}`)
    return await res.json()
  }
}
