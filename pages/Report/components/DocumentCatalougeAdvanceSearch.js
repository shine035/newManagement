import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select, DatePicker } from 'antd'
import { useSelector } from 'react-redux'
import moment from 'moment'

// Helpers
import { localeVN, dateFormat } from 'src/helpers/FomatDateTime'

// Style
import { DocumentCatalougeAdvanceSearchWrapper } from '../styled/DocumentCatalougeWrapper'

const { Option } = Select
function DocumentCatalougeAdvanceSearch({ handleChangeAdvanceSearch, conditionSearch }) {
  const [form] = Form.useForm()
  const { nationalAssembly, congressMeeting, meeting, securityLevel, syncStatus } = useSelector(state => state.common)
  const [listNationalAssemblyTo, setListNationalAssemblyTo] = useState(nationalAssembly)
  const [listCongressMeetingTo, setListCongressMeetingTo] = useState(congressMeeting)
  const [listMeetingTo, setListMeetingTo] = useState(meeting)

  const handleChange = value => {
    if (value.NationalAssemblyFrom) {
      setListNationalAssemblyTo(
        nationalAssembly.filter(item => Number(item.CodeValue) > Number(form.getFieldValue('NationalAssemblyFrom')))
      )
    }
    if (value.CongressMeetingFrom) {
      setListCongressMeetingTo(
        congressMeeting.filter(item => Number(item.CodeValue) > Number(form.getFieldValue('CongressMeetingFrom')))
      )
    }
    if (value.MeetingFrom) {
      setListMeetingTo(meeting.filter(item => Number(item.CodeValue) > Number(form.getFieldValue('MeetingFrom'))))
    }
    const bodySearch = { ...conditionSearch, ...value }
    handleChangeAdvanceSearch(bodySearch)
  }

  const disabledStartDate = current => {
    return current && current > moment(form.getFieldValue('EndDate')).endOf('day')
  }

  const disabledEndDate = current => {
    return current && current < moment(form.getFieldValue('StartDate')).endOf('day')
  }

  return (
    <DocumentCatalougeAdvanceSearchWrapper>
      <Form
        name="basic"
        form={form}
        layout="vertical"
        initialValues={conditionSearch}
        onValuesChange={(changedValues, allValues) => handleChange(allValues)}
      >
        <Row justify="start" gutter="16">
          <Col span={4}>
            <Form.Item label="Loại tài liệu:" name="DataType">
              <Select getPopupContainer={trigger => trigger.parentNode} defaultValue={1}>
                <Option value={1}>Tài liệu giấy</Option>
                <Option value={2}>Tài liệu phim ảnh</Option>
                <Option value={3}>Tài liệu phim âm thanh</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="QHK: " name="NationalAssemblyFrom">
              <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                <Option value={null}>Tất cả</Option>
                {nationalAssembly &&
                  nationalAssembly.length &&
                  nationalAssembly.map((item, idx) => (
                    <Option key={idx} value={Number(item.CodeValue)}>
                      Khóa {item.Text}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Đến: " name="NationalAssemblyTo">
              <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                <Option value={null}>Tất cả</Option>
                {listNationalAssemblyTo &&
                  listNationalAssemblyTo.length &&
                  listNationalAssemblyTo.map((item, idx) => (
                    <Option key={idx} value={Number(item.CodeValue)}>
                      Khóa {item.Text}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Kỳ họp thứ: " name="CongressMeetingFrom">
              <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                <Option value={null}>Tất cả</Option>
                {congressMeeting &&
                  congressMeeting.length &&
                  congressMeeting.map((item, idx) => (
                    <Option key={idx} value={Number(item.CodeValue)}>
                      Kỳ họp thứ {item.Text}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Đến:" name="CongressMeetingTo">
              <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                <Option value={null}>Tất cả</Option>
                {listCongressMeetingTo &&
                  listCongressMeetingTo.length &&
                  listCongressMeetingTo.map((item, idx) => (
                    <Option key={idx} value={Number(item.CodeValue)}>
                      Kỳ họp thứ {item.Text}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4} />
          <Col span={4}>
            <Form.Item label="Phiên họp:" name="MeetingFrom">
              <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                <Option value={null}>Tất cả</Option>
                {meeting &&
                  meeting.length &&
                  meeting.map((item, idx) => (
                    <Option key={idx} value={Number(item.CodeValue)}>
                      Phiên họp thứ {item.Text}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Đến: " name="MeetingTo">
              <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                <Option value={null}>Tất cả</Option>
                {listMeetingTo &&
                  listMeetingTo.length &&
                  listMeetingTo.map((item, idx) => (
                    <Option key={idx} value={Number(item.CodeValue)}>
                      Phiên họp thứ {item.Text}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Thời gian từ: " name="StartDate">
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
            <Form.Item label="Đến: " name="EndDate">
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
          <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.DataType !== curValues.DataType}>
            {({ getFieldValue }) =>
              getFieldValue('DataType') === 1 ? (
                <>
                  <Col span={4}>
                    <Form.Item label="Độ mật:" name="SecurityLevel">
                      <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                        <Option value={null}>Tất cả</Option>
                        {securityLevel &&
                          securityLevel.length &&
                          securityLevel.map((item, idx) => (
                            <Option key={idx} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Trạng thái:" name="DocStatus">
                      <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                        <Option value={null}>Tất cả</Option>
                        {syncStatus &&
                          syncStatus.length &&
                          syncStatus.map((item, idx) => (
                            <Option key={idx} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </>
              ) : null
            }
          </Form.Item>
        </Row>
      </Form>
    </DocumentCatalougeAdvanceSearchWrapper>
  )
}

DocumentCatalougeAdvanceSearch.propTypes = {
  conditionSearch: PropTypes.object,
  handleChangeAdvanceSearch: PropTypes.func
}

export default DocumentCatalougeAdvanceSearch
