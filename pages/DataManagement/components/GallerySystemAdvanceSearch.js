import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select, Input, Tooltip } from 'antd'
import { useSelector } from 'react-redux'

// UI
import { SearchOutlined } from '@ant-design/icons'
// Component
import Icon from 'src/components/Icon/Icon'
import ButtonCustom from 'src/components/Button/Button'

// Style
import FadeIn from 'react-fade-in'
import { SystemAdvanceSearchWrapper, SearchEasyWrapper } from '../styled/DataManagementWrapper'

const { Option } = Select
const { Search } = Input

function GallerySystemAdvanceSearch({ handleChangeEasySearch, handleChangeAdvanceSearch, conditionSearch }) {
  const [form] = Form.useForm()
  const { nationalAssembly, congressMeeting, meeting } = useSelector(state => state.common)
  const [isShowAdvanceSearch, setIsShowAdvanceSearch] = useState(false)
  const [isChangeAdvanceSearch, setIsChangeAdvanceSearch] = useState(false)

  useEffect(() => {
    if (isShowAdvanceSearch && isChangeAdvanceSearch) {
      form.setFieldsValue({
        ...conditionSearch,
        NationalAssembly: null,
        CongressMeeting: null,
        Meeting: null,
        StartDate: null,
        EndDate: null,
        GalleryStatus: null,
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
              placeholder="Mã ĐVBQ/STA, Nội dung STA, Thời gian, Ký hiệu thông tin, Ghi chú"
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
            <Row gutter={20}>
              <Col span={4}>
                <Form.Item label="QHK" name="NationalAssembly">
                  <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode} showSearch>
                    <Option value={null}>Tất cả</Option>
                    {nationalAssembly &&
                      nationalAssembly.length &&
                      nationalAssembly.map(item => (
                        <Option key={Number(item.CodeValue)} value={Number(item.CodeValue)}>
                          {item.Text}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="KHT" name="CongressMeeting">
                  <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode} showSearch>
                    <Option value={null}>Tất cả</Option>
                    {congressMeeting &&
                      congressMeeting.length &&
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
                  <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode} showSearch>
                    <Option value={null}>Tất cả</Option>
                    {meeting &&
                      meeting.length &&
                      meeting.map(item => (
                        <Option key={Number(item.CodeValue)} value={Number(item.CodeValue)}>
                          {item.Text}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Trạng thái" name="GalleryStatus">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={null}>Tất cả</Option>
                    <Option value={2}>Khả dụng</Option>
                    <Option value={4}>Đã xóa</Option>
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

GallerySystemAdvanceSearch.propTypes = {
  handleChangeEasySearch: PropTypes.func,
  handleChangeAdvanceSearch: PropTypes.func,
  conditionSearch: PropTypes.object
}

export default GallerySystemAdvanceSearch
