import React, { useState, useEffect } from 'react'
import { Row, Breadcrumb, Space } from 'antd'
import { exportExcelURL } from 'src/helpers'
// API Service
import CalalogueService from 'src/api/CalalogueService'

// Components
import ButtonCustom from 'src/components/Button/Button'
import Icon from 'src/components/Icon/Icon'

// style
import {
  DocumentCatalougeWrapper,
  BreadcrumbWrapper,
  TableHeadingWrapper,
  TableStyledWrapper
} from 'src/pages/Report/styled/DocumentCatalougeWrapper'

import StorageFileKeywordAdvanceSearchWrapper from './StorageFileKeywordAdvanceSearch'

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
  EndDate: null,
  DataType: 1
}
function DocumentCatalouge() {
  // State
  const [storageFileKeyword, setStorageFileKeyword] = useState([])
  const [documentKeyword, setDocumentKeywordSearch] = useState([])
  const [keyword, setKeyword] = useState([])
  const [conditionSearch, setConditionSearch] = useState(initialSearch)
  const [paginationData, setPaginationData] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TotalSearch: 0
  })

  // State Modal
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    storageFileKeywordSearch(conditionSearch)
  }, [])

  const storageFileKeywordSearch = body => {
    setConditionSearch(body)
    setIsLoading(true)
    CalalogueService.storageFileKeywordSearch(body)
      .then(res => {
        if (res.isError) return
        setStorageFileKeyword(res.Object?.Data)
        setPaginationData({
          CurrentPage: res.Object.CurrentPage,
          PageSize: res.Object.PageSize,
          TotalSearch: res.Object.TotalSearch
        })
      })
      .finally(() => setIsLoading(false))
  }

  const documentKeywordSearch = body => {
    setConditionSearch(body)
    setIsLoading(true)
    CalalogueService.documentKeywordSearch(body)
      .then(res => {
        if (res.isError) return
        setDocumentKeywordSearch(res.Object?.Data)
        setPaginationData({
          CurrentPage: res.Object.CurrentPage,
          PageSize: res.Object.PageSize,
          TotalSearch: res.Object.TotalSearch
        })
      })
      .finally(() => setIsLoading(false))
  }

  const keywordSearch = body => {
    setConditionSearch(body)
    setIsLoading(true)
    CalalogueService.keywordSearch(body)
      .then(res => {
        if (res.isError) return
        setKeyword(res.Object?.Data)
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
      storageFileKeywordSearch({
        ...conditionSearch,
        PageSize: pageSize,
        CurrentPage: page
      })
    } else if (conditionSearch.DataType === 2) {
      documentKeywordSearch({
        ...conditionSearch,
        PageSize: pageSize,
        CurrentPage: page
      })
    } else if (conditionSearch.DataType === 3) {
      keywordSearch({
        ...conditionSearch,
        PageSize: pageSize,
        CurrentPage: page
      })
    }
  }

  const exportStorageFileKeywordSearch = () => {
    setIsLoading(true)
    CalalogueService.exportStorageFileKeywordSearch({
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

  const exportDocumentKeywordSearch = () => {
    setIsLoading(true)
    CalalogueService.exportDocumentKeywordSearch({
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

  const exportKeywordSearch = () => {
    setIsLoading(true)
    CalalogueService.exportKeywordSearch({
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
      storageFileKeywordSearch({ ...conditionSearch, ...allValues })
    } else if (allValues.DataType === 2) {
      documentKeywordSearch({ ...conditionSearch, ...allValues })
    } else if (allValues.DataType === 3) {
      keywordSearch({ ...conditionSearch, ...allValues })
    }
  }

  const columnsStorageFileKeyword = [
    {
      title: 'STT',
      align: 'center',
      width: 50,
      key: 'stt',
      render: (value, record, index) => <>{index + 1}</>
    },
    {
      title: 'Vấn đề chính',
      dataIndex: 'KeywordIssue',
      key: 'KeywordIssue',
      align: 'left',
      width: '45%'
    },
    {
      title: 'Địa danh',
      dataIndex: 'KeywordPlace',
      key: 'KeywordPlace',
      align: 'left',
      width: '25%'
    },
    {
      title: 'Sự kiện',
      dataIndex: 'KeywordEvent',
      key: 'KeywordEvent',
      align: 'left',
      width: '25%'
    }
  ]
  const columnsDocumentKeywordSearch = [
    {
      title: 'STT',
      align: 'center',
      width: 50,
      key: 'stt',
      render: (value, record, index) => <>{index + 1}</>
    },
    {
      title: 'Vấn đề chính',
      dataIndex: 'KeywordIssue',
      key: 'KeywordIssue',
      align: 'left',
      width: '45%'
    },
    {
      title: 'Địa danh',
      dataIndex: 'KeywordPlace',
      key: 'KeywordPlace',
      align: 'left',
      width: '25%'
    },
    {
      title: 'Sự kiện',
      dataIndex: 'KeywordEvent',
      key: 'KeywordEvent',
      align: 'left',
      width: '25%'
    }
  ]

  const columnsKeywordSearch = [
    {
      title: 'STT',
      align: 'center',
      width: 50,
      key: 'stt',
      render: (value, record, index) => <>{index + 1}</>
    },
    {
      title: 'Giá trị',
      render: value => <>{value}</>,
      className: 'title',
      width: '95%'
    }
  ]

  return (
    <DocumentCatalougeWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>
          <a href="">Báo cáo thống kê</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a>Danh sách từ khóa </a>
        </Breadcrumb.Item>
      </BreadcrumbWrapper>
      <Row justify="start" className="mb-3">
        <StorageFileKeywordAdvanceSearchWrapper
          conditionSearch={conditionSearch}
          handleChangeAdvanceSearch={handleChangeAdvanceSearch}
        />
      </Row>
      <TableHeadingWrapper>
        <div>
          <div className="table-heading">Danh sách từ khóa </div>
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
                exportStorageFileKeywordSearch()
              }}
            />
          ) : conditionSearch.DataType === 2 ? (
            <ButtonCustom
              text="Xuất File"
              color="var(--color-primary)"
              icon={<Icon name="download" size={20} className="mx-auto" />}
              size={15}
              onClick={() => {
                exportDocumentKeywordSearch()
              }}
            />
          ) : (
            <ButtonCustom
              text="Xuất File"
              color="var(--color-primary)"
              icon={<Icon name="download" size={20} className="mx-auto" />}
              size={15}
              onClick={() => {
                exportKeywordSearch()
              }}
            />
          )}
        </Space>
      </TableHeadingWrapper>
      <TableStyledWrapper
        loading={isLoading}
        columns={
          conditionSearch.DataType === 1
            ? columnsStorageFileKeyword
            : conditionSearch.DataType === 2
            ? columnsDocumentKeywordSearch
            : columnsKeywordSearch
        }
        dataSource={
          conditionSearch.DataType === 1
            ? storageFileKeyword
            : conditionSearch.DataType === 2
            ? documentKeyword
            : keyword
        }
        key={columnsStorageFileKeyword.key}
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
