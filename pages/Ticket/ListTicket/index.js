import React, { useEffect, useState } from 'react'
import { Row, Breadcrumb, Button, Space, Tooltip, List } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/react'

// API Service
import TicketService from 'src/api/TicketService'

// Store Redux
import actions from 'src/store/common/actions'

// Ultis
import { formatDateVN } from 'src/helpers/FomatDateTime'
import { exportExcelURL } from 'src/helpers'

// Component
import Icon from 'src/components/Icon/Icon'
import { ModalDenyReceptionTicket } from 'src/pages/Ticket/ListTicket/components/ModalDenyReceptionTicket'
import { ModalReceptionTicket } from 'src/pages/Ticket/ListTicket/components/ModalReceptionTicket'
import { ModalReceptionMoreTicket } from 'src/pages/Ticket/ListTicket/components/ModalReceptionMoreTicket'
import { ModalApproveTicket } from 'src/pages/Ticket/ListTicket/components/ModalApproveTicket'
import { ModalApproveMoreTicket } from 'src/pages/Ticket/ListTicket/components/ModalApproveMoreTicket'
import { ModalDataMiningTicket } from 'src/pages/Ticket/ListTicket/components/ModalDataMiningTicket'

import ButtonCustom from 'src/components/Button/Button'
import TruncateText from 'src/components/TruncateText'
import { FloatActionWrapper } from 'src/components/FloatAction/styled/FloatActionWrapper'
import SystemAdvanceSearchWrapper from './components/SystemAdvanceSearch'

// style
import {
  BreadcrumbWrapper,
  TableHeadingWrapper,
  TableStyledWrapper,
  ListTicketWrapper
} from './styled/ListTicketWrapper'

const initialSearch = {
  TextSearch: '',
  StartDate: '',
  EndDate: '',
  TicketStatus: 0,
  Type: 0,
  PageSize: 20,
  CurrentPage: 1
}

