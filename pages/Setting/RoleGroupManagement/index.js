import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
import { Button, Space, Tooltip, Badge, Typography } from 'antd'
import { useDispatch } from 'react-redux'

// API Service
import RoleGroupService from 'src/api/RoleGroup'

// Store Redux
import actions from 'src/store/common/actions'

// Components
import Icon from 'src/components/Icon/Icon'
import TruncateText from 'src/components/TruncateText'
import SystemAdvanceSearchWrapper from './components/SystemAdvanceSearch'
import ModalDeleteRoleGroup from './components/ModalDeleteRoleGroup'
import ModalCreateEditRoleGroup from './components/ModalCreateEditRoleGroup'

import { RoleGroupWrapper, TableHeadingWrapper, TableContentWrapper } from './styled/RoleGroupWrapper'

const { Text } = Typography

function RoleGroupManagement() {
  const dispatch = useDispatch()

  const [conditionSearch, setConditionSearch] = useState({
    RoleGroupName: '',
    StatusID: 1,
    CurrentPage: 1,
    PageSize: 50
  })
  const [isLoading, setIsLoading] = useState(false)
  const [roleGroupData, setRoleGroupData] = useState([])
  const [roleDetail, setRoleDetail] = useState(null)
  const [isShowDeleteRoleGroup, setIsShowDeleteRoleGroup] = useState(false)
  const [isShowCreateEditRoleGroup, setIsShowCreateEditRoleGroup] = useState(false)

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 80,
      render: (text, row, index) => index + 1
    },
    {
      title: 'Nhóm quyền',
      dataIndex: 'RoleGroupName',
      width: 200
    },
    {
      title: 'Nhóm quyền',
      dataIndex: 'ListRoleDescription',
      render: ListRoleDescription =>
        ListRoleDescription.map((role, idx) => (
          <TruncateText key={idx} maxLine={2}>
            - {role}
          </TruncateText>
        ))
    },
    {
      width: 250,
      title: 'Trạng thái',
      dataIndex: 'IsDelete',
      render: value => (
        <>
          <Badge status={!value ? 'success' : 'error'} />
          <Text type={!value ? 'success' : 'danger'}>{!value ? 'Đang hoạt động' : 'Đã xoá'}</Text>
        </>
      )
    },
    {
      width: 200,
      title: 'Thao tác',
      key: 'action',
      render: (value, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              style={{ visibility: record?.IsDelete ? 'hidden' : '' }}
              icon={<Icon name="edit" color="var(--color-primary)" size={20} className="mx-auto" />}
              onClick={() => handleEditRoleGroup(record)}
            />
          </Tooltip>
          <Tooltip title="Xem lịch sử" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="history" color="var(--color-primary)" size={20} className="mx-auto" />}
              onClick={() => {
                dispatch(actions.setObjectGuidHistory(record?.ObjectGuid))
                dispatch(actions.setOpenModalHistory())
              }}
            />
          </Tooltip>
          <Tooltip title="Xoá nhóm quyền" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              style={{ visibility: record?.IsDelete ? 'hidden' : '' }}
              icon={<Icon name="delete" color="var(--color-red-600)" size={20} className="mx-auto" />}
              onClick={() => {
                setIsShowDeleteRoleGroup(true)
                setRoleDetail(record)
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  useEffect(() => {
    getListRoleGroup(conditionSearch)
  }, [conditionSearch])

  const getListRoleGroup = condition => {
    setIsLoading(true)
    RoleGroupService.getList(condition)
      .then(res => {
        if (res.isError) return
        setRoleGroupData(res.Object)
      })
      .finally(() => setIsLoading(false))
  }

  const handleSearch = value => {
    const newConditionSearch = { ...conditionSearch, ...value }
    setConditionSearch(newConditionSearch)
  }

  const handleEditRoleGroup = roleGroup => {
    setRoleDetail(roleGroup)
    setIsShowCreateEditRoleGroup(true)
  }

  const handleSuccess = () => {
    setIsShowCreateEditRoleGroup(false)
    setIsShowDeleteRoleGroup(false)
    getListRoleGroup(conditionSearch)
    setRoleDetail(null)
  }

  return (
    <RoleGroupWrapper>
      <SystemAdvanceSearchWrapper onSearch={value => handleSearch(value)} />
      <TableHeadingWrapper>
        <div>
          <div className="table-heading">Danh sách nhóm quyền</div>
          <div>Số bản ghi: {roleGroupData.length}</div>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<Icon name="add" size={16} className="mr-1" />}
            onClick={() => setIsShowCreateEditRoleGroup(true)}
          >
            Thêm nhóm quyền
          </Button>
        </Space>
      </TableHeadingWrapper>
      <TableContentWrapper loading={isLoading} columns={columns} dataSource={roleGroupData} />
      <ModalDeleteRoleGroup
        visible={isShowDeleteRoleGroup}
        roleData={roleDetail}
        onCancel={() => {
          setIsShowDeleteRoleGroup(false)
          setRoleDetail(null)
        }}
        onOk={() => handleSuccess()}
      />
      <ModalCreateEditRoleGroup
        visible={isShowCreateEditRoleGroup}
        roleData={roleDetail}
        onCancel={() => {
          setIsShowCreateEditRoleGroup(false)
          setRoleDetail(null)
        }}
        onOk={() => handleSuccess()}
      />
    </RoleGroupWrapper>
  )
}

RoleGroupManagement.propTypes = {}

export default RoleGroupManagement
