import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select, Input, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import FadeIn from 'react-fade-in'

import RoleGroupService from 'src/api/RoleGroup'

// Components
import Icon from 'src/components/Icon/Icon'
import ButtonCustom from 'src/components/Button/Button'
import { SystemAdvanceSearchWrapper, SearchEasyWrapper } from '../styled/UserManagementWrapper'

const { Option } = Select
const { Search } = Input

function SystemAdvanceSearch({ conditionSearch, handleChangeEasySearch, handleChangeAdvanceSearch }) {
  const [isShowAdvanceSearch, setIsShowAdvanceSearch] = useState(false)
  const [isChangeAdvanceSearch, setIsChangeAdvanceSearch] = useState(false)
  const [form] = Form.useForm()
  const [listRole, setListRole] = useState([])

  const getListRoleGroup = () => {
    RoleGroupService.getList({ RoleGroupName: '', StatusID: 1 }).then(res => {
      if (res?.isError) return
      setListRole(res?.Object)
    })
  }

  useEffect(() => {
    if (!isShowAdvanceSearch && isChangeAdvanceSearch) {
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        RoleGroupID: 0,
        StatusID: 2
      })
      setIsChangeAdvanceSearch(false)
      handleChangeAdvanceSearch(form.getFieldsValue(true))
    }
  }, [isShowAdvanceSearch])

  useEffect(() => {
    getListRoleGroup()
  }, [])

  return (
    <SystemAdvanceSearchWrapper>
      <Form
        name="basic"
        form={form}
        layout="vertical"
        initialValues={conditionSearch}
        onValuesChange={(changedValues, allValues) => {
          setIsChangeAdvanceSearch(true)
          handleChangeAdvanceSearch(allValues)
        }}
      >
        <SearchEasyWrapper>
          <Row justify="space-between" className="mb-0">
            <Col flex="1 1 auto" className="mr-2">
              <Form.Item name="UserName">
                <Search
                  placeholder="Nhập Tên tài khoản, Họ tên, Đơn vị công tác"
                  enterButton={<SearchOutlined style={{ fontSize: '24px' }} />}
                  onSearch={(value, e) => {
                    e.preventDefault()
                    handleChangeEasySearch(value)
                  }}
                />
              </Form.Item>
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
                onClick={() => {
                  setIsShowAdvanceSearch(!isShowAdvanceSearch)
                }}
              />
            </Tooltip>
          </Row>
        </SearchEasyWrapper>
        {isShowAdvanceSearch && (
          <FadeIn>
            <Row justify="start" gutter="16">
              <Col span={4}>
                <Form.Item name="RoleGroupID" label="Nhóm quyền">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Select.Option value={0}>Tất cả</Select.Option>
                    {!!listRole &&
                      !!listRole.length &&
                      listRole.map(item => (
                        <Select.Option value={item?.RoleGroupID}>{item?.RoleGroupName}</Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Trạng thái" name="StatusID">
                  <Select getPopupContainer={trigger => trigger.parentNode}>
                    <Option value={2}>Tất cả</Option>
                    <Option value={1}>Hoạt động</Option>
                    <Option value={0}>Không hoạt động</Option>
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

SystemAdvanceSearch.propTypes = {
  conditionSearch: PropTypes.object,
  handleChangeEasySearch: PropTypes.func,
  handleChangeAdvanceSearch: PropTypes.func
}

export default SystemAdvanceSearch
