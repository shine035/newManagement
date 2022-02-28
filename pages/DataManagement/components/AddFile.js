import React, { useEffect, useState } from 'react'
import {
  Breadcrumb,
  Form,
  Input,
  InputNumber,
  Col,
  Row,
  Select,
  DatePicker,
  Radio,
  Button,
  Spin,
  Space,
  Tooltip
} from 'antd'
import { useToast } from '@chakra-ui/react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import moment from 'moment'

// API Service
import FileService from 'src/api/FileService'
import CommonService from 'src/api/CommonService'

// Components
import { ModalDeleteDocument } from 'src/components/Modals/component/ModalDeleteDocument'
import { ModalConfirmReception } from 'src/components/Modals/component/ModalConfirmReception'
import { ModalDenyReception } from 'src/components/Modals/component/ModalDenyReception'

// Helpers
import { getActiveLinkByPathName } from 'src/helpers/string'
import { localeVN, dateFormat } from 'src/helpers/FomatDateTime'

// style
import { BreadcrumbWrapper, AddDocumentWrapper, FormAddDocumentWrapper, BoxWrapper } from '../styled/AddDocumentWrapper'

const { Option } = Select

const initialValuesForm = {
  ObjectGuid: '00000000-0000-0000-0000-000000000000',
  Title: '',
  GroupFile: null,
  FileNo: '',
  FileNotation: '',
  FileCatalog: null,
  Identifier: '000.00.00.C01',
  FileCode: '',
  PiecesOfPaper: 0,
  PageNumber: 0,
  TotalDoc: '',
  StartDate: '',
  EndDate: '',
  Rights: 2,
  NationalAssemblys: [],
  StorageTimeType: 2,
  Maintenance: '',
  PersonallyFiled: '',
  DeliveryDate: '',
  Gear: '',
  Racking: 0,
  RackingValue: '',
  Compartment: 0,
  CompartmentValue: '',
  FileRowNumber: 0,
  FileRowNumberValue: '',
  InforSign: '',
  KeywordIssue: '',
  KeywordPlace: '',
  KeywordEvent: '',
  Description: '',
  FileStatus: 2,
  Format: 1,
  Languages: ['TV'],
  CongressMeeting: 0,
  Meeting: 0,
  SystemType: 1,
  SecurityLevel: 1,
  FileType: 0
}

