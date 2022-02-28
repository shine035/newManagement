import React, { useState, useEffect } from 'react'
import FadeIn from 'react-fade-in'
import { Space, Button, Tooltip, Empty } from 'antd'
import { useToast } from '@chakra-ui/react'
import Icon from 'src/components/Icon/Icon'
import { useDispatch } from 'react-redux'

// Store Redux
import actions from 'src/store/common/actions'

// API Service
import HomePageService from 'src/api/HomePageService'
import FileService from 'src/api/FileService'
import TicketService from 'src/api/TicketService'

// Component
import { ModalDenyReception } from 'src/components/Modals/component/ModalDenyReception'
import { ModalConfirmReception } from 'src/components/Modals/component/ModalConfirmReception'
import { ModalReceptionTicket } from 'src/pages/Ticket/ListTicket/components/ModalReceptionTicket'
import { ModalDenyReceptionTicket } from 'src/pages/Ticket/ListTicket/components/ModalDenyReceptionTicket'
import TruncateText from 'src/components/TruncateText'
import ModalDetailFile from './components/ModalDetailFile'
import ModalUpdateDocument from './components/ModalUpdateDocument'

// Styled Component
import { HomeWrapper, TableWrapper, NewDataPartition } from './styled/HomeWrapper'

export default function Home() {
  const toast = useToast()
  const dispatch = useDispatch()

  // State
  const [listNewFile, setListNewFile] = useState()
  const [listUpdatedFile, setListUpdatedFile] = useState()
  const [listApproveDocument, setListApproveDocument] = useState()
  const [isExpandNewFile, setIsExpandNewFile] = useState(true)
  const [isExpandUpdateFile, setIsExpandUpdateFile] = useState(true)
  const [isExpandTicket, setIsExpandTicket] = useState(true)
  const [fileSelected, setFileSelected] = useState('')
  const [ticketDetail, setTicketDetail] = useState({})
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  })

  // State Loading
  const [isLoading, setIsLoading] = useState(false)

  // State Modal
  const [isOpenModalConfirmReception, setIsOpenModalConfirmReception] = useState(false)
  const [isOpenModalDenyReception, setIsOpenModalDenyReception] = useState(false)
  const [isOpenModalDetailFile, setIsOpenModalDetailFile] = useState(false)
  const [isOpenModalUpdateDocument, setIsOpenModalUpdateDocument] = useState(false)
  // const [isOpenFormDataMining, setIsOpenFormDataMining] = useState(false)
  const [isOpenModalConfirmReceptionTicket, setIsOpenModalConfirmReceptionTicket] = useState(false)
  const [isOpenModalDenyReceptionTicket, setIsOpenModalDenyReceptionTicket] = useState(false)

  const columnsNewFile = [
    {
      title: 'STT',
      key: 'key',
      align: 'center',
      width: '3%',
      render: (value, record, index) => index + 1
    },
    {
      title: 'Hồ sơ số (ĐVBQ)',
      dataIndex: 'FileNo',
      key: 'FileNo',
      width: '15%'
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'Title',
      key: 'Title',
      width: '72%',
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      render: (value, record) => {
        return (
          <Space size="small">
            <Tooltip title="Tiếp nhận" color="#2a2a2a">
              <Button
                type="link"
                size="small"
                icon={<Icon name="thumb_up_alt" size={24} color="var(--color-primary)" className="mx-auto" />}
                onClick={e => {
                  e.stopPropagation()
                  setFileSelected(record)
                  setIsOpenModalConfirmReception(true)
                }}
              />
            </Tooltip>

            <Tooltip title="Từ chối" color="#2a2a2a">
              <Button
                type="link"
                size="small"
                icon={<Icon name="remove_circle_outline" size={24} color="red" className="mx-auto" />}
                onClick={e => {
                  e.stopPropagation()
                  setFileSelected(record)
                  setIsOpenModalDenyReception(true)
                }}
              />
            </Tooltip>
          </Space>
        )
      }
    }
  ]

  const columnsUpdatedFile = [
    {
      title: 'STT',
      key: 'key',
      align: 'center',
      width: '3%',
      render: (value, record, index) => index + 1
    },
    {
      title: 'Hồ sơ số (ĐVBQ)',
      dataIndex: 'FileNo',
      key: 'FileNo',
      width: '15%'
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'Title',
      key: 'Title',
      width: '72%',
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      render: record => (
        <Space size="small">
          <Tooltip title="Chi tiết" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="info" size={24} color="var(--color-primary)" className="mx-auto" />}
              onClick={e => {
                e.stopPropagation()
                setFileSelected(record)
                setIsOpenModalUpdateDocument(true)
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const columnsApproveDocument = [
    {
      title: 'STT',
      key: 'key',
      align: 'center',
      width: '3%',
      render: (value, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>
    },
    {
      title: 'Người tạo',
      dataIndex: 'CreateUser',
      key: 'CreateUser',
      width: '15%'
    },
    {
      title: 'Tên Tài liệu',
      dataIndex: 'Title',
      key: 'Title',
      width: '72%',
      render: value => (
        <TruncateText maxLine={2} content={value}>
          {value}
        </TruncateText>
      )
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      render: record => (
        <Space size="small">
          <Tooltip title="Đồng ý" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="thumb_up_alt" size={24} color="var(--color-primary)" className="mx-auto" />}
              onClick={e => {
                e.stopPropagation()
                setTicketDetail(record)
                setIsOpenModalConfirmReceptionTicket(true)
              }}
            />
          </Tooltip>

          <Tooltip title="Từ chối" color="#2a2a2a">
            <Button
              type="link"
              size="small"
              icon={<Icon name="remove_circle_outline" size={24} color="red" className="mx-auto" />}
              onClick={e => {
                e.stopPropagation()
                setTicketDetail(record)
                setIsOpenModalDenyReceptionTicket(true)
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const getListFileFromEgov = () => {
    setIsLoading(true)
    HomePageService.getFileListFromEGov()
      .then(res => {
        if (!res.isError && !res.Status) {
          setListNewFile(res?.Object?.filter(item => item?.StatusID === 1))
          setListUpdatedFile(res?.Object?.filter(item => item?.StatusID === 2))
        }
      })
      .finally(() => setIsLoading(false))
  }

  const getListTicketByStatus = () => {
    setIsLoading(true)
    HomePageService.getTicketListByStatus()
      .then(res => {
        if (!res.isError && !res.Status) {
          setListApproveDocument(res?.Object)
        }
      })
      .finally(() => setIsLoading(false))
  }

  const onReceiveFile = () => {
    const body = { ObjectGuildList: [fileSelected?.ObjectGuid] }
    FileService.receive(body).then(res => {
      if (res.isError) return
      toast({
        title: `Hồ sơ được tiếp nhân thành công`,
        status: 'success',
        position: 'bottom-right',
        duration: 2000,
        isClosable: true
      })
      getListFileFromEgov()
    })
    if (!isOpenModalDetailFile) {
      setIsOpenModalConfirmReception(false)
    }
    setIsOpenModalDetailFile(false)
  }

  const onRejectFile = content => {
    const body = {
      ListObjectGuidFileSync: [{ ObjectGuid: fileSelected?.ObjectGuid, FileNo: fileSelected?.FileNo }],
      Content: content.Content
    }
    FileService.rejectList(body).then(res => {
      if (res.isError) return
      toast({
        title: `Hồ sơ đã bị từ chối`,
        status: 'success',
        position: 'bottom-right',
        duration: 2000,
        isClosable: true
      })
      getListFileFromEgov()
    })
    if (!isOpenModalDetailFile) {
      setIsOpenModalDenyReception(false)
    }
    setIsOpenModalDetailFile(false)
  }

  const receptionTicket = () => {
    setIsLoading(true)
    const body = {
      TicketList: [{ ObjectGuid: ticketDetail?.ObjectGuid, Content: ticketDetail?.Title }]
    }
    TicketService.approve(body)
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Phiếu được lưu kho',
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        setTicketDetail({})
        getListTicketByStatus()
      })
      .finally(() => setIsLoading(false))
  }

  const denyReceptionOK = reason => {
    setIsLoading(true)
    const newData = [ticketDetail].map(item => {
      return {
        Content: item?.Title,
        ObjectGuid: item?.ObjectGuid
      }
    })

    const newbody = {
      reasonReject: reason.Content,
      TicketList: newData
    }
    TicketService.reject(newbody)
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Phiếu đã bị từ chối',
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        setIsOpenModalDenyReceptionTicket(false)
        setTicketDetail({})
        getListTicketByStatus()
      })
      .finally(() => setIsLoading(false))
  }

  const handleTableChange = page => {
    setPagination(page)
  }

  useEffect(() => {
    return () => dispatch(actions.setCloseModalDataMining())
  }, [])

  useEffect(() => {
    Promise.all([getListFileFromEgov(), getListTicketByStatus()])
  }, [])

  return (
    <HomeWrapper>
      <NewDataPartition>
        <div className="new-data-heading">
          <div className="title">Hồ sơ mới: {!!listNewFile && listNewFile.length}</div>
          <FadeIn>
            <Icon
              className="icon-cursor"
              name={isExpandNewFile ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
              size={24}
              onClick={() => {
                setIsExpandNewFile(!isExpandNewFile)
              }}
            />
          </FadeIn>
        </div>
        {isExpandNewFile &&
          !!listNewFile &&
          (listNewFile.length ? (
            <FadeIn>
              <TableWrapper
                loading={isLoading}
                columns={columnsNewFile}
                dataSource={listNewFile}
                pagination={false}
                onRow={record => {
                  return {
                    onClick: () => {
                      setFileSelected(record)
                      setIsOpenModalDetailFile(true)
                    }
                  }
                }}
              />
            </FadeIn>
          ) : (
            <FadeIn>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có nội dung mới!" />
            </FadeIn>
          ))}
      </NewDataPartition>
      <NewDataPartition>
        <div className="new-data-heading">
          <div className="title">Hồ sơ được cập nhật: {!!listUpdatedFile && listUpdatedFile.length}</div>
          <FadeIn>
            <Icon
              className="icon-cursor"
              name={isExpandUpdateFile ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
              size={24}
              onClick={() => setIsExpandUpdateFile(!isExpandUpdateFile)}
            />
          </FadeIn>
        </div>
        {isExpandUpdateFile &&
          !!listUpdatedFile &&
          (listUpdatedFile.length ? (
            <FadeIn>
              <TableWrapper
                loading={isLoading}
                columns={columnsUpdatedFile}
                dataSource={listUpdatedFile}
                pagination={false}
                onRow={record => {
                  return {
                    onClick: () => {
                      setFileSelected(record)
                      setIsOpenModalUpdateDocument(true)
                    }
                  }
                }}
              />
            </FadeIn>
          ) : (
            <FadeIn>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có nội dung mới!" />
            </FadeIn>
          ))}
      </NewDataPartition>
      <NewDataPartition>
        <div className="new-data-heading">
          <div className="title">Phiếu cần duyệt: {!!listApproveDocument && listApproveDocument.length}</div>
          <FadeIn>
            <Icon
              className="icon-cursor"
              name={isExpandTicket ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
              size={24}
              onClick={() => setIsExpandTicket(!isExpandTicket)}
            />
          </FadeIn>
        </div>
        {isExpandTicket &&
          !!listApproveDocument &&
          (listApproveDocument.length ? (
            <FadeIn>
              <TableWrapper
                loading={isLoading}
                columns={columnsApproveDocument}
                dataSource={listApproveDocument}
                pagination={{ current: pagination?.current, pageSize: pagination?.pageSize }}
                onChange={page => handleTableChange(page)}
                onRow={record => {
                  return {
                    onClick: () => {
                      dispatch(actions.setTicketObjectGuid(record?.ObjectGuid))
                      dispatch(actions.setOpenModalDataMining())
                    }
                  }
                }}
              />
            </FadeIn>
          ) : (
            <FadeIn>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có nội dung mới!" />
            </FadeIn>
          ))}
      </NewDataPartition>
      {/* Modals */}
      <ModalConfirmReception
        visible={isOpenModalConfirmReception}
        type="primary"
        data={fileSelected}
        onOk={() => onReceiveFile()}
        onCancel={() => setIsOpenModalConfirmReception(false)}
      />
      <ModalDenyReception
        visible={isOpenModalDenyReception}
        onOk={onRejectFile}
        onCancel={() => setIsOpenModalDenyReception(false)}
      />
      <ModalDetailFile
        visible={isOpenModalDetailFile}
        fileObjectGuid={fileSelected?.ObjectGuid}
        onReceive={() => onReceiveFile()}
        onReject={onRejectFile}
        onCancel={() => setIsOpenModalDetailFile(false)}
      />
      <ModalUpdateDocument
        visible={isOpenModalUpdateDocument}
        fileObjectGuid={fileSelected?.ObjectGuid}
        onReceive={() => onReceiveFile()}
        onReject={onRejectFile}
        onCancel={() => setIsOpenModalUpdateDocument(false)}
      />
      <ModalReceptionTicket
        visible={isOpenModalConfirmReceptionTicket}
        type="primary"
        data={ticketDetail}
        onOk={() => {
          setIsOpenModalConfirmReceptionTicket(false)
          receptionTicket()
        }}
        onCancel={() => setIsOpenModalConfirmReceptionTicket(false)}
      />
      <ModalDenyReceptionTicket
        visible={isOpenModalDenyReceptionTicket}
        type="primary"
        data={ticketDetail}
        onOk={denyReceptionOK}
        onCancel={() => setIsOpenModalDenyReceptionTicket(false)}
      />
    </HomeWrapper>
  )
}
