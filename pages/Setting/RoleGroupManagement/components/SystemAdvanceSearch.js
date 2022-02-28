import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select, Input } from 'antd'

import { SystemAdvanceSearchWrapper } from '../styled/RoleGroupWrapper'

const { Option } = Select

function SystemAdvanceSearch({ onSearch }) {
  const handleChange = value => {
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <SystemAdvanceSearchWrapper>
      <Form
        name="basic"
        layout="vertical"
        initialValues={{ RoleGroupName: '', StatusID: 1 }}
        onValuesChange={(changedValues, allValues) => handleChange(allValues)}
      >
        <Row justify="start" gutter="16">
          <Col span={18}>
            <Form.Item label="Tên nhóm quyền" name="RoleGroupName">
              <Input placeholder="Nhập nhóm quyền" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Trạng thái" name="StatusID">
              <Select defaultValue={0} getPopupContainer={trigger => trigger.parentNode}>
                <Option value={0}>Tất cả</Option>
                <Option value={1}>Hoạt động</Option>
                <Option value={2}>Đã xoá</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* <ButtonCloseAdvanceSearch onClick={() => onClickCloseAdvanceSearch()}>
        <Icon name="close" size={24} color="#ef4444" />
      </ButtonCloseAdvanceSearch> */}
    </SystemAdvanceSearchWrapper>
  )
}

SystemAdvanceSearch.propTypes = {
  onSearch: PropTypes.func
}

export default SystemAdvanceSearch
