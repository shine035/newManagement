import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Empty, Space, Spin, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import FadeIn from 'react-fade-in'
import { useToast } from '@chakra-ui/toast'

// API Service
import HomePageService from 'src/api/HomePageService'
import FileService from 'src/api/FileService'
// import DocumentService from 'src/api/DocumentService'

// Component
import Icon from 'src/components/Icon/Icon'
import { ModalConfirmReception } from 'src/components/Modals/component/ModalConfirmReception'
import { ModalDenyReception } from 'src/components/Modals/component/ModalDenyReception'
import ModalDetailDocument from 'src/components/Modals/component/ModalDetailDocument'
import DocumentService from 'src/api/DocumentService'
import { ModalDenyUpdate } from 'src/components/Modals/component/ModalDenyUpdate'
import MyPagination from './MyPagination'

// Styled Component
import { ModalWrapper, NewDataPartition, RowWrapper, TableWrapper, SearchWrapper } from '../styled/ModalWrapper'

const ModalUpdateDocument = props => {
  const toast = useToast()

  const { onCancel, className, visible, type, color, width, fileObjectGuid } = props

  // State
  const [infoFile, setInfoFile] = useState({})
  const [documentObjectGuid, setDocumentObjectGuid] = useState('')
  const [newDocument, setNewDocument] = useState([])
  const [updateDocument, setUpdateDocument] = useState([])
  const [cancelDocument, setCancelDocument] = useState([])
  const [listDocument, setListDocument] = useState([])

  // State Loading
  const [isLoading, setIsLoading] = useState(false)

  // State Modal
  const [isOpenModalConfirmReception, setIsOpenModalConfirmReception] = useState(false)
  const [isOpenModalDenyReception, setIsOpenModalDenyReception] = useState(false)
  const [isOpenModalDetailDocument, setIsOpenModalDetailDocument] = useState(false)
  const [isOpenModalDenyUpdate, setIsOpenModalDenyUpdate] = useState(false)

  // State ConditionSearch
  const [newConditionSearch, setNewConditionSearch] = useState({})
  const [updateConditionSearch, setUpdateConditionSearch] = useState({})
  const [cancelConditionSearch, setCancelConditionSearch] = useState({})

  const [paginationNewDocument, setPaginationNewDocument] = useState({ CurrentPage: 1, PageSize: 3, TotalSearch: 0 })
  const [paginationUpdateDocument, setPaginationUpdateDocument] = useState({
    CurrentPage: 1,
    PageSize: 3,
    TotalSearch: 0
  })
  const [paginationCancelDocument, setPaginationCancelDocument] = useState({
    CurrentPage: 1,
    PageSize: 3,
    TotalSearch: 0
  })

  const columnsNewDocument = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      width: '3%',
      render: (value, record, index) => (
        <>{(paginationNewDocument?.CurrentPage - 1) * paginationNewDocument?.PageSize + index + 1}</>
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'Subject',
      key: 'Subject',
      width: '65%'
    },
    {
      title: 'Số và ký hiệu',
      dataIndex: 'FileNotation',
      key: 'FileNotation',
      width: '25%'
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '80',
      render: record => (
        <Space size="small">
          <Tooltip title="Xem chi tiết" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="remove_red_eye" size={17} color="var(--color-primary)" className="mx-auto" />}
              onClick={() => {
                setDocumentObjectGuid(record?.ObjectGuid)
                setListDocument([record?.ObjectGuid])
                setIsOpenModalDetailDocument(true)
              }}
            />
          </Tooltip>

          <Tooltip title="Trả lại" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="close" size={17} color="red" className="mx-auto" />}
              onClick={() => {
                setDocumentObjectGuid(record?.ObjectGuid)
                setIsOpenModalDenyReception(true)
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const columnsUpdateDocument = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      width: '3%',
      render: (value, record, index) => (
        <>{(paginationUpdateDocument?.CurrentPage - 1) * paginationUpdateDocument?.PageSize + index + 1}</>
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'Subject',
      key: 'Subject',
      width: '65%'
    },
    {
      title: 'Số và ký hiệu',
      dataIndex: 'FileNotation',
      key: 'FileNotation',
      width: '25%'
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '80',
      render: record => (
        <Space size="small">
          <Tooltip title="Xem chi tiết" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="remove_red_eye" size={17} color="var(--color-primary)" className="mx-auto" />}
              onClick={() => {
                setDocumentObjectGuid(record?.ObjectGuid)
                setIsOpenModalDetailDocument(true)
              }}
            />
          </Tooltip>

          <Tooltip title="Trả lại" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="close" size={17} color="red" className="mx-auto" />}
              onClick={() => {
                setDocumentObjectGuid(record?.ObjectGuid)
                setIsOpenModalDenyUpdate(true)
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const columnsCancelDocument = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      width: '3%',
      render: (value, record, index) => (
        <>{(paginationCancelDocument?.CurrentPage - 1) * paginationCancelDocument?.PageSize + index + 1}</>
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'Subject',
      key: 'Subject',
      width: '65%'
    },
    {
      title: 'Số và ký hiệu',
      dataIndex: 'FileNotation',
      key: 'FileNotation',
      width: '25%'
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '80',
      render: record => (
        <Space size="small">
          <Tooltip title="Xem chi tiết" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="remove_red_eye" size={17} color="var(--color-primary)" className="mx-auto" />}
              onClick={() => {
                setDocumentObjectGuid(record?.ObjectGuid)
                setIsOpenModalDetailDocument(true)
              }}
            />
          </Tooltip>

          <Tooltip title="Từ chối" color="#2a2a2a">
            <Button type="link" size="small" icon={<Icon name="close" size={17} color="red" className="mx-auto" />} />
          </Tooltip>
        </Space>
      )
    }
  ]

  const getFileByObjectGuid = () => {
    FileService.getOne(fileObjectGuid).then(res => {
      if (!res.isError && !res.Status) {
        setInfoFile(res?.Object)
      }
    })
  }

  const getNewListDocumentFromEgov = newSearch => {
    setNewConditionSearch(newSearch)
    HomePageService.getDocumentListFromEGov(newSearch).then(res => {
      if (!res?.isError && !res?.Status) {
        setNewDocument(res?.Object?.Data)
        setPaginationNewDocument({
          CurrentPage: res?.Object?.CurrentPage,
          PageSize: res?.Object?.PageSize,
          TotalSearch: res?.Object?.TotalSearch
        })
      }
    })
  }

  const getUpdateListDocumentFromEgov = updateSearch => {
    setUpdateConditionSearch(updateSearch)
    HomePageService.getDocumentListFromEGov(updateSearch).then(res => {
      if (!res?.isError && !res?.Status) {
        setUpdateDocument(res.Object?.Data)
        setPaginationUpdateDocument({
          CurrentPage: res?.Object?.CurrentPage,
          PageSize: res?.Object?.PageSize,
          TotalSearch: res?.Object?.TotalSearch
        })
      }
    })
  }

  const getCancelListDocumentFromEgov = cancelSearch => {
    setCancelConditionSearch(cancelSearch)
    HomePageService.getDocumentListFromEGov(cancelSearch).then(res => {
      if (!res?.isError && !res?.Status) {
        setCancelDocument(res?.Object?.Data)
        setPaginationCancelDocument({
          CurrentPage: res?.Object?.CurrentPage,
          PageSize: res?.Object?.PageSize,
          TotalSearch: res?.Object?.TotalSearch
        })
      }
    })
  }

  const handleChangeEasySearchNewDocument = value => {
    const newSearch = {
      ...newConditionSearch,
      TextSearch: value
    }
    getNewListDocumentFromEgov(newSearch)
  }

  const handleChangeEasySearchUpdateDocument = value => {
    const newSearch = {
      ...updateConditionSearch,
      TextSearch: value
    }
    getUpdateListDocumentFromEgov(newSearch)
  }

  const handleChangeEasySearchCancelDocument = value => {
    const newSearch = {
      ...cancelConditionSearch,
      TextSearch: value
    }
    getCancelListDocumentFromEgov(newSearch)
  }

  const handleChangePageNewDocument = page => {
    const newSearch = {
      ...newConditionSearch,
      CurrentPage: page
    }
    getNewListDocumentFromEgov(newSearch)
  }

  const handleChangePageUpdateDocument = page => {
    const updateSearch = {
      ...updateConditionSearch,
      CurrentPage: page
    }
    getUpdateListDocumentFromEgov(updateSearch)
  }

  const handleChangePageCancelDocument = page => {
    const cancelSearch = {
      ...cancelConditionSearch,
      CurrentPage: page
    }
    getCancelListDocumentFromEgov(cancelSearch)
  }

  const getListDocument = () => {
    const listNew = newDocument.map(item => item?.ObjectGuid)
    const listUpdate = updateDocument.map(item => item?.ObjectGuid)
    const listCancel = cancelDocument.map(item => item?.ObjectGuid)

    setListDocument(listNew.concat(listUpdate, listCancel))
  }

  const onReceiveDocument = () => {
    if (listDocument.length) {
      setIsLoading(true)
      const body = {
        FileObjectGuid: fileObjectGuid,
        ListObjectGuidDocSync: listDocument
      }
      DocumentService.receive(body)
        .then(res => {
          if (res.isError) {
            setIsLoading(false)
            setIsOpenModalConfirmReception(false)
          } else {
            toast({
              title: `Tài liệu được tiếp nhân thành công`,
              status: 'success',
              position: 'bottom-right',
              duration: 2000,
              isClosable: true
            })
            setIsOpenModalConfirmReception(false)
            Promise.all([
              getNewListDocumentFromEgov(newConditionSearch),
              getUpdateListDocumentFromEgov(updateConditionSearch),
              getCancelListDocumentFromEgov(cancelConditionSearch)
            ])
          }
        })
        .finally(() => setIsLoading(false))
    }
  }

  const onRejectDocument = content => {
    setIsLoading(true)

    const body = {
      ObjectGuid: documentObjectGuid,
      Content: content.Content
    }
    DocumentService.reject(body)
      .then(res => {
        if (res.isError) {
          setIsLoading(false)
          setIsOpenModalDenyReception(false)
        } else {
          toast({
            title: `Tài liệu đã bị từ chối`,
            status: 'success',
            position: 'bottom-right',
            duration: 2000,
            isClosable: true
          })
          setIsOpenModalDenyReception(false)
          Promise.all([
            getNewListDocumentFromEgov(newConditionSearch),
            getUpdateListDocumentFromEgov(updateConditionSearch),
            getCancelListDocumentFromEgov(cancelConditionSearch)
          ])
        }
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (!visible) return
    setIsLoading(true)
    if (fileObjectGuid) {
      const newSearch = {
        FileObjectGuid: fileObjectGuid,
        TextSearch: '',
        SyncType: 1,
        CurrentPage: 1
      }
      const updateSearch = {
        FileObjectGuid: fileObjectGuid,
        TextSearch: '',
        SyncType: 2,
        CurrentPage: 1
      }
      const cancelSearch = {
        FileObjectGuid: fileObjectGuid,
        TextSearch: '',
        SyncType: 3,
        CurrentPage: 1
      }
      Promise.all([
        getFileByObjectGuid(),
        getNewListDocumentFromEgov(newSearch),
        getUpdateListDocumentFromEgov(updateSearch),
        getCancelListDocumentFromEgov(cancelSearch)
      ]).finally(() => setIsLoading(false))
    }
  }, [visible, fileObjectGuid])

  return (
    <ModalWrapper
      title="Cập nhật hồ sơ"
      visible={visible}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      className={className}
      destroyOnClose
      footer={[
        <div className="d-flex justify-content-end" key={1}>
          <Space size="small">
            <Button type="danger" key="deny" onClick={() => setIsOpenModalDenyReception(true)}>
              Từ chối
            </Button>
            <Button
              type="primary"
              key="reception"
              onClick={() => {
                getListDocument()
                setIsOpenModalConfirmReception(true)
              }}
            >
              Tiếp nhận
            </Button>
            <Button type="secondary" key="back" onClick={onCancel}>
              Đóng
            </Button>
          </Space>
        </div>
      ]}
    >
      <Spin size="small" spinning={isLoading}>
        <RowWrapper gutter={20}>
          <Col span={6}>
            <b>Tiêu đề hồ sơ:</b>
          </Col>
          <Col span={18}>
            <span>{infoFile?.Title}</span>
          </Col>
        </RowWrapper>
        <RowWrapper gutter={20}>
          <Col span={6}>
            <b>Mã hồ sơ:</b>
          </Col>
          <Col span={18}>
            <span>{infoFile?.FileCode}</span>
          </Col>
        </RowWrapper>
        <RowWrapper gutter={20}>
          <Col span={6}>
            <b>Số và ký hiệu:</b>
          </Col>
          <Col span={18}>
            <span>{infoFile?.FileNotation}</span>
          </Col>
        </RowWrapper>
        <NewDataPartition>
          <div className="new-data-heading">
            <div className="title">Tài liệu mới: {paginationNewDocument.TotalSearch}</div>
            <SearchWrapper
              placeholder="Tên tài liệu, Số và ký hiệu"
              iconRender={<SearchOutlined style={{ fontSize: '15px' }} />}
              onSearch={value => handleChangeEasySearchNewDocument(value)}
            />
          </div>
          {!!newDocument &&
            (newDocument.length ? (
              <FadeIn>
                <TableWrapper columns={columnsNewDocument} dataSource={newDocument} pagination={false} />
                <MyPagination
                  total={paginationNewDocument?.TotalSearch}
                  current={paginationNewDocument?.CurrentPage}
                  pageSize={paginationNewDocument?.PageSize}
                  handleChangePage={handleChangePageNewDocument}
                />
              </FadeIn>
            ) : (
              <FadeIn>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy dữ liệu!" />
              </FadeIn>
            ))}
        </NewDataPartition>
        <NewDataPartition>
          <div className="new-data-heading">
            <div className="title">Tài liệu cập nhật: {paginationUpdateDocument.TotalSearch}</div>
            <SearchWrapper
              placeholder="Tên tài liệu, Số và ký hiệu"
              iconRender={<SearchOutlined style={{ fontSize: '15px' }} />}
              onSearch={value => handleChangeEasySearchUpdateDocument(value)}
            />
          </div>
          {!!updateDocument &&
            (updateDocument.length ? (
              <FadeIn>
                <TableWrapper columns={columnsUpdateDocument} dataSource={updateDocument} pagination={false} />
                <MyPagination
                  total={paginationUpdateDocument?.TotalSearch}
                  current={paginationUpdateDocument?.CurrentPage}
                  pageSize={paginationUpdateDocument?.PageSize}
                  handleChangePage={handleChangePageUpdateDocument}
                />
              </FadeIn>
            ) : (
              <FadeIn>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy dữ liệu!" />
              </FadeIn>
            ))}
        </NewDataPartition>
        <NewDataPartition>
          <div className="new-data-heading">
            <div className="title">Tài liệu hủy bỏ: {paginationCancelDocument.TotalSearch}</div>
            <SearchWrapper
              placeholder="Tên tài liệu, Số và ký hiệu"
              iconRender={<SearchOutlined style={{ fontSize: '15px' }} />}
              onSearch={value => handleChangeEasySearchCancelDocument(value)}
            />
          </div>
          {!!cancelDocument &&
            (cancelDocument.length ? (
              <FadeIn>
                <TableWrapper columns={columnsCancelDocument} dataSource={cancelDocument} pagination={false} />
                <MyPagination
                  total={paginationCancelDocument?.TotalSearch}
                  current={paginationCancelDocument?.CurrentPage}
                  pageSize={paginationCancelDocument?.PageSize}
                  handleChangePage={handleChangePageCancelDocument}
                />
              </FadeIn>
            ) : (
              <FadeIn>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy dữ liệu!" />
              </FadeIn>
            ))}
        </NewDataPartition>
      </Spin>
      {/* Modals */}
      <ModalConfirmReception
        visible={isOpenModalConfirmReception}
        type="primary"
        data={infoFile}
        onOk={onReceiveDocument}
        onCancel={() => setIsOpenModalConfirmReception(false)}
      />
      <ModalDenyReception
        visible={isOpenModalDenyReception}
        onOk={content => onRejectDocument(content)}
        onCancel={() => setIsOpenModalDenyReception(false)}
      />
      <ModalDenyUpdate
        visible={isOpenModalDenyUpdate}
        onOk={content => onRejectDocument(content)}
        onCancel={() => setIsOpenModalDenyUpdate(false)}
      />
      <ModalDetailDocument
        visible={isOpenModalDetailDocument}
        documentObjectGuid={documentObjectGuid}
        onReceive={onReceiveDocument}
        onReject={content => onRejectDocument(content)}
        onCancel={() => setIsOpenModalDetailDocument(false)}
      />
    </ModalWrapper>
  )
}

ModalUpdateDocument.defaultProps = {
  width: 756,
  className: 'atbd-modal'
}

ModalUpdateDocument.propTypes = {
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  className: PropTypes.string,
  fileObjectGuid: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export default ModalUpdateDocument
