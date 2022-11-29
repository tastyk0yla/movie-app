import Card from '../Card'

import './CardList.css'

const CardList = (props) => {
  const { sessId, items, rateMovie } = props
  const pagesArr = items.reduce(
    (acc, item, i) => {
      const pageIndex = Math.floor(i / 6)
      if (acc[pageIndex] === undefined) acc.push([])
      acc[pageIndex].push(
        <Card
          key={item.id}
          sessId={sessId}
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

  return <ul className="card-list">{pagesArr}</ul>
}

export default CardList
