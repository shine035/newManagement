import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, DatePicker, Input, Tooltip, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'

// Helpers
import { localeVN, dateFormat } from 'src/helpers/FomatDateTime'

// Style
import { SystemAdvanceSearchWrapper, SearchEasyWrapper } from '../../styled/DataManagementWrapper'

const { Option } = Select
const { Search } = Input
function SystemAdvanceSearch({ handleChangeSearch, conditionSearch }) {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ ...conditionSearch })
  }, [conditionSearch])

  const handleChange = allValues => {
    handleChangeSearch({ ...conditionSearch, ...allValues })
  }

  const disabledStartDate = current => {
    return current && current > moment(form.getFieldValue('EndDate')).endOf('day')
  }

  const disabledEndDate = current => {
    return current && current < moment(form.getFieldValue('StartDate')).endOf('day')
  }

  return (
    <SystemAdvanceSearchWrapper>
      <SearchEasyWrapper>
        <Form
          className="pd-top-10"
          name="basic"
          form={form}
          layout="horizontal"
          initialValues={conditionSearch}
          onValuesChange={(changedValues, allValues) => {
            handleChange(allValues)
          }}
        >
          <Row justify="start" gutter="16">
            <Col span={11}>
              <Form.Item name="TextSearch">
                <Search
                  placeholder="Mã phiếu, Nội dung/Tiêu đề Hồ sơ, Tài liệu, Đơn vị/Cá nhân giao/nhận"
                  enterButton={<SearchOutlined style={{ fontSize: '24px' }} />}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Loại tài liệu" name="Type">
                <Select showArrow getPopupContainer={trigger => trigger.parentNode}>
                  <Option value={1}>
                    <Tooltip title="Tài liệu giấy">Giao nhận và nhập kho</Tooltip>
                  </Option>
                  <Option value={2}>
                    <Tooltip title="Tài liệu phim(âm bản)/ảnh">Xuất kho</Tooltip>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Thời gian giao nộp" name="StartDate">
                <DatePicker
                  getPopupContainer={trigger => trigger.parentNode}
                  style={{ width: '100%' }}
                  locale={localeVN}
                  format={dateFormat}
                  inputReadOnly
                  disabledDate={disabledStartDate}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Đến" name="EndDate">
                <DatePicker
                  getPopupContainer={trigger => trigger.parentNode}
                  style={{ width: '100%' }}
                  locale={localeVN}
                  format={dateFormat}
                  inputReadOnly
                  disabledDate={disabledEndDate}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </SearchEasyWrapper>
    </SystemAdvanceSearchWrapper>
  )
}

SystemAdvanceSearch.propTypes = {
  conditionSearch: PropTypes.object,
  handleChangeSearch: PropTypes.func
}

export default SystemAdvanceSearch
