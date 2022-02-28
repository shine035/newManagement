import { Pagination } from 'antd'
import React from 'react'

import PropTypes from 'prop-types'

const MyPagination = props => {
  const { total, handleChangePage, current, pageSize } = props
  return (
    <Pagination simple onChange={page => handleChangePage(page)} total={total} current={current} pageSize={pageSize} />
  )
}

MyPagination.propTypes = {
  total: PropTypes.number,
  handleChangePage: PropTypes.func,
  current: PropTypes.number,
  pageSize: PropTypes.number
}

export default MyPagination
