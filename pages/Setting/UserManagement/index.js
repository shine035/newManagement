import React, { useEffect, useState } from 'react'
import { Row, Breadcrumb, Button, Space, Tooltip, Empty } from 'antd'
import { useDispatch } from 'react-redux'

// Store Redux
import actions from 'src/store/common/actions'

// Components
import Icon from 'src/components/Icon/Icon'
import ModalDetailUser from 'src/components/Modals/component/ModalDetailUser'
import UserManagerService from 'src/api/UserManagerService'
import SystemAdvanceSearchWrapper from './components/SystemAdvanceSearch'

import {
  UserManagementWrapper,
  BreadcrumbWrapper,
  TableHeadingWrapper,
  TableContentWrapper
} from './styled/UserManagementWrapper'

const initialSearch = {
  UserName: '',
  RoleGroupID: 0,
  StatusID: 2,
  PageSize: 20,
  CurrentPage: 1
}
function UserManagement() {
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModalDetailUser, setIsOpenModalDetailUser] = useState(false)
  const [detailUserInfo, setDetailUserInfo] = useState()
  const [dataUserManager, setDataUserManager] = useState([])
  const [conditionSearch, setConditionSearch] = useState(initialSearch)
  const [paginationData, setPaginationData] = useState({})

  const columns = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      render: (value, record, index) => <>{(paginationData.CurrentPage - 1) * paginationData.PageSize + index + 1}</>
    },
    {
      title: 'Tài khoản',
      dataIndex: 'UserName',
      render: text => <a>{text}</a>
    },
    {
      title: 'Họ và tên',
      dataIndex: 'FullName'
    },
    // {
    //   title: (
    //     <div>
    //       <div>Ngày sinh</div>
    //       <div>Giới tính</div>
    //     </div>
    //   ),
    //   render: (text, row) => `${row?.birthday} ${row?.gender}`
    // },
    // {
    //   title: 'Quê quán',
    //   dataIndex: 'country'
    // },
    {
      title: 'Chức vụ',
      dataIndex: 'PositionName'
    },
    {
      title: 'Phòng ban',
      dataIndex: 'UserDeptName'
    },
    {
      title: 'Nhóm quyền',
      dataIndex: 'RoleGroupName'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'StatusName'
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '100',
      render: item => (
        <Space size="small">
          <Tooltip title="Chi tiết" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="edit" color="green" size={20} className="mx-auto" />}
              onClick={() => {
                setIsOpenModalDetailUser(true)
                setDetailUserInfo(item)
              }}
            />
          </Tooltip>

          <Tooltip title="Xem lịch sử" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="history" color="green" size={20} className="mx-auto" />}
              onClick={() => {
                dispatch(actions.setObjectGuidHistory(item.ObjectGuid))
                dispatch(actions.setOpenModalHistory())
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const getListUserManager = () => {
    setIsLoading(true)
    UserManagerService.getList(conditionSearch)
      .then(res => {
        if (!res.isError && !res.Status) {
          setDataUserManager(res.Object?.Data)
          setPaginationData({
            ...conditionSearch,
            Total: res.Object?.Total
          })
        }
      })
      .finally(() => setIsLoading(false))
  }

  const handleChangeEasySearch = value => {
    setConditionSearch({
      ...conditionSearch,
      UserName: value
    })
  }

  const handleChangeAdvanceSearch = allValues => {
    setConditionSearch({
      ...conditionSearch,
      RoleGroupID: allValues.RoleGroupID,
      StatusID: allValues.StatusID
    })
  }

  const handleChangePage = (page, pageSize) => {
    setConditionSearch({
      ...conditionSearch,
      PageSize: pageSize,
      CurrentPage: page
    })
  }

  useEffect(() => {
    getListUserManager()
  }, [conditionSearch])

  return (
    <UserManagementWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>
          <a href="">Quản trị hệ thống</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý người dùng</Breadcrumb.Item>
      </BreadcrumbWrapper>
      <Row justify="start" className="mb-3">
        <SystemAdvanceSearchWrapper
          conditionSearch={conditionSearch}
          handleChangeEasySearch={handleChangeEasySearch}
          handleChangeAdvanceSearch={handleChangeAdvanceSearch}
        />
      </Row>
      <TableHeadingWrapper>
        <div>
          <div className="table-heading">Danh sách cán bộ</div>
          <div>Số bản ghi: {paginationData.Total} </div>
        </div>
        <Space>
          <Button type="primary">Đồng bộ dữ liệu</Button>
        </Space>
      </TableHeadingWrapper>
      <TableContentWrapper
        loading={isLoading}
        columns={columns}
        dataSource={dataUserManager}
        pagination={{
          pageSize: paginationData?.PageSize,
          current: paginationData?.CurrentPage,
          total: paginationData?.Total,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          locale: { items_per_page: '' },
          onChange: (page, pageSize) => handleChangePage(page, pageSize)
        }}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy dữ liệu" />
        }}
        rowClassName={record => (record?.RoleGroupID === 0 ? 'row-inactive' : 'row-active')}
      />
      <ModalDetailUser
        data={detailUserInfo}
        visible={isOpenModalDetailUser}
        onCancel={() => {
          setIsOpenModalDetailUser(false)
          getListUserManager()
        }}
      />
    </UserManagementWrapper>
  )
}

UserManagement.propTypes = {}

export default UserManagement
