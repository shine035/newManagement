import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select } from 'antd'

import Icon from 'src/components/Icon/Icon'
import { SystemAdvanceSearchWrapper, ButtonCloseAdvanceSearch } from '../styled/StorageUnitManagement'

const { Option } = Select

function SystemAdvanceSearch({ onClickCloseAdvanceSearch }) {
  const handleChange = () => {}

  return (
    <SystemAdvanceSearchWrapper>
      <Form name="basic" layout="vertical" initialValues={{ remember: true }}>
        <Row justify="start" gutter="16">
          <Col span={4}>
            <Form.Item label="Trạng thái" name="storage_unit" initialValue={1}>
              <Select onChange={handleChange} getPopupContainer={trigger => trigger.parentNode}>
                <Option value={0}>Tất cả</Option>
                <Option value={1}>Đang sử dụng</Option>
                <Option value={2}>Đã xóa</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <ButtonCloseAdvanceSearch onClick={() => onClickCloseAdvanceSearch()}>
        <Icon name="close" size={24} color="#ef4444" />
      </ButtonCloseAdvanceSearch>
    </SystemAdvanceSearchWrapper>
  )
}

SystemAdvanceSearch.propTypes = {
  onClickCloseAdvanceSearch: PropTypes.func
}

export default SystemAdvanceSearch
