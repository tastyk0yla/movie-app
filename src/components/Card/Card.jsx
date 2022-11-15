import { Component } from 'react'
import { parseISO, format } from 'date-fns'

import './Card.css'

export default class Card extends Component {
  makeItShort = (string) => {
    const desiredLength = 160
    if (string.length < desiredLength) return string
    const arr = string.split(' ')
    let res = ''
    for (let i = 0; i < arr.length; i++) {
      if (res.length + arr[i].length >= desiredLength) break
      res += arr[i] + ' '
    }
    if (res[res.length - 1] === ' ') {
      res = res.slice(-0, res.length - 1) + '...'
    } else res += '...'
    return res
  }

  render() {
    const { poster, title, about, release } = this.props
    const overview = this.makeItShort(about)
    return (
      <li className="card">
        <img src={`https://image.tmdb.org/t/p/original${poster}`} alt={` ${title} poster`} />
        <div className="card-content">
          <h2 className="card--title">{title}</h2>
          {release ? <p className="card--date">{format(parseISO(release), 'LLLL d, yyyy')}</p> : null}
          <ul className="card--genre-list">
            <li className="genre-list--item">
              <p>Action</p>
            </li>
            <li className="genre-list--item">
              <p>Drama</p>
            </li>
          </ul>
          <p className="card--about">{overview}</p>
        </div>
      </li>
    )
  }
}