function ListTicket() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { roleTypeID } = useSelector(state => state.common)
  const { user } = useSelector(state => state.auth)
  const [conditionSearch, setConditionSearch] = useState(initialSearch)
  const [isOpenModalConfirmReception, setIsOpenModalConfirmReception] = useState(false)
  const [isOpenModalReceptionMoreTicket, setIsOpenModalReceptionMoreTicket] = useState(false)
  const [isOpenModalConfirmApprove, setIsOpenModalConfirmApprove] = useState(false)
  const [isOpenModalApproveMoreTicket, setIsOpenModalApproveMoreTicket] = useState(false)
  const [isOpenModalDataMiningTicket, setIsOpenModalDataMiningTicket] = useState(false)

  const [isOpenModalDenyReception, setIsOpenModalDenyReception] = useState(false)
  const [dataTicketDetail, setDataTicketDetail] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [listObjectGuid, setListObjectGuid] = useState([])
  const [listChecked, setListChecked] = useState([])

  const [paginationData, setPaginationData] = useState({
    CurrentPage: 1,
    PageSize: 20,
    TotalSearch: 0
  })
  const [listTicket, setListTicket] = useState([])
  useEffect(() => {
    getListTicket(conditionSearch)
  }, [])

  const getListTicket = body => {
    setConditionSearch(body)
    setIsLoading(true)
    TicketService.getListAdvancedSearch(body)
      .then(res => {
        if (res.isError) return
        if (res?.Object) {
          const newData = res?.Object?.Data.map(item => {
            return {
              ...item,
              key: item?.ObjectGuid
            }
          })
          setListTicket(newData)
          setPaginationData({
            CurrentPage: res.Object.CurrentPage,
            PageSize: res.Object.PageSize,
            TotalSearch: res.Object.TotalSearch
          })
        }
      })
      .finally(() => setIsLoading(false))
  }

  const handleChangePage = (page, pageSize) => {
    const body = {
      ...conditionSearch,
      PageSize: pageSize,
      CurrentPage: page
    }
    getListTicket(body)
  }

  const confirmOK = () => {
    if (!listObjectGuid) return
    const newData = listObjectGuid.map(item => {
      return {
        Content: item?.ListReferences[0].DocSubject,
        ObjectGuid: item?.ObjectGuid
      }
    })
    setIsLoading(true)
    const newbody = {
      TicketList: newData
    }
    TicketService.approve(newbody)
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Phiếu được lưu kho',
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        setIsOpenModalConfirmReception(false)
        setIsOpenModalReceptionMoreTicket(false)
        setIsOpenModalApproveMoreTicket(false)
        setIsOpenModalConfirmApprove(false)
        setListObjectGuid([])
        setListChecked([])
        getListTicket({ ...conditionSearch, CurrentPage: 1, PageSize: 20 })
      })
      .finally(() => setIsLoading(false))
  }

  const denyReceptionOK = reason => {
    if (!listObjectGuid) return
    const newData = listObjectGuid.map(item => {
      return {
        Content: item?.ListReferences[0].DocSubject,
        ObjectGuid: item?.ObjectGuid
      }
    })
    setIsLoading(true)
    const newbody = {
      reasonReject: reason.Content,
      TicketList: newData
    }
    setIsLoading(true)
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
        setIsOpenModalDenyReception(false)
        setListChecked([])
        setListObjectGuid([])
        getListTicket(conditionSearch)
      })
      .finally(() => setIsLoading(false))
  }

  const handleReceptionInTable = (e, record) => {
    e.stopPropagation()
    setListChecked([record?.ObjectGuid])
    setDataTicketDetail(record)
    setListObjectGuid([record])
    setIsOpenModalConfirmReception(true)
  }

  const handleApproveInTable = (e, record) => {
    e.stopPropagation()
    setListChecked([record?.ObjectGuid])
    setDataTicketDetail(record)
    setListObjectGuid([record])
    setIsOpenModalConfirmApprove(true)
  }

  const columns = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      width: 50,
      render: (value, record, index) => <>{(paginationData?.CurrentPage - 1) * paginationData?.PageSize + index + 1}</>
    },
    {
      title: 'Số phiếu',
      dataIndex: 'TicketNo',
      key: 'TicketNo',
      width: 100
    },
    {
      title: 'Họ tên người yêu cầu',
      dataIndex: 'FullName',
      key: 'FullName',
      width: 180
    },
    {
      title: 'Cơ quan, đơn vị',
      dataIndex: 'Organization',
      key: 'Organization',
      width: 200
    },
    {
      title: (
        <>
          <Tooltip title="Thời gian bắt đầu - kết thúc" color="#2a2a2a">
            <div className="font-weight-bold">Thời gian</div>
          </Tooltip>
        </>
      ),
      width: 200,
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
      title: 'Hình thức khai thác',
      dataIndex: 'TypeName',
      key: 'TypeName',
      width: 180
    },
    {
      title: 'Trích yếu',
      dataIndex: 'ListReferences',
      key: 'ListReferences',
      render: (value, record) => (
        <>
          <List
            dataSource={record?.ListReferences}
            renderItem={item => (
              <List.Item key={item.ReferenID}>
                <div className="document-item__name">
                  <TruncateText maxLine={2} content={item.DocSubject}>
                    <span className="name">{item.DocSubject}</span>
                  </TruncateText>
                </div>
              </List.Item>
            )}
          />
        </>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'TicketStatus',
      key: 'TicketStatus',
      width: 180,
      render: (value, record) => {
        return (
          <>
            <b
              style={
                value === 2
                  ? { color: '#10b981' }
                  : value === 3
                  ? { color: '#2196f3' }
                  : value === 4
                  ? { color: '#ef4444' }
                  : { color: '#333' }
              }
            >
              {record.TicketStatusName}
            </b>
            <FloatActionWrapper size="small" className="float-action__wrapper">
              {[1, 3, 5].includes(record?.TicketStatus) && (
                <>
                  {record?.TicketStatus === 1 && roleTypeID === 4 && (
                    <>
                      <Tooltip title="Tiếp nhận phiếu" color="#2a2a2a" mouseLeaveDelay={0}>
                        <Button
                          type="link"
                          size="small"
                          icon={<Icon name="thumb_up" size={20} color="green" className="mx-auto" />}
                          onClick={e => {
                            handleReceptionInTable(e, record)
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Từ chối phiếu" color="#2a2a2a" mouseLeaveDelay={0}>
                        <Button
                          type="link"
                          size="small"
                          icon={
                            <Icon
                              name="remove_circle_outline"
                              size={20}
                              color="var(--color-red-500)"
                              className="mx-auto"
                            />
                          }
                          onClick={() => {
                            setDataTicketDetail(record)
                            setListObjectGuid([record])
                            setListChecked([record?.ObjectGuid])
                            setIsOpenModalDenyReception(true)
                          }}
                        />
                      </Tooltip>
                    </>
                  )}

                  {record?.TicketStatus === 3 && roleTypeID === 3 && (
                    <>
                      <Tooltip title="Duyệt phiếu" color="#2a2a2a" mouseLeaveDelay={0}>
                        <Button
                          type="link"
                          size="small"
                          icon={<Icon name="thumb_up" size={20} color="green" className="mx-auto" />}
                          onClick={e => {
                            handleApproveInTable(e, record)
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Từ chối phiếu" color="#2a2a2a" mouseLeaveDelay={0}>
                        <Button
                          type="link"
                          size="small"
                          icon={
                            <Icon
                              name="remove_circle_outline"
                              size={20}
                              color="var(--color-red-500)"
                              className="mx-auto"
                            />
                          }
                          onClick={() => {
                            setDataTicketDetail(record)
                            setListObjectGuid([record])
                            setListChecked([record?.ObjectGuid])
                            setIsOpenModalDenyReception(true)
                          }}
                        />
                      </Tooltip>
                    </>
                  )}

                  {record?.TicketStatus === 5 && roleTypeID === 2 && (
                    <>
                      <Tooltip title="Duyệt phiếu" color="#2a2a2a" mouseLeaveDelay={0}>
                        <Button
                          type="link"
                          size="small"
                          icon={<Icon name="thumb_up" size={20} color="green" className="mx-auto" />}
                          onClick={e => {
                            handleApproveInTable(e, record)
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Từ chối phiếu" color="#2a2a2a" mouseLeaveDelay={0}>
                        <Button
                          type="link"
                          size="small"
                          icon={
                            <Icon
                              name="remove_circle_outline"
                              size={20}
                              color="var(--color-red-500)"
                              className="mx-auto"
                            />
                          }
                          onClick={() => {
                            setDataTicketDetail(record)
                            setListObjectGuid([record])
                            setListChecked([record?.ObjectGuid])
                            setIsOpenModalDenyReception(true)
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </>
              )}

              {record.TicketStatus !== 6 && record.TicketStatus !== 7 && (
                <Tooltip title="Xem chi tiết" color="#2a2a2a" mouseLeaveDelay={0}>
                  <Button
                    type="link"
                    size="small"
                    icon={
                      <Icon
                        name={record.TicketStatus === 4 ? 'remove_red_eye' : 'edit'}
                        size={20}
                        color="var(--color-blue-600)"
                        className="mx-auto"
                      />
                    }
                    onClick={() => {
                      viewDetailTicket(record)
                    }}
                  />
                </Tooltip>
              )}

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

  const handleChangeEasySearch = value => {
    getListTicket({ ...conditionSearch, TextSearch: value })
  }

  const handleChangeAdvanceSearch = allValues => {
    getListTicket({ ...conditionSearch, ...allValues })
  }

  const exportFile = () => {
    setIsLoading(true)
    const body = {
      ...conditionSearch,
      PageSize: paginationData.PageSize,
      CurrentPage: paginationData.CurrentPage
    }
    TicketService.export(body)
      .then(res => {
        if (!res.isError) {
          exportExcelURL(res.Object)
          // window.open(`${process.env.REACT_APP_DOMAIN}${res?.Object}`)
        }
      })
      .finally(() => setIsLoading(false))
  }

  const checkStatus = status => {
    let check = true
    if (status === 1 && roleTypeID === 4) {
      check = false
    } else if (status === 3 && roleTypeID === 3) {
      check = false
    } else if (status === 5 && roleTypeID === 2) {
      check = false
    }
    return check
  }

  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      setListObjectGuid(selectedRows)
      setListChecked([...selectedRowKeys])
    },
    getCheckboxProps: record => ({
      disabled: checkStatus(record?.TicketStatus)
    }),
    selectedRowKeys: listChecked
  }

  const handleComfirmReception = () => {
    if (!listObjectGuid || listObjectGuid?.length === 0) {
      toast({
        title: 'Bạn chưa chọn phiếu khai thác. Vui lòng chọn lại phiếu để tiếp tục',
        status: 'warning',
        position: 'bottom-right',
        duration: 2000,
        isClosable: true
      })
    } else if (listObjectGuid && listObjectGuid.length === 1) {
      setDataTicketDetail(listObjectGuid[0])
      setIsOpenModalConfirmReception(true)
    } else {
      setIsOpenModalReceptionMoreTicket(true)
    }
  }

  const handleComfirmApprove = () => {
    if (!listObjectGuid || listObjectGuid?.length === 0) {
      toast({
        title: 'Bạn chưa chọn phiếu khai thác. Vui lòng chọn lại phiếu để tiếp tục',
        status: 'warning',
        position: 'bottom-right',
        duration: 2000,
        isClosable: true
      })
    } else if (listObjectGuid && listObjectGuid.length === 1) {
      setDataTicketDetail(listObjectGuid[0])
      setIsOpenModalConfirmApprove(true)
    } else {
      setIsOpenModalApproveMoreTicket(true)
    }
  }

  const handleReject = () => {
    if (!listObjectGuid || listObjectGuid?.length === 0) {
      toast({
        title: 'Bạn chưa chọn phiếu khai thác. Vui lòng chọn lại phiếu để tiếp tục',
        status: 'warning',
        position: 'bottom-right',
        duration: 2000,
        isClosable: true
      })
    } else {
      setIsOpenModalDenyReception(true)
    }
  }

  const addNewTicket = () => {
    setDataTicketDetail(null)
    setIsOpenModalDataMiningTicket(true)
  }

  const viewDetailTicket = ticketDetail => {
    if (ticketDetail?.TicketStatus === 8 || ticketDetail?.TicketStatus === 4) {
      setListChecked([])
    } else {
      setListChecked([ticketDetail?.ObjectGuid])
    }
    setDataTicketDetail(ticketDetail)
    setIsOpenModalDataMiningTicket(true)
  }

  const confirmAddTicketOK = () => {
    setIsOpenModalDataMiningTicket(false)
    getListTicket({ ...conditionSearch, CurrentPage: 1, PageSize: 20 })
  }

  return (
    <ListTicketWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>
          <a href="">Quản lý yêu cầu SDDL</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách khai thác tài liệu</Breadcrumb.Item>
      </BreadcrumbWrapper>
      <Row justify="start" className="mb-10">
        <SystemAdvanceSearchWrapper
          conditionSearch={conditionSearch}
          handleChangeEasySearch={handleChangeEasySearch}
          handleChangSearch={handleChangeAdvanceSearch}
        />
      </Row>
      <TableHeadingWrapper>
        <div>
          <div className="table-heading">Danh sách khai thác tài liệu</div>
          <div>Số bản ghi: {paginationData.TotalSearch} </div>
        </div>
        <Space>
          <ButtonCustom
            text="Lập phiếu"
            color="var(--color-primary)"
            icon={<Icon name="add" size={20} className="mx-auto" />}
            size={15}
            onClick={() => addNewTicket()}
          />
          {roleTypeID !== 5 && (
            <>
              {roleTypeID === 4 ? (
                <>
                  <ButtonCustom
                    text="Tiếp nhận"
                    color="var(--color-primary)"
                    icon={<Icon name="thumb_up" size={20} className="mx-auto" />}
                    size={15}
                    onClick={() => {
                      handleComfirmReception()
                    }}
                  />
                </>
              ) : (
                <>
                  <ButtonCustom
                    text="Duyệt phiếu"
                    color="var(--color-primary)"
                    icon={<Icon name="thumb_up" size={20} className="mx-auto" />}
                    size={15}
                    onClick={() => handleComfirmApprove()}
                  />
                </>
              )}

              <ButtonCustom
                text="Từ chối"
                color="var(--color-red-500)"
                icon={<Icon name="remove_circle_outline" size={20} className="mx-auto" />}
                size={15}
                onClick={handleReject}
              />
            </>
          )}
          <ButtonCustom
            text="Xuất file"
            color="var(--color-primary)"
            icon={<Icon name="download" size={20} className="mx-auto" />}
            size={15}
            onClick={() => {
              exportFile()
            }}
          />
        </Space>
      </TableHeadingWrapper>
      <TableStyledWrapper
        loading={isLoading}
        rowSelection={
          roleTypeID !== 5 && {
            type: 'checkbox',
            key: 'checkbox',
            ...rowSelection
          }
        }
        columns={
          user.RoleGroupID === 1
            ? columns
            : columns.filter(item => item.dataIndex !== 'FullName' && item.dataIndex !== 'Organization')
        }
        dataSource={listTicket}
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
          record?.TicketStatus === 1 ? 'row-inactive' : record?.TicketStatus === 7 ? 'row-delete' : 'row-active'
        }
      />
      <ModalDenyReceptionTicket
        visible={isOpenModalDenyReception}
        type="primary"
        onOk={denyReceptionOK}
        onCancel={() => {
          setIsOpenModalDenyReception(false)
        }}
        data={dataTicketDetail}
        listObjectGuid={listObjectGuid}
      />
      <ModalReceptionTicket
        visible={isOpenModalConfirmReception}
        type="primary"
        data={dataTicketDetail}
        onOk={() => confirmOK()}
        onCancel={() => {
          setIsOpenModalConfirmReception(false)
        }}
      />

      <ModalReceptionMoreTicket
        visible={isOpenModalReceptionMoreTicket}
        type="primary"
        onOk={() => confirmOK()}
        listTicket={listObjectGuid}
        onCancel={() => {
          setIsOpenModalReceptionMoreTicket(false)
        }}
      />

      <ModalApproveTicket
        visible={isOpenModalConfirmApprove}
        type="primary"
        data={dataTicketDetail}
        onOk={() => confirmOK()}
        onCancel={() => {
          setIsOpenModalConfirmApprove(false)
        }}
      />

      <ModalApproveMoreTicket
        visible={isOpenModalApproveMoreTicket}
        type="primary"
        onOk={() => confirmOK()}
        listTicket={listObjectGuid}
        onCancel={() => {
          setIsOpenModalApproveMoreTicket(false)
        }}
      />

      <ModalDataMiningTicket
        visible={isOpenModalDataMiningTicket}
        type="primary"
        onOk={() => confirmAddTicketOK()}
        dataTicket={dataTicketDetail}
        onCancel={() => {
          setIsOpenModalDataMiningTicket(false)
        }}
      />
    </ListTicketWrapper>
  )
}

ListTicket.propTypes = {}

export default ListTicket
