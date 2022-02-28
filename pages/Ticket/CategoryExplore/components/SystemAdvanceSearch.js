import React, { useState } from 'react'
import PropTypes from 'prop-types'
import FadeIn from 'react-fade-in'
import { Form, Row, Col, Select, DatePicker, Input, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

// Component
import Icon from 'src/components/Icon/Icon'
import ButtonCustom from 'src/components/Button/Button'

// Helpers
import { localeVN, dateFormat } from 'src/helpers/FomatDateTime'

// Styled Component
import { SystemAdvanceSearchWrapper, SearchEasyWrapper } from '../styled/CategoryExploreWrapper'

const { Option } = Select
const { Search } = Input

function SystemAdvanceSearch({ conditionSearch, handleChangeEasySearch, handleChangeAdvanceSearch }) {
  const [isShowAdvanceSearch, setIsShowAdvanceSearch] = useState(false)

  return (
    <SystemAdvanceSearchWrapper>
      <SearchEasyWrapper>
        <Row justify="space-between" className="mb-0">
          <Col flex="1 1 auto" className="mr-2">
            <Search
              defaultValue={conditionSearch.TextSearch}
              placeholder="Nhập Trích yếu nội dung, Tiêu đề, Số văn bản, Số và ký hiệu, Mã định danh văn bản"
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
        initialValues={conditionSearch}
        onValuesChange={(changedValues, allValues) => handleChangeAdvanceSearch(allValues)}
      >
        {isShowAdvanceSearch && (
          <FadeIn>
            <Row justify="start" gutter={20}>
              <Col span={4}>
                <Form.Item label="Loại tài liệu" name="TypeName">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={0}>Tất cả</Option>
                    <Option value={1}>Khóa I</Option>
                    <Option value={2}>Khóa II</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="QHK" name="NationalAssemblyFrom">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={0}>Tất cả</Option>
                    <Option value={1}>Khóa I</Option>
                    <Option value={2}>Khóa II</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Đến" name="NationalAssemblyTo">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={0}>Tất cả</Option>
                    <Option value={1}>Khóa I</Option>
                    <Option value={2}>Khóa II</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="KHT" name="CongressMeetingFrom">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={0}>Tất cả</Option>
                    <Option value={1}>Kỳ họp thứ nhất</Option>
                    <Option value={2}>Kỳ họp thứ 2</Option>
                    <Option value={3}>Kỳ họp thứ 3</Option>
                    <Option value={4}>Kỳ họp thứ 4</Option>
                    <Option value={5}>Kỳ họp thứ 5</Option>
                    <Option value={6}>Kỳ họp thứ 6</Option>
                    <Option value={7}>Kỳ họp thứ 7</Option>
                    <Option value={8}>Kỳ họp thứ 8</Option>
                    <Option value={9}>Kỳ họp thứ 9</Option>
                    <Option value={10}>Kỳ họp thứ 10</Option>
                    <Option value={11}>Kỳ họp thứ 11</Option>
                    <Option value={12}>Kỳ họp thứ 12</Option>
                    <Option value={13}>Kỳ họp thứ 13</Option>
                    <Option value={14}>Kỳ họp thứ 14</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Đến" name="CongressMeetingTo">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={0}>Tất cả</Option>
                    <Option value={1}>Kỳ họp thứ nhất</Option>
                    <Option value={2}>Kỳ họp thứ 2</Option>
                    <Option value={3}>Kỳ họp thứ 3</Option>
                    <Option value={4}>Kỳ họp thứ 4</Option>
                    <Option value={5}>Kỳ họp thứ 5</Option>
                    <Option value={6}>Kỳ họp thứ 6</Option>
                    <Option value={7}>Kỳ họp thứ 7</Option>
                    <Option value={8}>Kỳ họp thứ 8</Option>
                    <Option value={9}>Kỳ họp thứ 9</Option>
                    <Option value={10}>Kỳ họp thứ 10</Option>
                    <Option value={11}>Kỳ họp thứ 11</Option>
                    <Option value={12}>Kỳ họp thứ 12</Option>
                    <Option value={13}>Kỳ họp thứ 13</Option>
                    <Option value={14}>Kỳ họp thứ 14</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={4}>
                <Form.Item label="Phiên họp" name="MeetingFrom">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={0}>Tất cả</Option>
                    <Option value={1}>Phiên họp thứ nhất</Option>
                    <Option value={2}>Phiên họp thứ 2</Option>
                    <Option value={3}>Phiên họp thứ 3</Option>
                    <Option value={4}>Phiên họp thứ 4</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Đến" name="MeetingTo">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={0}>Tất cả</Option>
                    <Option value={1}>Phiên họp thứ nhất</Option>
                    <Option value={2}>Phiên họp thứ 2</Option>
                    <Option value={3}>Phiên họp thứ 3</Option>
                    <Option value={4}>Phiên họp thứ 4</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Thời gian từ" name="IssuedDateFrom">
                  <DatePicker
                    getPopupContainer={trigger => trigger.parentNode}
                    style={{ width: '100%' }}
                    locale={localeVN}
                    format={dateFormat}
                    inputReadOnly
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
                  />
                </Form.Item>
              </Col>
            </Row>
          </FadeIn>
        )}
      </Form>
    </SystemAdvanceSearchWrapper>
  )
}

SystemAdvanceSearch.propTypes = {
  conditionSearch: PropTypes.object,
  handleChangeEasySearch: PropTypes.func,
  handleChangeAdvanceSearch: PropTypes.func
}

export default SystemAdvanceSearch
