import Card from '../Card'

import './CardList.css'

const CardList = (props) => {
  const { data } = props
  const { items } = data
  const pagesArr = items.reduce(
    (acc, item, i) => {
      const pageIndex = Math.floor(i / 6)
      if (acc[pageIndex] === undefined) acc.push([])
      acc[pageIndex].push(
        <Card
          key={i}
          poster={item.poster_path}
          title={item.original_title}
          about={item.overview}
          release={item.release_date}
          stars={item.vote_average}
        />
      )
      return acc
    },
    [[]]
  )

  return <ul className="card-list">{pagesArr}</ul>
}

export default CardList
