import React from 'react'
import PropTypes from 'prop-types'
import { Row, Input, Col, Tooltip, Button } from 'antd'
import { SearchOutlined, FilterFilled } from '@ant-design/icons'
import { SearchEasyWrapper } from './styled/SystemEasySearchWrapper'

const { Search } = Input

function SystemEasySearch(props) {
  const { typeSearch, handleChangeTypeSearch, placeholder, handleChangeEasySearch } = props
  return (
    <SearchEasyWrapper>
      <Row justify="space-between" className="mb-0">
        <Col flex="1 1 auto" className="mr-2">
          <Search
            placeholder={placeholder || 'Tìm kiếm nhanh'}
            onSearch={value => handleChangeEasySearch(value)}
            enterButton={<SearchOutlined style={{ fontSize: '24px' }} />}
          />
        </Col>
        <Tooltip title="" color="#2a2a2a" placement="left">
          <Button
            type="primary"
            className="d-flex"
            icon={<FilterFilled style={{ fontSize: '20px' }} />}
            onClick={() => handleChangeTypeSearch(!typeSearch)}
          >
            Mở bộ lọc nâng cao
          </Button>
        </Tooltip>
      </Row>
    </SearchEasyWrapper>
  )
}

SystemEasySearch.propTypes = {
  typeSearch: PropTypes.bool,
  handleChangeTypeSearch: PropTypes.func,
  handleChangeEasySearch: PropTypes.func,
  placeholder: PropTypes.string
}

export default SystemEasySearch
