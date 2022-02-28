import React, { useState, useEffect } from 'react'
import { Row, Button, Space, Tooltip, Empty } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import moment from 'moment'

// API Service
import PhotoService from 'src/api/PhotoService'

// Helpers
import { formatDateVN } from 'src/helpers/FomatDateTime'
import { exportExcelURL } from 'src/helpers/index'

// Store Redux
import actions from 'src/store/common/actions'

// Component
import Icon from 'src/components/Icon/Icon'
import ButtonCustom from 'src/components/Button/Button'
import TruncateText from 'src/components/TruncateText'
import { FloatActionWrapper } from 'src/components/FloatAction/styled/FloatActionWrapper'
import PhotoDocumentSystemAdvanceSearch from './PhotoDocumentSystemAdvanceSearch'

// Styled Component
import { DataManagementWrapper, TableHeadingWrapper, TableStyledWrapper } from '../styled/DataManagementWrapper'

const initialSearch = {
  TextSearch: '',
  ObjectGuidGallery: '',
  PhotoTimeFrom: '',
  PhotoTimeTo: '',
  Mode: 0,
  PhotoStatus: 0,
  PageSize: 20,
  CurrentPage: 1
}

function PhotoDocument() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { GalleryObjectGuid } = useParams()

  // State
  const [conditionSearch, setConditionSearch] = useState(initialSearch)
  const [dataPhoto, setDataPhoto] = useState([])
  const [paginationData, setPaginationData] = useState({})

  // State Loading
  const [isLoading, setIsLoading] = useState(false)

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 50,
      render: (value, record, index) => <>{(paginationData?.CurrentPage - 1) * paginationData?.PageSize + index + 1}</>
    },
    {
      title: 'Tên sự kiện',
      dataIndex: 'EventName',
      width: '15%',
      render: value => (
        <TruncateText maxLine={2} content={value} maxWidth={300}>
          {value}
        </TruncateText>
      )
    },
    {
      title: 'Ký hiệu thông tin',
      width: 150,
      dataIndex: 'InforSign',
      render: value => (
        <TruncateText maxLine={2} content={value} maxWidth={150}>
          {value}
        </TruncateText>
      )
    },
    {
      title: 'Số lưu trữ',
      width: 150,
      dataIndex: 'ArchivesNumber',
      render: value => (
        <TruncateText maxLine={2} content={value} maxWidth={150}>
          {value}
        </TruncateText>
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'ImageTitle',
      width: '15%',
      render: value => (
        <TruncateText maxLine={2} content={value} maxWidth={300}>
          {value}
        </TruncateText>
      )
    },
    {
      title: 'Tác giả',
      dataIndex: 'Photographer',
      width: 200
    },
    {
      title: 'Thời gian chụp',
      width: 150,
      align: 'center',
      dataIndex: 'PhotoTime',
      render: value => {
        return (
          <div>
            <p>{formatDateVN(value)}</p>
          </div>
        )
      }
    },
    {
      title: 'Chế độ sử dụng',
      width: 150,
      dataIndex: 'Mode',
      render: value => {
        return <>{value === 1 ? 'Hạn chế' : value === 2 ? 'Không hạn chế' : ''}</>
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'Description',
      width: 250,
      render: value => {
        return (
          <>
            <TruncateText maxLine={1} content={value} maxWidth={250}>
              {value}
            </TruncateText>
          </>
        )
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'PhotoStatus',
      width: 150,
      render: (value, record) => {
        return (
          <>
            <b
              style={
                value === 2
                  ? { color: '#10b981' }
                  : value === 1
                  ? { color: '#2196f3' }
                  : value === 3
                  ? { color: '#ef4444' }
                  : value === 4
                  ? { color: '#ef4444' }
                  : { color: '#333' }
              }
            >
              {record.PhotoStatusName}
            </b>
            <FloatActionWrapper size="small" className="float-action__wrapper">
              {record.PhotoStatus !== 4 ? (
                <Tooltip title="Sửa, Xem chi tiết" color="#2a2a2a">
                  <Button
                    type="link"
                    size="small"
                    icon={
                      <Icon
                        name="edit"
                        size={20}
                        color="var(--color-blue-600)"
                        className="mx-auto"
                        onClick={() => history.push(`photo/${record.ObjectGuid}`)}
                      />
                    }
                  />
                </Tooltip>
              ) : (
                ''
              )}

              <Tooltip title="Lịch sử" color="#2a2a2a">
                <Button
                  type="link"
                  size="small"
                  icon={<Icon name="history" size={20} color="var(--color-primary)" className="mx-auto" />}
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

  const getListPhotoDocument = newConditionSearch => {
    setIsLoading(true)
    setConditionSearch(newConditionSearch)
    PhotoService.getListAdvancedSearch(newConditionSearch)
      .then(res => {
        if (!res.isError && !res.Status) {
          setDataPhoto(res.Object?.Data)
          setPaginationData({
            CurrentPage: res.Object?.CurrentPage,
            PageSize: res.Object?.PageSize,
            TotalSearch: res.Object?.TotalSearch
          })
        }
      })
      .finally(() => setIsLoading(false))
  }

  const handleChangeEasySearch = value => {
    const newConditionSearch = {
      ...conditionSearch,
      ObjectGuidGallery: GalleryObjectGuid,
      CurrentPage: 1,
      TextSearch: value
    }
    getListPhotoDocument(newConditionSearch)
  }

  const handleChangeAdvanceSearch = allValues => {
    const newConditionSearch = {
      ...conditionSearch,
      ...allValues,
      ObjectGuidGallery: GalleryObjectGuid,
      CurrentPage: 1,
      PhotoTimeFrom: allValues.PhotoTimeFrom ? moment(allValues.PhotoTimeFrom).format() : '',
      PhotoTimeTo: allValues.PhotoTimeTo ? moment(allValues.PhotoTimeTo).format() : ''
    }
    getListPhotoDocument(newConditionSearch)
  }

  const handleChangePage = (page, pageSize) => {
    const newConditionSearch = {
      ...conditionSearch,
      PageSize: pageSize,
      CurrentPage: page
    }
    getListPhotoDocument(newConditionSearch)
  }

  const exportPhotoDocument = () => {
    PhotoService.export(conditionSearch).then(res => {
      if (!res.isError) {
        exportExcelURL(res.Object)
      }
    })
  }

  useEffect(() => {
    return () => dispatch(actions.setCloseModalDataMining())
  }, [])

  useEffect(() => {
    const newConditionSearch = {
      ...conditionSearch,
      ObjectGuidGallery: GalleryObjectGuid
    }
    getListPhotoDocument(newConditionSearch)
  }, [])

  return (
    <DataManagementWrapper>
      <Row justify="start" className="mb-0">
        <PhotoDocumentSystemAdvanceSearch
          conditionSearch={conditionSearch}
          handleChangeEasySearch={handleChangeEasySearch}
          handleChangeAdvanceSearch={handleChangeAdvanceSearch}
        />
      </Row>
      <TableHeadingWrapper>
        <div>
          <div className="table-heading">Danh sách Tài Liệu Phim (Âm bản)/Ảnh</div>
          <div>Số bản ghi: {paginationData.TotalSearch} </div>
        </div>
        <Space>
          <ButtonCustom
            text="Thêm tài liệu"
            color="var(--color-primary)"
            icon={<Icon name="add" size={20} className="mx-auto" />}
            size={15}
            onClick={() => history.push('photo/create')}
          />
          <ButtonCustom
            text="Xuất file"
            color="var(--color-primary)"
            icon={<Icon name="download" size={20} className="mx-auto" />}
            size={15}
            onClick={() => exportPhotoDocument()}
          />
        </Space>
      </TableHeadingWrapper>

      <TableStyledWrapper
        loading={isLoading}
        columns={columns}
        dataSource={dataPhoto}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy dữ liệu" />
        }}
        pagination={{
          pageSize: paginationData.PageSize,
          current: paginationData.CurrentPage,
          total: paginationData.TotalSearch,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          locale: { items_per_page: '' },
          onChange: (page, pageSize) => handleChangePage(page, pageSize)
        }}
        rowClassName={record =>
          record?.PhotoStatus === 1 ? 'row-inactive' : record?.PhotoStatus === 4 ? 'row-delete' : ''
        }
      />
    </DataManagementWrapper>
  )
}

PhotoDocument.propTypes = {}

export default PhotoDocument
