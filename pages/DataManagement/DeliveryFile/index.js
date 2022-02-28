import React, { useState, useEffect } from 'react'
import { Row, Breadcrumb, Button, Tooltip, Empty, Space } from 'antd'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// API Service
import FileDeliveryService from 'src/api/FileDeliveryService'

// Ultis
import { formatDateVN } from 'src/helpers/FomatDateTime'
import { exportExcelURL } from 'src/helpers'

// Store Redux
import actions from 'src/store/common/actions'

// Components
import ButtonCustom from 'src/components/Button/Button'
import Icon from 'src/components/Icon/Icon'
import TruncateText from 'src/components/TruncateText'
import { FloatActionWrapper } from 'src/components/FloatAction/styled/FloatActionWrapper'
import {
  DataManagementWrapper,
  BreadcrumbWrapper,
  TableHeadingWrapper,
  TableStyledWrapper
} from 'src/pages/DataManagement/styled/DataManagementWrapper'
import { CreateEditTicketDelivery } from './components/CreateEditTicketDelivery'
import SystemAdvanceSearchWrapper from './components/SystemAdvanceSearch'
import { ModalDelete } from './components/ModalDelete'

const initialSearch = {
  TextSearch: '',
  StartDate: '',
  EndDate: '',
  PageSize: 20,
  CurrentPage: 1,
  Type: 1
}

