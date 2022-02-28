import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select, DatePicker, Input, Tooltip } from 'antd'
import FadeIn from 'react-fade-in'
import { SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
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

function PhotoDocumentSystemAdvanceSearch({ conditionSearch, handleChangeEasySearch, handleChangeAdvanceSearch }) {
  const [form] = Form.useForm()
  const { syncStatus } = useSelector(state => state.common)
  const [isShowAdvanceSearch, setIsShowAdvanceSearch] = useState(false)
  const [isChangeAdvanceSearch, setIsChangeAdvanceSearch] = useState(false)

  const disabledStartDate = current => {
    return current && current > moment(form.getFieldValue('PhotoTimeTo')).endOf('day')
  }

  const disabledEndDate = current => {
    return current && current < moment(form.getFieldValue('PhotoTimeFrom')).endOf('day')
  }

  useEffect(() => {
    if (!isShowAdvanceSearch && isChangeAdvanceSearch) {
      form.setFieldsValue({
        ...conditionSearch,
        PhotoTimeFrom: '',
        PhotoTimeTo: '',
        Mode: 0,
        PhotoStatus: 0,
        PageSize: 20,
        CurrentPage: 1
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
              placeholder="Tên sự kiện, Ký hiệu thông tin, Số lưu trữ, Tiêu đề, Tác giả"
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
                <Form.Item label="Thời gian chụp từ" name="PhotoTimeFrom">
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
                <Form.Item label="Đến" name="PhotoTimeTo">
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
                <Form.Item label="Chế độ sử dụng" name="Mode">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={0}>Tất cả</Option>
                    <Option value={1}>Hạn chế</Option>
                    <Option value={2}>Không hạn chế</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Trạng thái" name="PhotoStatus">
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

PhotoDocumentSystemAdvanceSearch.propTypes = {
  conditionSearch: PropTypes.object,
  handleChangeEasySearch: PropTypes.func,
  handleChangeAdvanceSearch: PropTypes.func
}

export default PhotoDocumentSystemAdvanceSearch
