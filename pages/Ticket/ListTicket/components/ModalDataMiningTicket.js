import React, { useEffect, useState } from 'react'
import PropTypes, { object } from 'prop-types'
import { useSelector } from 'react-redux'
import { Button, Form, DatePicker, Row, Col, Radio, Space, Input, Spin, Tooltip, Select, Checkbox } from 'antd'

import { useToast } from '@chakra-ui/react'
import moment from 'moment'
import {
  SearchOutlined,
  PrinterOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  MinusCircleOutlined
} from '@ant-design/icons'

// API
import AccountDeptService from 'src/api/AccountDeptService'
import TicketService from 'src/api/TicketService'

// Component
import { ModalSearchDocument } from 'src/components/Modals/component/ModalSearchDocument'
import { ModalDeleteTicket } from 'src/pages/Ticket/ListTicket/components/ModalDeleteTicket'
import { ModalTransferTicket } from 'src/pages/Ticket/ListTicket/components/ModalTransferTicket'

import Icon from 'src/components/Icon/Icon'

// Helpers
import { exportExcelURL } from 'src/helpers/index'
import { filterSelect } from 'src/helpers/string'

// Style
import { ModalDenyReceptionTicket } from 'src/pages/Ticket/ListTicket/components/ModalDenyReceptionTicket'
import { ModalWrapper, TableContentWrapper } from 'src/components/Modals/styled/ModalWrapper'
import { FormDataMiningTitle, FormDataMiningWrapper } from 'src/components/Modals/styled/FormDataMiningWrapper'

const { Option, OptGroup } = Select
const { Search } = Input

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const initialValuesForm = {
  StartDate: moment(new Date()),
  EndDate: '',
  Purpose: '',
  Type: 1,
  ListReferences: [],
  UserID: '',
  IsReturn: false
}

