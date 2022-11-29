import { Component, Fragment } from 'react'
import { Alert, Pagination, Spin } from 'antd'

import CardList from '../CardList'

export default class Rated extends Component {
  componentDidMount() {
    const { page } = this.props.stateObj
    this.props.getRated(this.props.sessId, page)
  }
  render() {
    const { items, totalItems, isLoading, isError, error, page } = this.props.stateObj
    const { sessId, rateMovie, getRated } = this.props
    const errEl = isError ? (
      <Alert
        style={{ margin: 'auto' }}
        message={error.message}
        showIcon
        description={
          error.message === 'No results' ? (
            <Fragment>
              <p>{'We didnt find any rated movie :('}</p>
              <p>{'Please, rate something and try again!'}</p>
            </Fragment>
          ) : (
            error.stack
          )
        }
        type="error"
      />
    ) : null
    const spinner = isLoading ? <Spin size="large" style={{ margin: 'auto' }} /> : null
    const success = !(isLoading || isError) ? <CardList items={items} sessId={sessId} rateMovie={rateMovie} /> : null

    return (
      <Fragment>
        {errEl}
        {spinner}
        {success}
        <Pagination
          onChange={(current) => {
            getRated(sessId, current)
          }}
          defaultCurrent={page}
          total={totalItems}
          showSizeChanger={false}
          pageSize={20}
        />
      </Fragment>
    )
  }
}
// const Rated = (props) => {

// }
// export default Rated
