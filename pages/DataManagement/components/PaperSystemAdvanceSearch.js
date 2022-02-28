import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Form, Row, Col, Select, DatePicker, Input, Tooltip } from 'antd'
import FadeIn from 'react-fade-in'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'

// Component
import ButtonCustom from 'src/components/Button/Button'
import Icon from 'src/components/Icon/Icon'

// Helpers
import { localeVN, dateFormat } from 'src/helpers/FomatDateTime'

// Styled Component
import { SystemAdvanceSearchWrapper, SearchEasyWrapper } from '../styled/DataManagementWrapper'

const { Option } = Select
const { Search } = Input
function PaperSystemAdvanceSearch({ conditionSearch, handleChangeEasySearch, handleChangeAdvanceSearch }) {
  const [form] = Form.useForm()
  const { documentTypes, nationalAssembly, congressMeeting, meeting, syncStatus, securityLevel } = useSelector(
    state => state.common
  )
  const [isShowAdvanceSearch, setIsShowAdvanceSearch] = useState(false)
  const [isChangeAdvanceSearch, setIsChangeAdvanceSearch] = useState(false)

  const disabledStartDate = current => {
    return current && current > moment(form.getFieldValue('IssuedDateTo')).endOf('day')
  }

  const disabledEndDate = current => {
    return current && current < moment(form.getFieldValue('IssuedDateFrom')).endOf('day')
  }

  useEffect(() => {
    if (!isShowAdvanceSearch && isChangeAdvanceSearch) {
      form.setFieldsValue({
        ...conditionSearch,
        NationalAssembly: 0,
        CongressMeeting: 0,
        Meeting: 0,
        TypeName: '',
        SecurityLevel: 0,
        Mode: 0,
        IssuedDateFrom: '',
        IssuedDateTo: ''
      })
      setIsChangeAdvanceSearch(false)
      handleChangeAdvanceSearch(form.getFieldsValue(true))
    }
  }, [isShowAdvanceSearch])

  return (
    <SystemAdvanceSearchWrapper>
      <SearchEasyWrapper>
        <Row justify="space-between" className="mb-0">
          <Col flex="1 1 auto" className="mr-2">
            <Search
              defaultValue={conditionSearch.TextSearch}
              placeholder="Mã định danh văn bản, Số và ký hiệu, Tiêu đề, Trích yếu nội dung, Ghi chú, Từ khóa, Bút tích, Ký hiệu thông tin, Số văn bản, Đơn vị soạn thảo"
              enterButton={<SearchOutlined style={{ fontSize: '24px' }} />}
              onSearch={value => handleChangeEasySearch(value)}
            />
          </Col>
          <Tooltip title="" color="#2a2a2a" placement="left">
            <ButtonCustom
              text={!isShowAdvanceSearch ? 'Mở bộ lọc nâng cao' : 'Đóng bộ lọc nâng cao'}
              type="primary"
              size={15}
              color="var(--color-primary)"
              icon={
                <Icon name={!isShowAdvanceSearch ? 'filter_alt' : 'keyboard_arrow_up'} size={20} className="mx-auto" />
              }
              onClick={() => setIsShowAdvanceSearch(!isShowAdvanceSearch)}
            />
          </Tooltip>
        </Row>
      </SearchEasyWrapper>
      <Form
        name="basic"
        layout="vertical"
        form={form}
        initialValues={conditionSearch}
        onValuesChange={(changedValues, allValues) => {
          setIsChangeAdvanceSearch(true)
          handleChangeAdvanceSearch(allValues)
        }}
      >
        {isShowAdvanceSearch && (
          <FadeIn>
            <Row justify="start" gutter="16">
              <Col span={4}>
                <Form.Item label="Quộc hội khóa" name="NationalAssembly">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option key={0} value={0}>
                      Tất cả
                    </Option>
                    {!!nationalAssembly &&
                      !!nationalAssembly.length &&
                      nationalAssembly.map(item => (
                        <Option key={Number(item.CodeValue)} value={Number(item.CodeValue)}>
                          {item.Text}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item label="Kỳ họp thứ" name="CongressMeeting">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option key={0} value={0}>
                      Tất cả
                    </Option>
                    {!!congressMeeting &&
                      !!congressMeeting.length &&
                      congressMeeting.map(item => (
                        <Option key={Number(item.CodeValue)} value={Number(item.CodeValue)}>
                          {item.Text}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Phiên họp" name="Meeting">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option key={0} value={0}>
                      Tất cả
                    </Option>
                    {!!meeting &&
                      !!meeting.length &&
                      meeting.map(item => (
                        <Option key={Number(item.CodeValue)} value={Number(item.CodeValue)}>
                          {item.Text}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Loại văn bản" name="TypeName">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option key={0} value="">
                      Tất cả
                    </Option>
                    {!!documentTypes &&
                      !!documentTypes.length &&
                      documentTypes.map(item => (
                        <Option key={Number(item.CodeValue)} value={Number(item.CodeValue)}>
                          {item.Text}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Độ bảo mật" name="SecurityLevel">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option key={0} value={0}>
                      Tất cả
                    </Option>
                    {!!securityLevel &&
                      !!securityLevel.length &&
                      securityLevel.map(item => (
                        <Option key={Number(item.CodeValue)} value={Number(item?.CodeValue)}>
                          {item?.Text}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Chế độ sử dụng" name="Mode">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={0}>Tất cả</Option>
                    <Option value={1}>Hạn chế</Option>
                    <Option value={2}>Không hạn chế</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={4}>
                <Form.Item label="Ngày VB từ" name="IssuedDateFrom">
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
                <Form.Item label="Đến" name="IssuedDateTo">
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
              <Col span={4}>
                <Form.Item label="Trạng thái" name="DocStatus">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={0}>Tất cả</Option>
                    {!!syncStatus &&
                      !!syncStatus.length &&
                      syncStatus.map(item => (
                        <Option key={Number(item.CodeValue)} value={Number(item.CodeValue)}>
                          {item.Text}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </FadeIn>
        )}
      </Form>
    </SystemAdvanceSearchWrapper>
  )
}

PaperSystemAdvanceSearch.propTypes = {
  conditionSearch: PropTypes.object,
  handleChangeEasySearch: PropTypes.func,
  handleChangeAdvanceSearch: PropTypes.func
}

export default PaperSystemAdvanceSearch
