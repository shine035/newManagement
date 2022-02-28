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
  DocumentCatalougeWrapper,
  BreadcrumbWrapper,
  TableHeadingWrapper,
  TableStyledWrapper
} from 'src/pages/Report/styled/DocumentCatalougeWrapper'

import DocumentCatalougeAdvanceSearchWrapper from './DocumentCatalougeAdvanceSearch'

const initialSearch = {
  NationalAssemblyFrom: null,
  NationalAssemblyTo: null,
  CongressMeetingFrom: null,
  CongressMeetingTo: null,
  MeetingFrom: null,
  MeetingTo: null,
  SecurityLevel: null,
  DocStatus: null,
  PageSize: 20,
  CurrentPage: 1,
  StartDate: null,
  EndDate: null,
  DataType: 1
}
function DocumentCatalouge() {
  // State
  const [dataDocument, setDataDocument] = useState([])
  const [dataFilm, setDataFilm] = useState([])
  const [dataPhoto, setDataPhoto] = useState([])
  const [conditionSearch, setConditionSearch] = useState(initialSearch)
  const [paginationData, setPaginationData] = useState({
    CurrentPage: 1,
    PageSize: 20,
    TotalSearch: 0
  })

  // State Modal
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    documentCatalogueSearch(conditionSearch)
  }, [])

  const documentCatalogueSearch = body => {
    setConditionSearch(body)
    setIsLoading(true)
    CalalogueService.documentCatalogueSearch(body)
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

  const photoCatalogueSearch = body => {
    setConditionSearch(body)
    setIsLoading(true)
    CalalogueService.photoCatalogueSearch(body)
      .then(res => {
        if (res.isError) return
        setDataPhoto(res.Object?.Data)
        setPaginationData({
          CurrentPage: res.Object.CurrentPage,
          PageSize: res.Object.PageSize,
          TotalSearch: res.Object.TotalSearch
        })
      })
      .finally(() => setIsLoading(false))
  }

  const filmCatalogueSearch = body => {
    setConditionSearch(body)
    setIsLoading(true)
    CalalogueService.filmCatalogueSearch(body)
      .then(res => {
        if (res.isError) return
        setDataFilm(res.Object?.Data)
        setPaginationData({
          CurrentPage: res.Object.CurrentPage,
          PageSize: res.Object.PageSize,
          TotalSearch: res.Object.TotalSearch
        })
      })
      .finally(() => setIsLoading(false))
  }

  const handleChangePage = (page, pageSize) => {
    if (conditionSearch.DataType === 1) {
      documentCatalogueSearch({
        ...conditionSearch,
        PageSize: pageSize,
        CurrentPage: page
      })
    } else if (conditionSearch.DataType === 2) {
      photoCatalogueSearch({
        ...conditionSearch,
        PageSize: pageSize,
        CurrentPage: page
      })
    } else if (conditionSearch.DataType === 3) {
      filmCatalogueSearch({
        ...conditionSearch,
        PageSize: pageSize,
        CurrentPage: page
      })
    }
  }

  const exportDocumentCatalogue = () => {
    setIsLoading(true)
    CalalogueService.exportDocumentCatalogue({
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

  const exportPhotoCatalogue = () => {
    setIsLoading(true)
    CalalogueService.exportPhotoCatalogue({
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

  const exportFilmCatalogue = () => {
    setIsLoading(true)
    CalalogueService.exportFilmCatalogue({
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
    if (allValues.DataType === 1) {
      documentCatalogueSearch({ ...conditionSearch, ...allValues })
    } else if (allValues.DataType === 2) {
      photoCatalogueSearch({ ...conditionSearch, ...allValues })
    } else if (allValues.DataType === 3) {
      filmCatalogueSearch({ ...conditionSearch, ...allValues })
    }
  }

  const columnsDocument = [
    {
      title: 'STT',
      align: 'center',
      width: 50,
      key: 'stt',
      render: (value, record, index) => <>{index + 1}</>
    },
    {
      title: 'STT tài liệu',
      dataIndex: 'OrdinalNumber',
      className: 'title',
      width: 150
    },
    {
      title: 'Tác giả',
      dataIndex: 'AgencyCreate',
      key: 'AgencyCreate',
      className: 'title',
      width: 150
    },
    {
      title: 'Số ký hiệu',
      dataIndex: 'FileNotation',
      key: 'FileNotation',
      align: 'left',
      width: 180
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
      title: 'Trích yếu nội dung',
      dataIndex: 'Subject',
      key: 'Subject',
      className: 'title',
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    },
    {
      title: 'Số tờ',
      dataIndex: 'PiecesOfPaper',
      key: 'PiecesOfPaper',
      align: 'center',
      width: 90
    },
    {
      title: (
        <Tooltip title="Chế độ sử dụng" color="#2a2a2a">
          <div className="font-weight-bold">Chế độ SD</div>
        </Tooltip>
      ),
      dataIndex: 'Mode',
      key: 'Mode',
      width: 120,
      render: value => {
        return <>{value === 1 ? 'Hạn chế' : value === 2 ? 'Không hạn chế' : ''}</>
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'Description',
      width: 200,
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    }
  ]

  const columnsPhoto = [
    {
      title: 'STT',
      align: 'center',
      width: 50,
      key: 'stt',
      render: (value, record, index) => <>{index + 1}</>
    },
    {
      title: 'Số lưu trữ',
      dataIndex: 'ArchivesNumber',
      key: 'ArchivesNumber',
      className: 'title',
      width: 150
    },
    {
      title: 'Tiêu đề phim/ảnh',
      dataIndex: 'ImageTitle',
      key: 'ImageTitle',
      className: 'title',
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    },
    {
      title: 'File ảnh',
      dataIndex: 'ImagePath',
      key: 'ImagePath',
      width: 300
    },
    {
      title: 'Ghi chú',
      dataIndex: 'Description',
      width: 300,
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    }
  ]

  const columnsFilm = [
    {
      title: 'STT',
      align: 'center',
      width: 50,
      key: 'stt',
      render: (value, record, index) => <>{index + 1}</>
    },
    {
      title: 'Số lưu trữ',
      dataIndex: 'ArchivesNumber',
      key: 'ArchivesNumber',
      className: 'title',
      width: 150
    },
    {
      title: 'Tiêu đề phim/ âm thanh',
      dataIndex: 'MovieTitle',
      key: 'MovieTitle',
      className: 'title',
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    },
    {
      title: 'File phim, âm thanh',
      dataIndex: 'Recorder',
      key: 'Recorder',
      width: 300
    },
    {
      title: 'Ghi chú',
      dataIndex: 'Description',
      width: 300,
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    }
  ]

  return (
    <DocumentCatalougeWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>
          <a href="">Báo cáo thống kê</a>
        </Breadcrumb.Item>
        {conditionSearch.DataType === 1 ? (
          <Breadcrumb.Item>
            <a>Tài liệu giấy</a>
          </Breadcrumb.Item>
        ) : conditionSearch.DataType === 2 ? (
          <Breadcrumb.Item>
            <a>Tài liệu phim ảnh</a>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>
            <a>Tài liệu phim âm thanh</a>
          </Breadcrumb.Item>
        )}
      </BreadcrumbWrapper>
      <Row justify="start" className="mb-3">
        <DocumentCatalougeAdvanceSearchWrapper
          conditionSearch={conditionSearch}
          handleChangeAdvanceSearch={handleChangeAdvanceSearch}
        />
      </Row>
      <TableHeadingWrapper>
        <div>
          <div className="table-heading">Danh sách tài liệu</div>
          <div>Số bản ghi: {paginationData.TotalSearch} </div>
        </div>
        <Space>
          {conditionSearch.DataType === 1 ? (
            <ButtonCustom
              text="Xuất File"
              color="var(--color-primary)"
              icon={<Icon name="download" size={20} className="mx-auto" />}
              size={15}
              onClick={() => {
                exportDocumentCatalogue()
              }}
            />
          ) : conditionSearch.DataType === 2 ? (
            <ButtonCustom
              text="Xuất File"
              color="var(--color-primary)"
              icon={<Icon name="download" size={20} className="mx-auto" />}
              size={15}
              onClick={() => {
                exportPhotoCatalogue()
              }}
            />
          ) : (
            <ButtonCustom
              text="Xuất File"
              color="var(--color-primary)"
              icon={<Icon name="download" size={20} className="mx-auto" />}
              size={15}
              onClick={() => {
                exportFilmCatalogue()
              }}
            />
          )}
        </Space>
      </TableHeadingWrapper>
      <TableStyledWrapper
        loading={isLoading}
        columns={
          conditionSearch.DataType === 1 ? columnsDocument : conditionSearch.DataType === 2 ? columnsPhoto : columnsFilm
        }
        dataSource={
          conditionSearch.DataType === 1 ? dataDocument : conditionSearch.DataType === 2 ? dataPhoto : dataFilm
        }
        key={columnsDocument.key}
        pagination={{
          pageSize: paginationData.PageSize,
          current: paginationData.CurrentPage,
          total: paginationData.TotalSearch,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          locale: { items_per_page: '' },
          onChange: (page, pageSize) => handleChangePage(page, pageSize)
        }}
      />
    </DocumentCatalougeWrapper>
  )
}

DocumentCatalouge.propTypes = {}

export default DocumentCatalouge