const AddFile = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const toast = useToast()
  const { FileObjectGuid } = useParams()
  const { fileGroup, languages, nationalAssembly, congressMeeting, meeting, securityLevel } = useSelector(
    state => state.common
  )

  // State Modal
  const [isOpenModalDeleteDocument, setIsOpenModalDeleteDocument] = useState(false)
  const [isOpenModalConfirmReception, setIsOpenModalConfirmReception] = useState(false)
  const [isOpenModalDenyReception, setIsOpenModalDenyReception] = useState(false)

  // State Loading
  const [isLoading, setIsLoading] = useState(false)

  const [listRacking, setListRacking] = useState([])
  const [listCompartment, setListCompartment] = useState([])
  const [listFileRowNumber, setListFileRowNumber] = useState([])
  const [fileDetail, setFileDetail] = useState({})
  const [fileLink, setFileLink] = useState({})

  const disabledStartDate = current => {
    return current && current > moment(form.getFieldValue('EndDate')).endOf('day')
  }

  const disabledEndDate = current => {
    return current && current < moment(form.getFieldValue('StartDate')).endOf('day')
  }

  const disabledDeliveryDate = current => {
    return (
      (current && current < moment(form.getFieldValue('StartDate')).endOf('day')) ||
      current > moment(form.getFieldValue('EndDate')).endOf('day')
    )
  }

  const checkDefaultDate = date => {
    const newDate = moment(date).format('DD/MM/YYYY')
    if (newDate === '01/01/1900') {
      return true
    }
    return false
  }

  const getFileByObjectGuid = ObjectGuid => {
    if (ObjectGuid) {
      FileService.getOne(ObjectGuid).then(res => {
        if (res.isError) return
        setFileDetail(res.Object)
        form.setFieldsValue({
          ...res.Object,
          DeliveryDate: !checkDefaultDate(res.Object?.DeliveryDate) ? moment(res.Object?.DeliveryDate) : '',
          EndDate: moment(res.Object?.EndDate),
          StartDate: moment(res.Object?.StartDate),
          FileCatalog: res.Object?.FileCatalog ? res.Object?.FileCatalog.toString() : '',
          TotalDoc: res.Object?.TotalDoc ? res.Object?.TotalDoc.toString() : ''
        })
        if (res.Object.Racking) {
          getListCompartment(res.Object.Racking)
        }
        if (res?.Object?.Compartment) {
          getListFileRowNumber(res?.Object?.Compartment)
        }
      })
    }
  }

  const getInventoryByType = typeId => {
    CommonService.getInventoryByType(typeId).then(res => {
      if (res.isError) return
      if (typeId === 1) {
        setListRacking(res?.Object)
      }
    })
  }

  const handleChangeRacking = Id => {
    if (listRacking && listRacking.length) {
      const infoRacking = listRacking.find(item => item?.ID === Id)
      if (infoRacking) {
        initialValuesForm.RackingValue = infoRacking?.Value
      } else {
        initialValuesForm.RackingValue = ''
      }
    }
    getListCompartment(Id)
    getListFileRowNumber(fileDetail?.Compartment)
    if (Id !== fileDetail.Racking) {
      form.setFieldsValue({
        ...form,
        Compartment: null,
        FileRowNumber: null
      })
      initialValuesForm.CompartmentValue = ''
      initialValuesForm.FileRowNumberValue = ''
    } else {
      form.setFieldsValue({
        ...form,
        Compartment: fileDetail?.Compartment,
        FileRowNumber: fileDetail?.FileRowNumber
      })
    }
  }

  const handleChangeCompartment = Id => {
    if (listCompartment && listCompartment.length) {
      const infoCompartment = listCompartment.find(item => item?.ID === Id)
      if (infoCompartment) {
        initialValuesForm.CompartmentValue = infoCompartment?.Value
      } else {
        initialValuesForm.CompartmentValue = ''
      }
    }

    if (Id !== fileDetail.Compartment) {
      form.setFieldsValue({
        ...form,
        FileRowNumber: null
      })
      initialValuesForm.FileRowNumberValue = ''
    } else {
      form.setFieldsValue({
        ...form,
        Compartment: fileDetail?.Compartment,
        FileRowNumber: fileDetail?.FileRowNumber
      })
    }
    getListFileRowNumber(Id)
  }

  const handleChangeFileRowNumber = Id => {
    if (listFileRowNumber && listFileRowNumber.length) {
      const infoFileRowNumber = listFileRowNumber.find(item => item?.ID === Id)
      if (infoFileRowNumber) {
        initialValuesForm.FileRowNumberValue = infoFileRowNumber?.Value
      } else {
        initialValuesForm.FileRowNumberValue = ''
      }
    }
    if (!Id) {
      form.setFieldsValue({
        ...form,
        FileRowNumber: null
      })
      initialValuesForm.FileRowNumberValue = null
    }
  }

  const getListCompartment = Id => {
    if (Id) {
      CommonService.getListChildInventory(Id).then(res => {
        if (res.isError) return
        if (res?.Object && res?.Object.length) {
          setListCompartment(res?.Object.filter(item => item.ParentID === Id && item.Type === 2))
        }
      })
    }
  }

  const getListFileRowNumber = Id => {
    if (Id) {
      CommonService.getListChildInventory(Id).then(res => {
        if (res.isError) return
        if (res?.Object && res?.Object.length) {
          setListFileRowNumber(res?.Object.filter(item => item.ParentID === Id && item.Type === 3))
        }
      })
    }
  }

  const handleChange = (changedValues, allValues) => {
    if (allValues.FileNo && allValues.GroupFile) {
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        FileNotation: `${allValues.FileNo}.${
          fileGroup.find(item => Number(item.CodeValue) === Number(allValues.GroupFile))?.CodeKey
        }`
      })
    }
    if (allValues.Gear) {
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        Gear: allValues.Gear.replace(/\s/g, '')
      })
    }
  }

  const changeDeliveryDate = () => {
    if (moment(form.getFieldValue('StartDate')).isAfter(form.getFieldValue('DeliveryDate'), 'day')) {
      form.setFieldsValue({ DeliveryDate: null })
      form.validateFields(['DeliveryDate'])
    }
  }

  const onFinish = values => {
    setIsLoading(true)
    const body = {
      ...values,
      ObjectGuid: FileObjectGuid,
      FileStatus: 2,
      GroupFile: Number(values?.GroupFile),
      CongressMeeting: Number(values?.CongressMeeting),
      Meeting: Number(values?.Meeting),
      FileType: fileLink?.key,
      EndDate: moment(values?.EndDate).format(),
      StartDate: moment(values?.StartDate).format(),
      DeliveryDate: values?.DeliveryDate ? moment(values?.DeliveryDate).format() : '',
      RackingValue: initialValuesForm?.RackingValue || '',
      CompartmentValue: initialValuesForm?.CompartmentValue || '',
      FileRowNumberValue: initialValuesForm?.FileRowNumberValue || ''
    }
    FileService.insertUpdateFile(body)
      .then(res => {
        if (res?.isError) return
        toast({
          title: `${FileObjectGuid ? 'Sửa hồ sơ thành công' : 'Thêm mới hồ sơ thành công'}`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })

        history.push(fileLink?.url)
      })
      .finally(() => setIsLoading(false))
  }

  const deleteOK = reason => {
    setIsLoading(true)
    FileService.delete({
      Content: reason.Content,
      ObjectGuid: FileObjectGuid
    })
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Hồ sơ đã xóa thành công',
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        setIsOpenModalDeleteDocument(false)
        history.push(fileLink?.url)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const denyReceptionOK = reason => {
    setIsLoading(true)
    FileService.reject({
      ...reason,
      ObjectGuid: FileObjectGuid
    })
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Hồ sơ đã bị từ chối',
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        setIsOpenModalDenyReception(false)
        history.push(fileLink?.url)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const confirmOK = body => {
    setIsLoading(true)
    FileService.receive({
      ObjectGuildList: [body?.ObjectGuid]
    })
      .then(res => {
        if (res.isError) return
        toast({
          title: 'Hồ sơ được lưu kho',
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        setIsOpenModalConfirmReception(false)
        history.push(fileLink?.url)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    setIsLoading(true)
    setFileLink(getActiveLinkByPathName(history.location.pathname))
    Promise.all([getFileByObjectGuid(FileObjectGuid), getInventoryByType(1)])
      .then(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <AddDocumentWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>Quản lý dữ liệu</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={fileLink?.url}>{fileLink?.name}</Link>
        </Breadcrumb.Item>
        {!FileObjectGuid ? (
          <Breadcrumb.Item>Thêm mới hồ sơ</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>Xem, Sửa Hồ sơ</Breadcrumb.Item>
        )}
      </BreadcrumbWrapper>
      <FormAddDocumentWrapper>
        <Form
          layout="vertical"
          initialValues={initialValuesForm}
          form={form}
          id="form"
          labelAlign="left"
          scrollToFirstError={{ behavior: 'smooth', block: 'center', inline: 'center' }}
          onValuesChange={(changedValues, allValues) => handleChange(changedValues, allValues)}
          onFinish={onFinish}
        >
          <Spin size="small" spinning={isLoading}>
            <BoxWrapper>
              <div className="title-box">
                <b className="title-label">Thông tin cơ bản: </b>
              </div>
              <Form.Item
                label="Tiêu đề"
                name="Title"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập Tiêu đề không quá 1000 ký tự!',
                    max: 1000
                  }
                ]}
              >
                <Input.TextArea rows={3} placeholder="Vui lòng nhập Tiêu đề hồ sơ" />
              </Form.Item>
              <Row gutter={20}>
                <Col span={4}>
                  <Form.Item name="FileCode" label="Mã hồ sơ">
                    <Input placeholder="Mã hồ sơ" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    name="FileNotation"
                    label="Số và ký hiệu"
                    rules={[
                      {
                        max: 20,
                        message: 'Số và ký hiệu không quá 20 ký tự'
                      }
                    ]}
                  >
                    <Input placeholder="Số và ký hiệu" />
                  </Form.Item>
                </Col>

                <Col span={4}>
                  <Form.Item name="GroupFile" label="Nhóm hồ sơ">
                    <Select getPopupContainer={trigger => trigger.parentNode}>
                      <Option key={null} value={null}>
                        Chọn
                      </Option>
                      {fileGroup &&
                        fileGroup.length &&
                        fileGroup.map((item, idx) => (
                          <Option key={idx} value={Number(item.CodeValue)}>
                            <Tooltip placement="top" title={`${item.Text} (${item.CodeKey})`}>
                              {item.Text} ({item.CodeKey})
                            </Tooltip>
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    name="FileNo"
                    label="Hồ sơ số"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập Hồ sơ số'
                      },
                      {
                        max: 20,
                        message: 'Hồ sơ số không quá 20 ký tự'
                      },
                      {
                        pattern: '^[a-zA-Z0-9]*$',
                        message: 'Hồ sơ số không chứa dấu, ký tự đặc biệt'
                      }
                    ]}
                  >
                    <Input placeholder="Nhập số Hồ sơ" />
                  </Form.Item>
                </Col>

                <Col span={4}>
                  <Form.Item label="Mục lục số" name="FileCatalog">
                    <InputNumber min={0} max={99999} placeholder="Mục lục số" />
                  </Form.Item>
                </Col>

                <Col span={4}>
                  <Form.Item name="Identifier" label="Mã CQ lưu trữ">
                    <Select getPopupContainer={trigger => trigger.parentNode}>
                      <Option value="000.00.00.C01">000.00.00.C01</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={4}>
                  <Form.Item name="PiecesOfPaper" label="Số tờ">
                    <InputNumber disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="PageNumber" label="Số trang">
                    <InputNumber disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="TotalDoc" label="Số lượng văn bản">
                    <InputNumber min={0} max={999999} placeholder="Số lượng văn bản" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    name="StorageTimeType"
                    label="Thời hạn bảo quản"
                    rules={[
                      {
                        required: true,
                        message: 'Chưa chọn loại thời hạn bảo quản'
                      }
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={1}>Vĩnh viễn</Radio>
                      <Radio value={2}>Có thời hạn</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={4} className="custom-col-8">
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.StorageTimeType !== currentValues.StorageTimeType
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('StorageTimeType') === 2 ? (
                        <>
                          <Form.Item
                            name="Maintenance"
                            style={{ marginBottom: 'unset' }}
                            rules={[
                              {
                                required: true,
                                message: 'Chưa nhập thời hạn bảo quản'
                              }
                            ]}
                          >
                            <InputNumber min={1} max={70} />
                          </Form.Item>
                          <div>Năm</div>
                        </>
                      ) : null
                    }
                  </Form.Item>
                </Col>
              </Row>
            </BoxWrapper>

            <BoxWrapper>
              <div className="title-box">
                <b className="title-label">Thời gian: </b>
              </div>
              <Row gutter={20}>
                <Col span={4}>
                  <Form.Item
                    name="StartDate"
                    label="Bắt đầu"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập Ngày bắt đầu!'
                      }
                    ]}
                  >
                    <DatePicker
                      getPopupContainer={trigger => trigger.parentNode}
                      style={{ width: '100%' }}
                      locale={localeVN}
                      format={dateFormat}
                      inputReadOnly
                      disabledDate={disabledStartDate}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
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
                      locale={localeVN}
                      format={dateFormat}
                      inputReadOnly
                      disabledDate={disabledEndDate}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="DeliveryDate" label="Ngày giao">
                    <DatePicker
                      getPopupContainer={trigger => trigger.parentNode}
                      style={{ width: '100%' }}
                      format={dateFormat}
                      inputReadOnly
                      disabledDate={disabledDeliveryDate}
                      onChange={() => changeDeliveryDate()}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="Rights" label="Chế độ sử dụng">
                    <Select getPopupContainer={trigger => trigger.parentNode}>
                      <Option value={1}>Hạn chế</Option>
                      <Option value={2}>Không hạn chế</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="PersonallyFiled"
                    label="Đơn vị, cá nhân nộp"
                    rules={[
                      {
                        required: false,
                        message: 'ĐV, cá nhân nộp khóa không quá 200 ký tự. Vui lòng nhập lại!',
                        max: 200
                      }
                    ]}
                  >
                    <Input placeholder="Đơn vị, cá nhân nộp" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={4}>
                  <Form.Item name="NationalAssemblys" label="Nhiệm kỳ">
                    <Select
                      mode="multiple"
                      placeholder="Chọn"
                      getPopupContainer={trigger => trigger.parentNode}
                      showSearch
                    >
                      {/* <Option key={null} value={0}>
                        Chọn
                      </Option> */}

                      {nationalAssembly &&
                        nationalAssembly.length &&
                        nationalAssembly.map((item, idx) => (
                          <Option key={idx} value={item.CodeValue}>
                            {item.Text}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4} className="d-none">
                  <Form.Item name="CongressMeeting" label="Kỳ họp thứ">
                    <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode} showSearch>
                      <Option key={null} value={0}>
                        Chọn
                      </Option>
                      {congressMeeting &&
                        congressMeeting.length &&
                        congressMeeting.map((item, idx) => (
                          <Option key={idx} value={Number(item.CodeValue)}>
                            {item.Text}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={4} className="d-none">
                  <Form.Item name="Meeting" label="Phiên họp">
                    <Select placeholder="Chọn" getPopupContainer={trigger => trigger.parentNode} showSearch>
                      <Option key={null} value={0}>
                        Chọn
                      </Option>
                      {meeting &&
                        meeting.length &&
                        meeting.map((item, idx) => (
                          <Option key={idx} value={Number(item.CodeValue)}>
                            {item.Text}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </BoxWrapper>
            <BoxWrapper>
              <div className="title-box">
                <b className="title-label">Sổ lưu trữ: </b>
              </div>
              <Row gutter={20}>
                {/* <Col span={4}>
                  <Form.Item name="OrganID" label="Mã phông">
                    AAAAAAAAA
                  </Form.Item>
                </Col> */}
                <Col span={4}>
                  <Form.Item name="FontName" label="Tên phông">
                    <b>Phông lưu trữ</b>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="Racking" label="Giá" placeholder="Chọn">
                    <Select
                      placeholder="Chọn"
                      onChange={value => handleChangeRacking(value)}
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      <Option key={null} value={0}>
                        Chọn
                      </Option>
                      {listRacking &&
                        listRacking.length &&
                        listRacking.map((item, idx) => (
                          <Option key={idx} value={item.ID}>
                            {item.Description}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="Compartment" label="Khoang" placeholder="Chọn">
                    <Select
                      placeholder="Chọn"
                      disabled={!form.getFieldValue('Racking')}
                      onChange={value => handleChangeCompartment(value)}
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      <Option key={null} value={0}>
                        Chọn
                      </Option>
                      {listCompartment &&
                        listCompartment.length &&
                        listCompartment.map((item, idx) => (
                          <Option key={idx} value={Number(item.ID)}>
                            {item.Description}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    name="FileRowNumber"
                    label="Hàng"
                    rules={[
                      {
                        required: false,
                        message: 'Hàng không quá 20 ký tự!'
                      }
                    ]}
                  >
                    <Select
                      placeholder="Chọn"
                      disabled={!form.getFieldValue('Compartment')}
                      onChange={value => handleChangeFileRowNumber(value)}
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      <Option key={null} value={0}>
                        Chọn
                      </Option>
                      {listFileRowNumber &&
                        listFileRowNumber.length &&
                        listFileRowNumber.map((item, idx) => (
                          <Option key={idx} value={item.ID}>
                            {item.Description}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    name="Gear"
                    label="Hộp số"
                    rules={[
                      {
                        message: 'Vui lòng nhập Hộp số không quá 20 ký tự',
                        max: 20
                      },
                      {
                        pattern: '^[a-zA-Z0-9]*$',
                        message: 'Hộp số không chứa dấu, ký tự đặc biệt'
                      }
                    ]}
                  >
                    <Input placeholder="Nhập hộp số" />
                  </Form.Item>
                </Col>
                {/* </Row>
              <Row gutter={20}> */}
              </Row>
            </BoxWrapper>
            <BoxWrapper>
              <div className="title-box">
                <b className="title-label">Thông tin khác: </b>
              </div>
              <Row gutter={20}>
                <Col span={8}>
                  <Form.Item
                    name="InforSign"
                    label="Ký hiệu thông tin"
                    rules={[
                      {
                        required: false,
                        message: 'Nhập Ký hiệu thông tin không quá 30 ký tự!',
                        max: 30
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item name="Languages" label="Ngôn ngữ">
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch
                      showArrow
                      placeholder="Chọn ngôn ngữ"
                      getPopupContainer={trigger => trigger.parentNode}
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {languages &&
                        languages.length &&
                        languages.map((item, idx) => (
                          <Option key={idx} value={item.CodeKey}>
                            {item.Text}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <div className="bg-keyword">
                <div className="title-box">
                  <b>Từ khóa: </b>
                </div>
                <Row gutter={20}>
                  <Col span={8}>
                    <Form.Item
                      name="KeywordIssue"
                      label="Vấn đề chính"
                      rules={[
                        {
                          required: false,
                          message: 'Nhập Vấn đề chính không quá 100 ký tự!',
                          max: 100
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="KeywordPlace"
                      label="Địa danh"
                      rules={[
                        {
                          required: false,
                          message: 'Địa danh không quá 100 ký tự. Vui lòng nhập lại!',
                          max: 100
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="KeywordEvent"
                      label="Sự kiện"
                      rules={[
                        {
                          required: false,
                          message: 'Sự kiện không quá 100 ký tự. Vui lòng nhập lại!',
                          max: 100
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Chú giải"
                    name="Description"
                    rules={[
                      {
                        required: false,
                        message: 'Chú giải không quá 2000 ký tự. Vui lòng nhập lại!',
                        max: 2000
                      }
                    ]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={4}>
                  <Form.Item name="Format" label="Tình trạng vật lý">
                    <Select getPopupContainer={trigger => trigger.parentNode}>
                      <Option value={1}>Bình thường</Option>
                      <Option value={2}>Hư hỏng</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="SecurityLevel" label="Độ mật">
                    <Select disabled getPopupContainer={trigger => trigger.parentNode}>
                      {!!securityLevel &&
                        !!securityLevel.length &&
                        securityLevel.map((item, idx) => (
                          <Option key={idx} value={Number(item?.CodeValue)}>
                            {item?.Text}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </BoxWrapper>
            <div className="d-flex justify-content-center">
              <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}>
                {({ getFieldValue }) => (
                  <Space size={20}>
                    {FileObjectGuid && getFieldValue('FileStatus') === 1 && (
                      <>
                        <Button type="danger" onClick={() => setIsOpenModalDenyReception(true)}>
                          Từ chối
                        </Button>
                        <Button type="primary" onClick={() => setIsOpenModalConfirmReception(true)}>
                          Tiếp nhận
                        </Button>
                      </>
                    )}
                    {FileObjectGuid && (
                      <Button type="danger" onClick={() => setIsOpenModalDeleteDocument(true)}>
                        Xóa
                      </Button>
                    )}
                    <Button type="primary" htmlType="submit">
                      Ghi lại
                    </Button>
                    <Button type="secondary" key="back" onClick={() => history.goBack()}>
                      Quay lại
                    </Button>
                  </Space>
                )}
              </Form.Item>
            </div>
          </Spin>
        </Form>

        <ModalDeleteDocument
          visible={isOpenModalDeleteDocument}
          type="primary"
          onOk={deleteOK}
          onCancel={() => setIsOpenModalDeleteDocument(false)}
        />
        <ModalConfirmReception
          visible={isOpenModalConfirmReception}
          type="primary"
          data={fileDetail}
          onOk={() => confirmOK(fileDetail)}
          onCancel={() => setIsOpenModalConfirmReception(false)}
        />

        <ModalDenyReception
          visible={isOpenModalDenyReception}
          type="primary"
          onOk={denyReceptionOK}
          onCancel={() => setIsOpenModalDenyReception(false)}
        />
      </FormAddDocumentWrapper>
    </AddDocumentWrapper>
  )
}

AddFile.propTypes = {}

export default AddFile
