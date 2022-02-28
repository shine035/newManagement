import React from 'react'
import { Form, Row, Col, Select } from 'antd'
import PropTypes from 'prop-types'

// Styled Component
import { SystemAdvanceSearchFileAndDocWrapper } from '../styled/generalStatistic'

const { Option } = Select

function SystemAdvanceSearch({ conditionSearch, handleEasySearch }) {
  const [form] = Form.useForm()

  return (
    <SystemAdvanceSearchFileAndDocWrapper>
      <Form
        name="basic"
        layout="horizontal"
        initialValues={conditionSearch}
        form={form}
        labelAlign="left"
        onValuesChange={(changedValues, allValues) => handleEasySearch(allValues)}
      >
        <Row justify="start" gutter="16">
          <Col style={{ padding: 8, margin: 0 }} span={4}>
            <Form.Item name="DateType">
              <Select getPopupContainer={trigger => trigger.parentNode}>
                <Option value={1}>Hôm qua</Option>
                <Option value={2}>Hôm nay</Option>
                <Option value={3}>Tuần này</Option>
                <Option value={4}>Tháng này</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ padding: 8, margin: 0 }} span={4}>
            <Form.Item name="SystemType">
              <Select getPopupContainer={trigger => trigger.parentNode}>
                <Option value={0}>Hệ Thống</Option>
                <Option value={1}>HTTL</Option>
                <Option value={2}>Egov</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </SystemAdvanceSearchFileAndDocWrapper>
  )
}

SystemAdvanceSearch.propTypes = {
  conditionSearch: PropTypes.object,
  handleEasySearch: PropTypes.func
}

export default SystemAdvanceSearch
