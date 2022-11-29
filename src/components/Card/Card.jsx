import { Component } from 'react'
import { Rate } from 'antd'
import { parseISO, format } from 'date-fns'

import './Card.css'

import { GenresConsumer } from '../Context'

export default class Card extends Component {
  makeItShort = (string, desiredLength) => {
    if (string.length < desiredLength) return string
    const arr = string.split(' ')
    let res = ''
    for (let i = 0; i < arr.length; i++) {
      if (res.length + arr[i].length >= desiredLength) break
      res += arr[i] + ' '
    }
    if (res[res.length - 1] === ' ') {
      res = res.slice(-0, res.length - 1) + '..'
    } else res += '..'
    return res
  }

  fixNumber = (number) => {
    return Math.trunc(number * 10) / 10
  }

  render() {
    return (
      <GenresConsumer>
        {(genres) => {
          const { poster, title, about, release, rating, sessId, rateMovie, movieId, movieGenres } = this.props
          const titleShorted = this.makeItShort(title, 20)
          const aboutShorted = this.makeItShort(about, movieGenres.length > 5 ? 120 : 180)
          let borderColor = ''
          const avgRating = this.fixNumber(rating)
          if (rating < 3) borderColor = '#E90000'
          if (rating > 3 && rating < 5) borderColor = '#E97E00'
          if (rating > 5 && rating < 7) borderColor = '#E9D100'
          if (rating > 7) borderColor = '#66E900'
          const rated = JSON.parse(localStorage.getItem(sessId))
          {
            if (genres.length > 0) genres = Object.fromEntries(genres.map((n) => [n.id, n.name]))
            const genresList = movieGenres.reduce((acc, id, index) => {
              if (index > 2) return acc

              if (index === 2) {
                acc.push(
                  <li className="genre-list--item" key={id * Math.random() * 10}>
                    <span>{`And ${movieGenres.length - index} more genres`}</span>
                  </li>
                )
                return acc
              }

              acc.push(
                <li className="genre-list--item" key={id * Math.random() * 10}>
                  <span>{genres[id]}</span>
                </li>
              )
              return acc
            }, [])

            return (
              <li className="card">
                <img
                  className="card-image--big"
                  src={`https://image.tmdb.org/t/p/original${poster}`}
                  alt={` ${title} poster`}
                />
                <div className="card-content">
                  <div className="card-header">
                    <img
                      className="card-image--small"
                      src={`https://image.tmdb.org/t/p/original${poster}`}
                      alt={` ${title} poster`}
                    />
                    <div className="card-header-content">
                      <h2 className="card--title">{titleShorted}</h2>
                      <div className="card--rating" style={{ border: `2px solid ${borderColor}` }}>
                        <span>{avgRating}</span>
                      </div>
                      {release ? <p className="card--date">{format(parseISO(release), 'LLLL d, yyyy')}</p> : null}
                      <ul className="card--genre-list">{genresList}</ul>
                    </div>
                  </div>
                  <div className="card-main-content">
                    <p className="card--about">{aboutShorted}</p>
                    <Rate
                      allowHalf
                      count={10}
                      defaultValue={rated ? rated[movieId] || 0 : 0}
                      onChange={(value) => {
                        rateMovie(value, sessId, movieId)
                      }}
                    />
                  </div>
                </div>
              </li>
            )
          }
        }}
      </GenresConsumer>
    )
  }
}
