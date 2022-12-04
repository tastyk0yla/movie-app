import Card from '../Card'

import './CardList.css'

const CardList = (props) => {
  const { sessionId, items, rateMovie } = props
  const List = items.reduce(
    (acc, item) => {
      acc.push(
        <Card
          key={item.id}
          sessionId={sessionId}
          poster={item.poster_path}
          title={item.original_title}
          about={item.overview}
          release={item.release_date}
          rating={item.vote_average}
          rateMovie={rateMovie}
          movieId={item.id}
          movieGenres={item.genre_ids}
        />
      )
      return acc
    },
    [[]]
  )

  return <ul className="card-list">{List}</ul>
}

export default CardList