function DeliveryFile() {
  const dispatch = useDispatch()

  // State
  const [dataDocument, setDataDocument] = useState([])
  const [conditionSearch, setConditionSearch] = useState(initialSearch)
  const [paginationData, setPaginationData] = useState({
    CurrentPage: 1,
    PageSize: 20,
    TotalSearch: 0
  })
  const [fileSelected, setFileSelected] = useState(null)

  // State Modal
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModalCreateEdit, setIsOpenModalCreateEdit] = useState(false)
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)

  const columns = [
    {
      title: 'STT',
      align: 'center',
      width: 50,
      key: 'stt',
      render: (value, record, index) => <>{(paginationData?.CurrentPage - 1) * paginationData?.PageSize + index + 1}</>
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'FileDeliveryID',
      key: 'FileDeliveryID',
      width: 100,
      render: value => <>{value < 10 ? `000${value}` : value < 100 && value > 10 ? `00${value}` : value}</>
    },
    {
      title: 'Loại phiếu',
      dataIndex: 'FileType',
      key: 'FileType',
      width: 100
    },
    {
      title: 'Cơ quan, đơn vị giao nhận',
      key: 'UnitPersonDelivery',
      dataIndex: 'UnitPersonDelivery',
      width: 200
    },
    {
      title: 'Cá nhân giao nhận',
      key: 'PersonalDelivery',
      dataIndex: 'PersonalDelivery',
      width: 200
    },
    {
      title: 'Nội dung Tiêu đề Hồ sơ, Tài liệu',
      key: 'Title',
      dataIndex: 'Title',
      width: 250,
      render: value => (
        <TruncateText maxLine={2} content={value} maxWidth={250}>
          {value}
        </TruncateText>
      )
    },
    {
      title: 'Thời gian Hồ sơ,Tài liệu',
      key: 'Time',
      width: 200,
      render: (value, record) => {
        return (
          <>
            <Tooltip
              title={`Thời gian bắt đầu:  ${formatDateVN(record.StartDate)} - Thời gian kết thúc: ${formatDateVN(
                record.EndDate
              )}`}
              color="#2a2a2a"
            >
              {formatDateVN(record.StartDate)} - {formatDateVN(record.EndDate)}
            </Tooltip>
          </>
        )
      }
    },
    {
      title: 'Thời gian giao nhận',
      dataIndex: 'DeliveryStartDate',
      align: 'center',
      key: 'DeliveryStartDate',
      width: 200,
      render: value => formatDateVN(value)
    },
    {
      title: 'Số lượng',
      align: 'center',
      dataIndex: 'NumberOfBundle',
      key: 'NumberOfBundle',
      width: 100
    },
    {
      title: 'Công cụ tra cứu',
      key: 'LockupTool',
      dataIndex: 'LockupTool',
      width: 250,
      render: value => (
        <TruncateText maxLine={1} content={value} maxWidth={250}>
          {value}
        </TruncateText>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'Description',
      key: 'Description',
      render: (value, record) => {
        return (
          <>
            <TruncateText maxLine={1} content={value} maxWidth="200">
              {value}
            </TruncateText>

            <FloatActionWrapper size="small" className="float-action__wrapper">
              <Tooltip title="Cập nhật phiếu" color="#2a2a2a" mouseLeaveDelay={0}>
                <Button
                  type="link"
                  size="small"
                  icon={<Icon name="edit" size={20} color="var(--color-blue-600)" className="mx-auto" />}
                  onClick={() => {
                    setFileSelected(record?.ObjectGuid)
                    setIsOpenModalCreateEdit(true)
                  }}
                />
              </Tooltip>
              <Tooltip title="Xóa phiếu" color="#2a2a2a" mouseLeaveDelay={0}>
                <Button
                  type="link"
                  size="small"
                  icon={<Icon name="delete" size={20} color="var(--color-red-500)" className="mx-auto" />}
                  onClick={() => {
                    setIsOpenModalDelete(true)
                    setFileSelected(record?.ObjectGuid)
                  }}
                />
              </Tooltip>
              <Tooltip title="Xem lịch sử" color="#2a2a2a" mouseLeaveDelay={0}>
                <Button
                  type="link"
                  size="small"
                  icon={<Icon name="history" size={20} color="green" className="mx-auto" />}
                  onClick={() => {
                    dispatch(actions.setObjectGuidHistory(record.ObjectGuid))
                    dispatch(actions.setOpenModalHistory())
                  }}
                />
              </Tooltip>
            </FloatActionWrapper>
          </>
        )
      }
    }
  ]

  const getListDeliveryFile = () => {
    setIsLoading(true)
    FileDeliveryService.getListAdvancedSearch(conditionSearch)
      .then(res => {
        if (res.isError) return
        const newData = res.Object?.Data.map((item, idx) => {
          return {
            ...item,
            key: idx
          }
        })
        setDataDocument(newData)
        setPaginationData({
          CurrentPage: res?.Object?.CurrentPage,
          PageSize: res?.Object?.PageSize,
          TotalSearch: res?.Object?.TotalSearch
        })
      })
      .finally(() => setIsLoading(false))
  }

  const handleChangePage = (page, pageSize) => {
    setConditionSearch({
      ...conditionSearch,
      PageSize: pageSize,
      CurrentPage: page
    })
  }

  const handleChangeSearch = allValues => {
    setConditionSearch({ ...conditionSearch, ...allValues })
  }

  const exportDeliveryFile = () => {
    FileDeliveryService.export(conditionSearch).then(res => {
      if (!res.isError) {
        exportExcelURL(res.Object)
      }
    })
  }

  useEffect(() => {
    return () => dispatch(actions.setCloseModalDataMining())
  }, [])

  useEffect(() => {
    getListDeliveryFile()
  }, [conditionSearch])

  return (
    <DataManagementWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>Quản lý dữ liệu</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/audio-file">Hồ sơ tài liệu giao nộp</Link>
        </Breadcrumb.Item>
      </BreadcrumbWrapper>
      <Row justify="start" className="mb-10">
        <SystemAdvanceSearchWrapper conditionSearch={conditionSearch} handleChangeSearch={handleChangeSearch} />
      </Row>
      <TableHeadingWrapper>
        <div>
          <div className="table-heading">Thống kê phiếu nhập, xuất hồ sơ tài liệu</div>
          <div>Số bản ghi: {paginationData.TotalSearch} </div>
        </div>
        <Space>
          <ButtonCustom
            text="Thêm phiếu"
            color="var(--color-primary)"
            icon={<Icon name="add" size={20} className="mx-auto" />}
            size={15}
            onClick={() => {
              setFileSelected(null)
              setIsOpenModalCreateEdit(true)
            }}
          />
          <ButtonCustom
            text="Xuất file"
            color="var(--color-primary)"
            icon={<Icon name="download" size={20} className="mx-auto" />}
            size={15}
            onClick={() => {
              exportDeliveryFile()
            }}
          />
        </Space>
      </TableHeadingWrapper>

      <TableStyledWrapper
        loading={isLoading}
        // rowSelection={{ ...rowSelection }}
        columns={columns}
        dataSource={dataDocument}
        key={columns.key}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy dữ liệu" />
        }}
        pagination={
          paginationData.TotalSearch > 10 && {
            pageSize: paginationData.PageSize,
            current: paginationData.CurrentPage,
            total: paginationData.TotalSearch,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            locale: { items_per_page: '' },
            onChange: (page, pageSize) => handleChangePage(page, pageSize)
          }
        }
        rowClassName={record =>
          record?.FileStatus === 1 ? 'row-inactive' : record?.FileStatus === 4 ? 'row-delete' : ''
        }
        ellipsis
      />

      {isOpenModalCreateEdit && (
        <CreateEditTicketDelivery
          visible={isOpenModalCreateEdit}
          type="primary"
          objectGuid={fileSelected}
          onOk={() => getListDeliveryFile()}
          onCancel={() => {
            setFileSelected(null)
            setIsOpenModalCreateEdit(false)
          }}
        />
      )}

      {isOpenModalDelete && (
        <ModalDelete
          visible={isOpenModalDelete}
          type="primary"
          objectGuid={fileSelected}
          onCancel={() => {
            getListDeliveryFile()
            setFileSelected(null)
            setIsOpenModalDelete(false)
          }}
        />
      )}
    </DataManagementWrapper>
  )
}

DeliveryFile.propTypes = {}

export default DeliveryFile
