import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select, DatePicker, Input, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'

// Component
import Icon from 'src/components/Icon/Icon'
import ButtonCustom from 'src/components/Button/Button'

// Helpers
import { localeVN, dateFormat } from 'src/helpers/FomatDateTime'

// style
import { SystemAdvanceSearchWrapper, SearchEasyWrapper } from '../styled/ListTicketWrapper'

const { Option } = Select
const { Search } = Input

function SystemAdvanceSearch({ handleChangeEasySearch, handleChangSearch, conditionSearch }) {
  const { ticketStatus, ticketMiningType } = useSelector(state => state.common)
  const [form] = Form.useForm()

  const [isShowAdvanceSearch, setIsShowAdvanceSearch] = useState(false)
  const [isChangeAdvanceSearch, setIsChangeAdvanceSearch] = useState(false)

  const disabledStartDate = current => {
    return current && current > moment(form.getFieldValue('EndDate')).endOf('day')
  }

  const disabledEndDate = current => {
    return current && current < moment(form.getFieldValue('StartDate')).endOf('day')
  }

  useEffect(() => {
    if (isShowAdvanceSearch) {
      form.setFieldsValue({ ...conditionSearch })
    } else if (isChangeAdvanceSearch) {
      setIsChangeAdvanceSearch(false)
      form.setFieldsValue({
        StartDate: null,
        EndDate: null,
        TicketStatus: 0,
        Type: 0
      })
      handleChangSearch({
        StartDate: null,
        EndDate: null,
        TicketStatus: 0,
        Type: 0
      })
    }
  }, [isShowAdvanceSearch])

  return (
    <SystemAdvanceSearchWrapper>
      <SearchEasyWrapper>
        <Row justify="space-between" className="mb-0">
          <Col flex="1 1 auto" className="mr-2">
            <Form>
              <Form.Item name="TextSearch">
                <Search
                  placeholder="Nhập số phiếu, Họ tên người yêu cầu, Tên tài liệu"
                  enterButton={<SearchOutlined style={{ fontSize: '24px' }} />}
                  onSearch={value => handleChangeEasySearch(value)}
                />
              </Form.Item>
            </Form>
          </Col>
          <Tooltip title="" color="#2a2a2a" placement="left">
            <ButtonCustom
              text={!isShowAdvanceSearch ? 'Mở bộ lọc nâng cao' : 'Đóng bộ lọc nâng cao'}
              type="primary"
              size={15}
              color="var(--color-primary)"
              icon={
                !isShowAdvanceSearch ? (
                  <Icon name="filter_alt" size={20} className="mx-auto" />
                ) : (
                  <Icon name="keyboard_arrow_up" size={20} className="mx-auto" />
                )
              }
              onClick={() => setIsShowAdvanceSearch(!isShowAdvanceSearch)}
            />
          </Tooltip>
        </Row>
      </SearchEasyWrapper>

      {isShowAdvanceSearch && (
        <Form
          name="basic"
          layout="vertical"
          form={form}
          initialValues={conditionSearch}
          onValuesChange={(changedValues, allValues) => {
            setIsChangeAdvanceSearch(true)
            handleChangSearch(allValues)
          }}
        >
          <Row justify="start" gutter="16" className="pd-top-10">
            <Col span={4}>
              <Form.Item label="Trạng thái" name="TicketStatus">
                <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                  <Option key={0} value={0}>
                    Tất cả
                  </Option>
                  {ticketStatus &&
                    ticketStatus.length &&
                    ticketStatus.map((item, idx) => (
                      <Option key={idx + 1} value={Number(item.CodeValue)}>
                        {item.Text} ({item.CodeKey})
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item label="Hình thức khai thác" name="Type">
                <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                  <Option key={0} value={0}>
                    Tất cả
                  </Option>
                  {ticketMiningType &&
                    ticketMiningType.length &&
                    ticketMiningType.map((item, idx) => (
                      <Option key={idx + 1} value={Number(item.CodeValue)}>
                        {item.Text} ({item.CodeKey})
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Thời gian bắt đầu" name="StartDate">
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
              <Form.Item label="Thời gian kết thúc" name="EndDate">
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
      )}
    </SystemAdvanceSearchWrapper>
  )
}

SystemAdvanceSearch.propTypes = {
  conditionSearch: PropTypes.object,
  handleChangeEasySearch: PropTypes.func,
  handleChangSearch: PropTypes.func
}

export default SystemAdvanceSearch
