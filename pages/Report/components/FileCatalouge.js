import React, { useState, useEffect } from 'react'
import { Row, Breadcrumb, Space, Tooltip } from 'antd'

// API Service
import CalalogueService from 'src/api/CalalogueService'

// Ultis
import { formatDateVN } from 'src/helpers/FomatDateTime'
import { exportExcelURL } from 'src/helpers'

// Components
import ButtonCustom from 'src/components/Button/Button'
import Icon from 'src/components/Icon/Icon'
import TruncateText from 'src/components/TruncateText'

// style
import {
  FileCatalougeWrapper,
  BreadcrumbWrapper,
  TableHeadingWrapper,
  TableStyledWrapper
} from 'src/pages/Report/styled/FileCatalougeWrapper'

import FileCatalougeAdvanceSearchWrapper from './FileCatalougeAdvanceSearch'

const initialSearch = {
  NationalAssemblyFrom: null,
  NationalAssemblyTo: null,
  CongressMeetingFrom: null,
  CongressMeetingTo: null,
  MeetingFrom: null,
  MeetingTo: null,
  PageSize: 20,
  CurrentPage: 1,
  StartDate: null,
  EndDate: null
}
function FileCatalouge() {
  // State
  const [dataDocument, setDataDocument] = useState([])
  const [conditionSearch, setConditionSearch] = useState(initialSearch)
  const [paginationData, setPaginationData] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TotalSearch: 0
  })

  // State Modal
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getListAdvancedSearch(conditionSearch)
  }, [])

  const getListAdvancedSearch = body => {
    setConditionSearch(body)
    setIsLoading(true)
    CalalogueService.getListAdvancedSearch(body)
      .then(res => {
        if (res.isError) return
        setDataDocument(res.Object?.Data)
        setPaginationData({
          CurrentPage: res.Object.CurrentPage,
          PageSize: res.Object.PageSize,
          TotalSearch: res.Object.TotalSearch
        })
      })
      .finally(() => setIsLoading(false))
  }

  const handleChangePage = (page, pageSize) => {
    getListAdvancedSearch({
      ...conditionSearch,
      PageSize: pageSize,
      CurrentPage: page
    })
  }

  const exportFileCatalogue = () => {
    setIsLoading(true)
    CalalogueService.exportFileCatalogue({
      ...conditionSearch,
      PageSize: paginationData.TotalSearch,
      CurrentPage: 1
    })
      .then(res => {
        if (!res.isError) {
          exportExcelURL(res.Object)
          // window.open(`${process.env.REACT_APP_DOMAIN}${res.Object}`)
        }
      })
      .finally(() => setIsLoading(false))
  }

  const exportFileCatalogueDVBQ = () => {
    setIsLoading(true)
    CalalogueService.exportFileCatalogueDVBQ({
      ...conditionSearch,
      PageSize: paginationData.TotalSearch,
      CurrentPage: 1
    })
      .then(res => {
        if (!res.isError) {
          exportExcelURL(res.Object)
          // window.open(`${process.env.REACT_APP_DOMAIN}${res.Object}`)
        }
      })
      .finally(() => setIsLoading(false))
  }

  const handleChangeAdvanceSearch = allValues => {
    getListAdvancedSearch({ ...conditionSearch, ...allValues })
  }

  const columns = [
    {
      title: 'STT',
      align: 'center',
      width: 20,
      key: 'stt',
      render: (value, record, index) => <>{index + 1}</>
    },
    {
      title: 'Hộp số',
      key: 'Title',
      align: 'center',
      dataIndex: 'Gear',
      width: '5%',
      render: value => (
        <>
          <Tooltip title={`Hộp số ${value}`} color="#2a2a2a">
            <div>{value}</div>
          </Tooltip>
        </>
      )
    },
    {
      title: (
        <>
          <div className="font-weight-bold">Hồ sơ số</div>
          <div className="font-weight-bold">
            <i>Mã hồ sơ</i>
          </div>
        </>
      ),
      dataIndex: 'FileNo',
      width: '5%',
      render: (value, record) => (
        <>
          <Tooltip title={`Mã hồ sơ: ${record?.FileCode}`} color="#2a2a2a">
            <div>{record?.FileNo}</div>
            <div>
              <i>{record?.FileCode}</i>
            </div>
          </Tooltip>
        </>
      )
    },
    {
      title: 'Tiêu đề hồ sơ',
      dataIndex: 'Title',
      width: '50%',
      key: 'Title',
      className: 'title',
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    },
    {
      title: (
        <>
          <Tooltip title="Thời gian bắt đầu - kết thúc" color="#2a2a2a">
            <div className="font-weight-bold">Thời gian</div>
          </Tooltip>
        </>
      ),
      width: 105,
      key: 'StartDate',
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
      title: (
        <>
          <Tooltip title="Số lượng văn bản" color="#2a2a2a">
            <div className="font-weight-bold">SLVB</div>
          </Tooltip>
        </>
      ),
      dataIndex: 'TotalDoc',
      key: 'TotalDoc',
      align: 'center',
      width: 90
    },
    {
      title: 'Số tờ',
      dataIndex: 'PiecesOfPaper',
      key: 'PiecesOfPaper',
      align: 'center',
      width: 150
    },
    {
      title: (
        <Tooltip title="Chế độ sử dụng" color="#2a2a2a">
          <div className="font-weight-bold">Chế độ SD</div>
        </Tooltip>
      ),
      dataIndex: 'Rights',
      key: 'Rights',
      width: '10%',
      render: value => {
        return <>{value === 1 ? 'Hạn chế' : value === 2 ? 'Không hạn chế' : ''}</>
      }
    },
    {
      title: (
        <>
          <Tooltip title="Thời hạn bảo quản" color="#2a2a2a">
            <div className="font-weight-bold">T.han bảo quản</div>
          </Tooltip>
        </>
      ),
      dataIndex: 'StorageTimeType',
      key: 'StorageTimeType',
      width: '10%',
      render: value => {
        return <>{value === 1 ? 'Vĩnh viễn' : value === 2 ? 'Có thời hạn' : ''}</>
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'Description',
      width: '30%',
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    }
  ]

  return (
    <FileCatalougeWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>
          <a href="">Báo cáo thống kê</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a>Mục lục hồ sơ phông Lưu trữ</a>
        </Breadcrumb.Item>
      </BreadcrumbWrapper>
      <Row justify="start" className="mb-3">
        <FileCatalougeAdvanceSearchWrapper
          conditionSearch={conditionSearch}
          handleChangeAdvanceSearch={handleChangeAdvanceSearch}
        />
      </Row>
      <TableHeadingWrapper>
        <div>
          <div className="table-heading">Mục lục hồ sơ phông lưu trữ</div>
          <div>Số bản ghi: {paginationData.TotalSearch} </div>
        </div>
        <Space>
          <ButtonCustom
            text="Xuất File Mục lục"
            color="var(--color-primary)"
            icon={<Icon name="download" size={20} className="mx-auto" />}
            size={15}
            onClick={() => {
              exportFileCatalogue()
            }}
          />
          <ButtonCustom
            text="Xuất File Thống kê số ĐVBQ"
            color="var(--color-primary)"
            icon={<Icon name="download" size={20} className="mx-auto" />}
            size={15}
            onClick={() => {
              exportFileCatalogueDVBQ()
            }}
          />
        </Space>
      </TableHeadingWrapper>

      <TableStyledWrapper
        loading={isLoading}
        columns={columns}
        dataSource={dataDocument}
        key={columns.key}
        pagination={{
          pageSize: paginationData.PageSize,
          current: paginationData.CurrentPage,
          total: paginationData.TotalSearch,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          onChange: (page, pageSize) => handleChangePage(page, pageSize)
        }}
      />
    </FileCatalougeWrapper>
  )
}

FileCatalouge.propTypes = {}

export default FileCatalouge
