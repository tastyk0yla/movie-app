import { Fragment } from 'react'
import { Alert, Input, Pagination, Spin } from 'antd'

import './Search.css'

import CardList from '../CardList'

const Search = (props) => {
  const { sessionId, rateMovie, searchHandlerDebounced, getItems } = props
  const { query, items, totalItems, isLoading, isError, error, page } = props.stateObj
  const errorElement = isError ? (
    <Alert
      style={{ margin: 'auto' }}
      message={error.message}
      showIcon
      description={
        error.message === 'No results' ? (
          <Fragment>
            <p>{'We didnt find anything for your request! :('}</p>
            <p>{'Please, change your request and we will try again.'}</p>
          </Fragment>
        ) : (
          error.stack
        )
      }
      type="error"
    />
  ) : null
  const spinner = isLoading ? <Spin size="large" style={{ margin: 'auto' }} /> : null
  const success = !(isLoading || isError) ? (
    <CardList items={items} sessionId={sessionId} rateMovie={rateMovie} />
  ) : null

  return (
    <Fragment>
      <Input
        className="search-input"
        defaultValue={query}
        placeholder="Type to search"
        onChange={(event) => {
          searchHandlerDebounced(event.target.value)
        }}
      />
      {errorElement}
      {spinner}
      {success}
      <Pagination
        onChange={(current) => {
          getItems(query, current)
        }}
        defaultCurrent={page}
        total={totalItems}
        showSizeChanger={false}
        pageSize={20}
      />
    </Fragment>
  )
}

export default Search