const ModalDataMiningTicket = props => {
  const { onCancel, className, onOk, visible, footer, dataTicket } = props

  const toast = useToast()
  const [formMining] = Form.useForm()
  const { user } = useSelector(state => state.auth)
  const { roleTypeID, ticketStatus, ticketMiningType } = useSelector(state => state.common)
  const [isLoading, setIsLoading] = useState(false)
  const [dataSearch, setDataSearch] = useState('')
  const [isTicket, setIsTicket] = useState({})
  const [listReferences, setListReferences] = useState([])
  const [listObjectGuid, setListObjectGuid] = useState([])
  const [dataTicketDetail, setDataTicketDetail] = useState({})
  const [listUserManager, setListUserManager] = useState([{ ...user }])
  const [isOpenModalDeleteTicket, setIsOpenModalDeleteTicket] = useState(false)
  const [isOpenModalDenyReception, setIsOpenModalDenyReception] = useState(false)
  const [isOpenModalSearchDocument, setOpenModalSearchDocument] = useState(false)
  const [isShowModalTransferTicket, setIsShowModalTransferTicket] = useState(false)

  useEffect(() => {
    setDataTicketDetail({})
    setListUserManager([user])
    if (!visible) {
      formMining.resetFields()
      setDataTicketDetail({})
      setListUserManager([user])
      setListReferences([])
      setListObjectGuid([])
      return
    }
    if (!dataTicket) {
      setIsTicket(false)
      setDataTicketDetail({})
      if (roleTypeID !== 5) {
        getListUserManager('')
      } else {
        setListUserManager([user])
        if (user?.UserID) {
          formMining.setFieldsValue({
            Organization: user?.UserDeptName,
            Address: user?.Address || '',
            Phone: user?.Phone || '',
            FullName: user?.FullName || '',
            UserID: user?.UserID || ''
          })
        }
      }
    } else {
      setIsTicket(true)
      if (roleTypeID !== 5) {
        getListUserManager('')
      } else {
        setListUserManager([user])
        if (user?.UserID) {
          formMining.setFieldsValue({
            Organization: user?.UserDeptName,
            Address: user?.Address || '',
            Phone: user?.Phone || '',
            FullName: user?.FullName || '',
            UserID: user?.UserID || ''
          })
        }
        getOneTicketByObjectGuid(dataTicket?.ObjectGuid)
      }
    }
  }, [visible])

  const getListUserManager = fullName => {
    AccountDeptService.getListUserByDirectory(fullName).then(res => {
      if (res?.isError) return
      if (res?.Object) {
        const listUser = res?.Object.filter(item => item?.AccountUsers.length > 0)
        setListUserManager(listUser)
        if (dataTicket?.ObjectGuid) {
          getOneTicketByObjectGuid(dataTicket?.ObjectGuid)
        } else {
          formMining.setFieldsValue({
            ...formMining,
            Organization: user?.UserDeptName,
            Address: user?.Address || '',
            Phone: user?.Phone || '',
            FullName: user?.FullName || '',
            UserID: user?.UserID || ''
          })
        }
      }
    })
  }

  const getOneTicketByObjectGuid = ObjectGuid => {
    if (!ObjectGuid) return
    setIsLoading(true)
    TicketService.getOne(ObjectGuid)
      .then(res => {
        if (res.isError) return
        setDataTicketDetail(res.Object)

        formMining.setFieldsValue({
          ...formMining,
          Organization: res.Object?.Organization,
          Address: res.Object?.Address,
          Phone: res.Object?.Phone,
          FullName: res.Object?.FullName,
          UserID: res.Object?.UserID,
          Purpose: res.Object?.Purpose,
          Type: res.Object?.Type,
          TicketStatus: res.Object?.TicketStatus,
          TicketNo: res.Object?.TicketNo,
          IsReturn: res.Object?.TicketStatus === 8,
          EndDate: moment(res.Object?.EndDate),
          StartDate: moment(res.Object?.StartDate)
        })
        const newData = res.Object?.ListReferences.map(item => {
          return {
            ...item,
            key: item?.ReferenID
          }
        })
        setListReferences(newData)
      })
      .finally(() => setIsLoading(false))
  }

  const handleChangeForm = value => {
    if (value.UserID) {
      if (listUserManager && listUserManager.length) {
        listUserManager.forEach(item => {
          if (item?.AccountUsers && item?.AccountUsers.length) {
            const infoUser = item?.AccountUsers.filter(dataUser => dataUser?.UserID === value?.UserID)
            if (infoUser && infoUser.length === 1) {
              formMining.setFieldsValue({
                Organization: infoUser[0]?.DeptName || '',
                Address: infoUser[0]?.Address || '',
                Phone: infoUser[0]?.Phone || '',
                FullName: infoUser[0]?.FullName || '',
                UserID: infoUser[0]?.UserID || ''
              })
            }
          }
        })
      }
    } else {
      formMining.setFieldsValue({
        Organization: '',
        Address: '',
        Phone: '',
        FullName: '',
        UserID: null
      })
    }
  }

  const disabledEndDate = current => {
    return current && current < moment(formMining.getFieldValue('StartDate'))
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
        if (res?.isOk) {
          onOk()
          setIsOpenModalDenyReception(false)
        }
      })
      .finally(() => setIsLoading(false))
  }

  const handleSubmitForm = values => {
    formMining.validateFields().then(() => {
      let arr = []
      arr =
        listReferences &&
        listReferences.length &&
        listReferences.map(element => {
          return { ReferenID: element.ReferenID, ReferenType: element.ReferenType }
        })
      const body = {
        ObjectGuid: dataTicketDetail?.ObjectGuid,
        StartDate: moment(new Date()),
        EndDate: values.EndDate,
        Purpose: values.Purpose,
        Type: values.Type,
        ListReferences: arr || [],
        UserID: values.UserID,
        IsReturn: values.IsReturn || false
      }
      if (body.ListReferences && body.ListReferences.length) {
        setIsLoading(true)
        TicketService.insertUpdateTicket(body)
          .then(res => {
            if (res?.isError) return
            toast({
              title: dataTicketDetail?.ObjectGuid ? 'Cập nhật phiếu thành công' : 'Lập mới phiếu thành công',
              status: 'success',
              position: 'bottom-right',
              duration: 2000,
              isClosable: true
            })
            formMining.resetFields()
            if (res?.isOk) {
              onOk()
            }
          })
          .finally(() => setIsLoading(false))
      } else {
        toast({
          title: 'Bạn chưa chọn tài liệu khai thác. Vui lòng chọn lại!',
          status: 'warning',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
      }
    })
  }

  const getListDocumentChoice = listDocumentChoice => {
    setOpenModalSearchDocument(false)
    setListReferences(listDocumentChoice)
  }

  const handleDeleteItem = idx => {
    const arr = [...listReferences]
    arr.splice(idx, 1)
    setListReferences(arr)
  }

  const deleteOK = () => {
    setIsLoading(true)
    TicketService.delete({
      ObjectGuid: dataTicketDetail?.ObjectGuid
    })
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Phiếu đã xóa thành công',
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        setIsOpenModalDeleteTicket(false)
        onCancel()
        if (res?.isOk) {
          onOk()
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const exportFilePDF = () => {
    TicketService.exportPDF({ ObjectGuid: dataTicket?.ObjectGuid }).then(res => {
      if (res?.isError) return
      exportExcelURL(res?.Object)
    })
  }

  const transferTicket = () => {
    setIsShowModalTransferTicket(true)
  }

  const transferTicketOK = () => {
    if (!listReferences) return
    setIsLoading(true)
    const newbody = {
      TicketList: [
        {
          Content: listReferences[0]?.DocSubject || '',
          ObjectGuid: dataTicketDetail?.ObjectGuid
        }
      ]
    }
    TicketService.approve(newbody)
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Phiếu đã được duyệt và chuyển',
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        if (res?.isOk) {
          setIsShowModalTransferTicket(false)
          onCancel()
          onOk()
        }
      })
      .finally(() => setIsLoading(false))
  }

  const acceptTicket = () => {
    if (!listReferences) return
    setIsLoading(true)
    const newbody = {
      TicketList: [
        {
          Content: listReferences[0]?.DocSubject || '',
          ObjectGuid: dataTicketDetail?.ObjectGuid
        }
      ]
    }
    TicketService.approve(newbody)
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Phiếu đã được duyệt',
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        if (res?.isOk) {
          onCancel()
          onOk()
        }
      })
      .finally(() => setIsLoading(false))
  }

  const columnsChoice = [
    {
      title: 'Tiêu đề',
      key: 'DocSubject',
      dataIndex: 'DocSubject',
      render: (text, row, index) => (
        <div>
          {index + 1}. {text}
        </div>
      )
    },
    {
      title: 'Thao tác',
      align: 'center',
      dataIndex: 'acction',
      key: 'acction',
      width: 80,
      render: (value, record, index) => (
        <>
          {dataTicketDetail?.TicketStatus !== 6 &&
            dataTicketDetail?.TicketStatus !== 7 &&
            dataTicketDetail?.TicketStatus !== 4 &&
            dataTicketDetail?.TicketStatus !== 8 &&
            roleTypeID !== 3 && (
              <Tooltip title="Xóa tài liệu">
                <Button
                  type="link"
                  size="small"
                  onClick={() => handleDeleteItem(index)}
                  icon={<Icon name="delete" size={20} color="var(--color-red-600)" className="mx-auto" />}
                />
              </Tooltip>
            )}
        </>
      )
    }
  ]
  return (
    <ModalWrapper
      title={
        dataTicket?.ObjectGuid && dataTicket?.ObjectGuid !== '00000000-0000-0000-0000-000000000000'
          ? 'Chi tiết phiếu khai thác tài liệu'
          : 'Lập mới phiếu khai thác tài liệu'
      }
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      closable={false}
      width={765}
      className={className}
      destroyOnClose
      footer={
        footer || footer === null
          ? footer
          : [
              <div key="footer">
                {roleTypeID === 1 && (
                  <div
                    className={
                      dataTicket?.ObjectGuid && dataTicket?.ObjectGuid !== '00000000-0000-0000-0000-000000000000'
                        ? 'd-flex justify-content-between'
                        : ''
                    }
                  >
                    {dataTicket?.ObjectGuid && dataTicket?.ObjectGuid !== '00000000-0000-0000-0000-000000000000' && (
                      <Space>
                        <Button
                          type="danger"
                          icon={<DeleteOutlined />}
                          onClick={() => setIsOpenModalDeleteTicket(true)}
                        >
                          Xóa
                        </Button>
                        <Button
                          type="danger"
                          icon={<MinusCircleOutlined />}
                          onClick={e => {
                            e.stopPropagation()
                            setListObjectGuid([dataTicketDetail])
                            setIsOpenModalDenyReception(true)
                          }}
                        >
                          Từ chối
                        </Button>
                        <Button
                          type="secondary"
                          icon={<PrinterOutlined />}
                          onClick={() => exportFilePDF()}
                          style={{ paddingRight: 10 }}
                        >
                          In phiếu
                        </Button>
                      </Space>
                    )}

                    <Space>
                      <Button type="primary" key="submit" htmlType="submit" form="formMining" icon={<SaveOutlined />}>
                        {dataTicket?.ObjectGuid && dataTicket?.ObjectGuid !== '00000000-0000-0000-0000-000000000000'
                          ? 'Ghi lại'
                          : 'Lập phiếu'}
                      </Button>
                      <Button
                        type="secondary"
                        key="back"
                        onClick={() => {
                          onCancel()
                        }}
                        icon={<CloseOutlined />}
                      >
                        Đóng
                      </Button>
                    </Space>
                  </div>
                )}

                {roleTypeID === 2 && (
                  <div className={isTicket ? 'd-flex justify-content-between' : ''}>
                    {isTicket && (
                      <Space>
                        <Button type="secondary" icon={<PrinterOutlined />} onClick={() => exportFilePDF()}>
                          In phiếu
                        </Button>
                        {dataTicketDetail?.TicketStatus === 5 && (
                          <Button
                            type="danger"
                            icon={<MinusCircleOutlined />}
                            onClick={e => {
                              e.stopPropagation()
                              setListObjectGuid([dataTicketDetail])
                              setIsOpenModalDenyReception(true)
                            }}
                          >
                            Từ chối
                          </Button>
                        )}
                      </Space>
                    )}
                    <Space>
                      {isTicket && dataTicketDetail?.TicketStatus === 5 && (
                        <>
                          <Button type="primary" icon={<SaveOutlined />} onClick={transferTicket}>
                            Duyệt phiếu
                          </Button>
                        </>
                      )}
                      {dataTicketDetail?.TicketStatus !== 4 &&
                        dataTicketDetail?.TicketStatus !== 3 &&
                        dataTicketDetail?.TicketStatus !== 8 &&
                        dataTicketDetail?.TicketStatus !== 5 && (
                          <Button
                            type="primary"
                            key="submit"
                            htmlType="submit"
                            form="formMining"
                            icon={<SaveOutlined />}
                          >
                            {dataTicket?.ObjectGuid && dataTicket?.ObjectGuid !== '00000000-0000-0000-0000-000000000000'
                              ? 'Ghi lại'
                              : 'Lập phiếu'}
                          </Button>
                        )}
                      <Button
                        type="secondary"
                        key="back"
                        onClick={() => {
                          onCancel()
                        }}
                        icon={<CloseOutlined />}
                      >
                        Đóng
                      </Button>
                    </Space>
                  </div>
                )}

                {roleTypeID === 3 && (
                  <div className={isTicket ? 'd-flex justify-content-between' : ''}>
                    {isTicket && (
                      <Space>
                        <Button type="secondary" icon={<PrinterOutlined />} onClick={() => exportFilePDF()}>
                          In phiếu
                        </Button>
                        {dataTicketDetail?.TicketStatus === 3 && (
                          <Button
                            type="danger"
                            icon={<MinusCircleOutlined />}
                            onClick={e => {
                              e.stopPropagation()
                              setListObjectGuid([dataTicketDetail])
                              setIsOpenModalDenyReception(true)
                            }}
                          >
                            Từ chối
                          </Button>
                        )}
                      </Space>
                    )}
                    <Space>
                      {isTicket && dataTicketDetail?.TicketStatus === 3 && (
                        <Button type="primary" icon={<SaveOutlined />} onClick={transferTicket}>
                          Duyệt và Chuyển
                        </Button>
                      )}

                      {dataTicketDetail?.TicketStatus !== 4 &&
                        dataTicketDetail?.TicketStatus !== 3 &&
                        dataTicketDetail?.TicketStatus !== 8 &&
                        dataTicketDetail?.TicketStatus !== 5 && (
                          <Button
                            type="primary"
                            key="submit"
                            htmlType="submit"
                            form="formMining"
                            icon={<SaveOutlined />}
                          >
                            {dataTicket?.ObjectGuid && dataTicket?.ObjectGuid !== '00000000-0000-0000-0000-000000000000'
                              ? 'Ghi lại'
                              : 'Lập phiếu'}
                          </Button>
                        )}

                      <Button type="secondary" key="back" onClick={onCancel} icon={<CloseOutlined />}>
                        Đóng
                      </Button>
                    </Space>
                  </div>
                )}

                {roleTypeID === 4 && (
                  <div className={isTicket ? 'd-flex justify-content-between' : ''}>
                    {isTicket && (
                      <Space>
                        {[1, 3, 5].includes(dataTicketDetail?.TicketStatus) && (
                          <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => setIsOpenModalDeleteTicket(true)}
                          >
                            Xóa
                          </Button>
                        )}

                        <Button type="secondary" icon={<PrinterOutlined />} onClick={() => exportFilePDF()}>
                          In phiếu
                        </Button>
                      </Space>
                    )}

                    <Space>
                      {dataTicketDetail?.TicketStatus === 1 && (
                        <>
                          {isTicket && (
                            <Button type="primary" icon={<SaveOutlined />} onClick={acceptTicket}>
                              Đồng ý
                            </Button>
                          )}
                        </>
                      )}

                      {!isTicket && (
                        <Button type="primary" key="submit" htmlType="submit" form="formMining" icon={<SaveOutlined />}>
                          Lập phiếu
                        </Button>
                      )}
                      {isTicket && dataTicketDetail?.TicketStatus !== 8 && (
                        <Button type="primary" key="submit" htmlType="submit" form="formMining" icon={<SaveOutlined />}>
                          Ghi lại
                        </Button>
                      )}
                      <Button type="secondary" key="back" onClick={onCancel} icon={<CloseOutlined />}>
                        Đóng
                      </Button>
                    </Space>
                  </div>
                )}

                {roleTypeID === 5 && (
                  <div className={isTicket ? 'd-flex justify-content-between' : ''}>
                    {isTicket && (
                      <Space>
                        {[1, 3, 5].includes(dataTicketDetail?.TicketStatus) && (
                          <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => setIsOpenModalDeleteTicket(true)}
                          >
                            Xóa
                          </Button>
                        )}

                        <Button type="secondary" icon={<PrinterOutlined />} onClick={() => exportFilePDF()}>
                          In phiếu
                        </Button>
                      </Space>
                    )}

                    <Space>
                      {dataTicketDetail?.ObjectGuid && (
                        <>
                          {![4, 2, 7, 6, 8].includes(dataTicketDetail?.TicketStatus) && (
                            <Button
                              type="primary"
                              key="submit"
                              htmlType="submit"
                              form="formMining"
                              icon={<SaveOutlined />}
                            >
                              Ghi lại
                            </Button>
                          )}
                        </>
                      )}
                      {!dataTicketDetail?.ObjectGuid && dataTicketDetail?.TicketStatus !== 8 && (
                        <>
                          <Button
                            type="primary"
                            key="submit"
                            htmlType="submit"
                            form="formMining"
                            icon={<SaveOutlined />}
                          >
                            Lập phiếu
                          </Button>
                        </>
                      )}

                      <Button type="secondary" key="back" onClick={onCancel} icon={<CloseOutlined />}>
                        Đóng
                      </Button>
                    </Space>
                  </div>
                )}
              </div>
            ]
      }
    >
      <FormDataMiningWrapper>
        <Form
          form={formMining}
          id="formMining"
          initialValues={initialValuesForm}
          onValuesChange={(changedValues, allValues) => handleChangeForm(allValues)}
          onFinish={handleSubmitForm}
          layout="horizontal"
        >
          <Spin size="small" spinning={isLoading}>
            <FormDataMiningTitle>
              <p className="top-title">Phiếu yêu cầu khai thác dữ liệu</p>
              <i>
                Số phiếu:{' '}
                {dataTicket?.ObjectGuid &&
                  dataTicketDetail?.ObjectGuid !== '00000000-0000-0000-0000-000000000000' &&
                  dataTicketDetail?.TicketNo}
              </i>
            </FormDataMiningTitle>
            <Form.Item
              {...layout}
              label="Họ tên người yêu cầu"
              name="UserID"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Họ và tên người yêu cầu'
                }
              ]}
            >
              {roleTypeID !== 5 ? (
                <Select
                  disabled={
                    dataTicketDetail?.TicketStatus === 4 ||
                    dataTicketDetail?.TicketStatus === 8 ||
                    (dataTicketDetail?.TicketStatus === 3 && roleTypeID === 3) ||
                    (dataTicketDetail?.TicketStatus === 5 && roleTypeID === 3)
                  }
                  placeholder="Chọn"
                  getPopupContainer={trigger => trigger.parentNode}
                  showSearch
                  filterOption={filterSelect}
                >
                  {listUserManager &&
                    listUserManager.length &&
                    listUserManager.map((item, index) => (
                      <OptGroup key={index} label={item?.DeptName}>
                        {item.AccountUsers &&
                          item.AccountUsers.length &&
                          item.AccountUsers.map((itemUser, idx) => (
                            <Option key={`${index}-${idx}`} value={itemUser.UserID}>
                              {itemUser.FullName}
                            </Option>
                          ))}
                      </OptGroup>
                    ))}
                </Select>
              ) : (
                <Select
                  disabled={dataTicketDetail?.TicketStatus === 4 || dataTicketDetail?.TicketStatus === 8}
                  placeholder="Chọn"
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  {listUserManager &&
                    listUserManager.length &&
                    listUserManager.map((item, idx) => (
                      <Option key={idx} value={item.UserID}>
                        {item.FullName} ({item.UserName})
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...layout} label="Cơ quan, đơn vị" name="Organization">
              <Input readOnly />
            </Form.Item>
            <Form.Item {...layout} label="Số điện thoại" name="Phone">
              <Input readOnly />
            </Form.Item>
            <Form.Item {...layout} label="Địa chỉ liên hệ" name="Address">
              <Input readOnly />
            </Form.Item>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item name="StartDate" label="Ngày bắt đầu" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <DatePicker
                    disabled
                    getPopupContainer={trigger => trigger.parentNode}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY HH:mm"
                    showTime
                    placeholder="Chọn ngày"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="EndDate"
                  label="Kết thúc"
                  rules={[
                    {
                      required: true,
                      message: 'Ngày Kết thúc phải lớn hơn ngày bắt đầu!'
                    }
                  ]}
                >
                  <DatePicker
                    getPopupContainer={trigger => trigger.parentNode}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY HH:mm"
                    showTime
                    placeholder="Chọn ngày"
                    disabledDate={disabledEndDate}
                    disabled={
                      dataTicketDetail?.TicketStatus === 4 ||
                      dataTicketDetail?.TicketStatus === 8 ||
                      (dataTicketDetail?.TicketStatus === 3 && roleTypeID === 3) ||
                      (dataTicketDetail?.TicketStatus === 5 && roleTypeID === 3)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Mục đích khai thác, sử dụng tài liệu"
              name="Purpose"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Mục đích khai thác, sử dụng tài liệu'
                },
                {
                  max: 3000,
                  message: 'Vui lòng nhập Mục đích khai thác, sử dụng tài liệu không quá 3000 ký tự'
                }
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.TextArea
                rows={3}
                style={{ width: '100%' }}
                disabled={
                  dataTicketDetail?.TicketStatus === 4 ||
                  dataTicketDetail?.TicketStatus === 8 ||
                  (dataTicketDetail?.TicketStatus === 3 && roleTypeID === 3) ||
                  (dataTicketDetail?.TicketStatus === 5 && roleTypeID === 3)
                }
              />
            </Form.Item>
            <Form.Item
              name="Type"
              label="Hình thức khai thác/Chuyển tài liệu"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Radio.Group
                style={{ paddingLeft: '25px' }}
                disabled={
                  dataTicketDetail?.TicketStatus === 4 ||
                  dataTicketDetail?.TicketStatus === 8 ||
                  (dataTicketDetail?.TicketStatus === 3 && roleTypeID === 3) ||
                  (dataTicketDetail?.TicketStatus === 5 && roleTypeID === 3)
                }
              >
                <Space direction="horizontal">
                  {ticketMiningType &&
                    ticketMiningType.length &&
                    ticketMiningType.map((item, idx) => (
                      <Radio key={idx} className="d-block" value={Number(item.CodeValue)}>
                        {item.Text}
                      </Radio>
                    ))}
                </Space>
              </Radio.Group>
            </Form.Item>
            <Row>
              <Col span={24}>
                <Form.Item label="Tên tài liệu *" name="KeyWord" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  <Search
                    disabled={
                      dataTicketDetail?.TicketStatus === 4 ||
                      dataTicketDetail?.TicketStatus === 8 ||
                      (dataTicketDetail?.TicketStatus === 3 && roleTypeID === 3) ||
                      (dataTicketDetail?.TicketStatus === 5 && roleTypeID === 3)
                    }
                    placeholder="Nhập tiêu đề tài liệu"
                    enterButton={
                      <>
                        <SearchOutlined /> <span> Tìm kiếm</span>
                      </>
                    }
                    onSearch={(value, e) => {
                      e.preventDefault()
                      setDataSearch(value)
                      setOpenModalSearchDocument(true)
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {listReferences && listReferences.length > 0 && (
              <Row>
                <Col span={24}>
                  <div className="demo-infinite-container mb-2">
                    <TableContentWrapper
                      showHeader={false}
                      className="table-list-document"
                      columns={columnsChoice}
                      dataSource={listReferences}
                      scroll={{ y: '35vh' }}
                      pagination={false}
                    />
                  </div>
                </Col>
              </Row>
            )}
            {dataTicketDetail?.ObjectGuid && roleTypeID === 4 && (
              <>
                <Row gutter={10} className="ant-form-item">
                  <Col span={24}>
                    <Form.Item label="Trạng thái" name="TicketStatus">
                      <Select disabled placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode}>
                        {ticketStatus &&
                          ticketStatus.length &&
                          ticketStatus.map((item, idx) => (
                            <Option key={idx + 1} value={Number(item.CodeValue)}>
                              {item.Text} ({item.CodeKey})
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="IsReturn" valuePropName="checked" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  <Checkbox
                    disabled={
                      (dataTicketDetail?.TicketStatus === 1 && user?.UserID !== dataTicketDetail?.UserID) ||
                      dataTicketDetail?.TicketStatus === 3 ||
                      dataTicketDetail?.TicketStatus === 5 ||
                      dataTicketDetail?.TicketStatus === 8
                    }
                  >
                    Đã trả
                  </Checkbox>
                </Form.Item>
              </>
            )}
          </Spin>
        </Form>

        <ModalSearchDocument
          visible={isOpenModalSearchDocument}
          type="primary"
          title="Danh sách tài liệu"
          listReferences={listReferences}
          onOk={getListDocumentChoice}
          className="search-document"
          textSearch={dataSearch}
          onCancel={() => setOpenModalSearchDocument(false)}
        />

        <ModalDeleteTicket
          visible={isOpenModalDeleteTicket}
          type="primary"
          onOk={deleteOK}
          onCancel={() => setIsOpenModalDeleteTicket(false)}
        />

        <ModalTransferTicket
          visible={isShowModalTransferTicket}
          type="primary"
          data={dataTicketDetail}
          onOk={transferTicketOK}
          onCancel={() => setIsShowModalTransferTicket(false)}
        />

        <ModalDenyReceptionTicket
          visible={isOpenModalDenyReception}
          type="primary"
          onOk={denyReceptionOK}
          onCancel={() => setIsOpenModalDenyReception(false)}
          data={dataTicketDetail}
          listObjectGuid={listObjectGuid}
        />
      </FormDataMiningWrapper>
    </ModalWrapper>
  )
}

ModalDataMiningTicket.defaultProps = {
  className: 'atbd-modal'
}

ModalDataMiningTicket.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  className: PropTypes.string,
  footer: PropTypes.arrayOf(object),
  top: PropTypes.number,
  visible: PropTypes.bool,
  dataTicket: PropTypes.object,
  type: PropTypes.string,
  width: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export { ModalDataMiningTicket }
