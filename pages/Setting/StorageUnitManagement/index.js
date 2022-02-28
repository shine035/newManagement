import React, { useState, useEffect } from 'react'
import { Breadcrumb, Button, Row, Space, Tooltip } from 'antd'
import { useDispatch } from 'react-redux'

// API Services
import StorageUnitService from 'src/api/StorageUnitService'

// Store redux
import actions from 'src/store/common/actions'

// Components
import Icon from 'src/components/Icon/Icon'
import SystemEasySearch from 'src/components/SystemEasySearch/SystemEasySearch'
import SystemAdvanceSearchWrapper from './components/SystemAdvanceSearch'
import {
  BreadcrumbWrapper,
  StorageUnitManagementWrapper,
  TableContentWrapper,
  TableHeadingWrapper
} from './styled/StorageUnitManagement'
import { CreateUpdateStorageUnit } from './components/CreateUpdateStorageUnit'
import StatusStorageUnit from './components/StatusStorageUnit'
import ModalDeleteStorageUnit from './components/ModalDeleteStorageUnit'
// import PropTypes from 'prop-types'

function StorageUnitManagement() {
  const dispatch = useDispatch()

  const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
  const [isOpenModalCreateStorage, setIsOpenModalCreateStorage] = useState(false)

  const [isShowDeleteStorageUnit, setIsShowDeleteStorageUnit] = useState(false)
  const [detailStorageUnit, setDetailStorageUnit] = useState({})
  const [conditionSearch] = useState({
    TextSearch: '',
    StatusID: 1,
    PageSize: 10,
    CurrentPage: 1
  })
  const [dataStorageUnit, setDataStorageUnit] = useState([])
  const [isLoading, setisLoading] = useState(false)

  const columns = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      width: 60,
      render: (text, row, index) => <div className="text-center">{index + 1}</div>
    },
    {
      title: 'ĐVBQ số',
      width: 200,
      dataIndex: 'StorageUnitCode'
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'Title'
    },
    {
      title: 'Ghi chú',
      width: 320,
      dataIndex: 'Description'
    },
    {
      title: 'Trạng thái',
      width: 200,
      dataIndex: 'StatusName',
      render: (text, row) => <StatusStorageUnit status={row.Status} statusName={row.StatusName} />
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: item => {
        const { Status } = item
        return (
          <Space size="small">
            <Tooltip title="Chi tiết" color="#2a2a2a">
              <Button
                type="link"
                size="small"
                icon={<Icon name="edit" color="green" size={20} className="mx-auto" />}
                onClick={() => {
                  setIsOpenModalCreateStorage(true)
                  setDetailStorageUnit(item)
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
            {Status !== 2 && (
              <Tooltip title="Xoá" color="#2a2a2a">
                <Button
                  type="link"
                  size="small"
                  icon={<Icon name="delete" color="red" size={20} className="mx-auto" />}
                  onClick={() => {
                    setIsShowDeleteStorageUnit(true)
                    setDetailStorageUnit(item)
                  }}
                />
              </Tooltip>
            )}
          </Space>
        )
      }
    }
  ]

  useEffect(() => {
    getDataStorageUnit()
  }, [conditionSearch])

  const getDataStorageUnit = () => {
    setisLoading(true)
    StorageUnitService.getListAdvancedSearch()
      .then(res => {
        if (res.Error) return
        setDataStorageUnit(res.Object.Data)
      })
      .finally(() => setisLoading(false))
  }

  const handleInsertUpdateSuccess = () => {
    getDataStorageUnit()
    setDetailStorageUnit(null)
    setIsShowDeleteStorageUnit(false)
    setIsOpenModalCreateStorage(false)
  }

  return (
    <StorageUnitManagementWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>
          <a href="">Quản trị hệ thống</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Đơn vị bảo quản</Breadcrumb.Item>
      </BreadcrumbWrapper>
      {!isAdvanceSearch && (
        <SystemEasySearch
          typeSearch={isAdvanceSearch}
          placeholder="Nhập ĐVBQ số, Tiêu đề ĐVBQ"
          handleChangeTypeSearch={() => setIsAdvanceSearch(true)}
        />
      )}
      {isAdvanceSearch && (
        <Row justify="start" className="mb-3">
          <SystemAdvanceSearchWrapper onClickCloseAdvanceSearch={() => setIsAdvanceSearch(false)} />
        </Row>
      )}
      <TableHeadingWrapper>
        <div>
          <div className="table-heading">Danh sách đơn vị bảo quản (4)</div>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<Icon name="add" className="mr-2" size={18} />}
            onClick={() => {
              setDetailStorageUnit(null)
              setIsOpenModalCreateStorage(true)
            }}
          >
            Thêm ĐVBQ
          </Button>
        </Space>
      </TableHeadingWrapper>
      <TableContentWrapper columns={columns} loading={isLoading} dataSource={dataStorageUnit} />
      <CreateUpdateStorageUnit
        data={detailStorageUnit}
        visible={isOpenModalCreateStorage}
        onCancel={() => setIsOpenModalCreateStorage(false)}
        onOk={() => handleInsertUpdateSuccess()}
      />
      <ModalDeleteStorageUnit
        visible={isShowDeleteStorageUnit}
        data={detailStorageUnit}
        onCancel={() => {
          setIsShowDeleteStorageUnit(false)
          setDetailStorageUnit(null)
        }}
        onOk={() => handleInsertUpdateSuccess()}
      />
    </StorageUnitManagementWrapper>
  )
}

StorageUnitManagement.propTypes = {}

export default StorageUnitManagement
