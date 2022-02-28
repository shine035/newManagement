import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link, useHistory } from 'react-router-dom'
import { Breadcrumb, Form, Input, Col, Row, Select, DatePicker, Radio, Button, Space, Spin, InputNumber } from 'antd'
import moment from 'moment'
import { useToast } from '@chakra-ui/toast'
import { useSelector } from 'react-redux'

// Component
import { ModalDeleteDocument } from 'src/components/Modals/component/ModalDeleteDocument'
import { ModalConfirmReception } from 'src/components/Modals/component/ModalConfirmReception'
import { ModalDenyReception } from 'src/components/Modals/component/ModalDenyReception'
import UploadFile from 'src/components/UploadFile'

// Function Helpers
import { isObjectGuidDefault } from 'src/helpers/ObjectGuid'
import { getActiveLinkByPathName } from 'src/helpers/string'
import { localeVN, dateFormat } from 'src/helpers/FomatDateTime'

// API Service
import DocumentService from 'src/api/DocumentService'
import FileService from 'src/api/FileService'
import SuggestSearchFileNotation from './SuggestSearchFileNotation'

// Styled Component
import { BreadcrumbWrapper, AddDocumentWrapper, FormAddDocumentWrapper, BoxWrapper } from '../styled/AddDocumentWrapper'

const { Option } = Select
const { TextArea } = Input

// RegExp
const CHECK_FORMAT_FILENOTATION = '^[a-zA-Z0-9]+/[a-zA-Z0-9]+-[a-zA-Z0-9]+$'
const CHECK_FORMAT_DOCCODE = '^[a-zA-Z0-9\\.\\-]*$'

// const ID_TYPENAME_CV = 28
// const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

const initialValues = {
  ObjectGuid: '00000000-0000-0000-0000-000000000000',
  DocCode: '',
  CodeNumber: '',
  TypeName: null,
  OrganName: null,
  AgencyCreate: null,
  FileNotation: '',
  Field: null,
  IssuedDate: '',
  InforSign: '',
  PiecesOfPaper: '',
  PageAmount: '',
  Languages: ['TV'],
  SecurityLevel: 1,
  Autograph: '',
  Subject: '',
  KeywordIssue: '',
  KeywordPlace: '',
  KeywordEvent: '',
  Description: '',
  DocStatus: 2,
  Format: 1,
  Mode: 2,
  ConfidenceLevel: null,
  StorageTimeType: 2,
  Maintenance: '',
  CongressMeeting: null,
  FileCongressMeeting: 0,
  Meeting: null,
  FileMeeting: 0,
  NationalAssembly: null,
  FileNationalAssembly: 0,
  FileObjectGuid: '00000000-0000-0000-0000-000000000000',
  DocumentPaths: [''],
  FileSecurityLevel: 0,
  OrdinalNumber: 0,
  IsExist: false
}

function AddPaperDocument() {
  const [form] = Form.useForm()
  const { FileObjectGuid, ObjectGuid } = useParams()
  const toast = useToast()
  const history = useHistory()
  const {
    languages,
    documentTypes,
    organName,
    // agencyCreate,
    nationalAssembly,
    congressMeeting,
    meeting,
    securityLevel
  } = useSelector(state => state.common)

  // State
  const [fileName, setFileName] = useState('')
  const [fileList, setFileList] = useState([])
  const [isReceiving, setIsReceiving] = useState(false)
  const [fileLink, setFileLink] = useState({})
  const [oldOrdinalNumber, setOldOrdinalNumber] = useState()
  const [soKyHieu, setSoKyHieu] = useState('')

  const [fileNationalAssembly, setFileNationalAssembly] = useState()
  const [fileCongressMeeting, setFileCongressMeeting] = useState()
  const [fileMeeting, setFileMeeting] = useState()
  const [fileSecurityLevel, setFileSecurityLevel] = useState()

  // State of Modal
  const [isOpenModalDeleteDocument, setIsOpenModalDeleteDocument] = useState(false)
  const [isOpenModalConfirmReception, setIsOpenModalConfirmReception] = useState(false)
  const [isOpenModalDenyReception, setIsOpenModalDenyReception] = useState(false)

  // State Loading
  const [isLoading, setIsLoading] = useState(false)

  // State List QHK, KHT, PH
  const [listNationalAssembly, setListNationalAssembly] = useState([])
  const [listCongressMeeting, setListCongressMeeting] = useState([])
  const [listMeeting, setListMeeting] = useState([])

  const onSubmitForm = data => {
    if (ObjectGuid) {
      insertUpdatePaperDocument(data)
    } else {
      onCheckExistOrdinalNumber(data?.OrdinalNumber).then(res => {
        if (!res?.isOk) return
        insertUpdatePaperDocument(data)
      })
    }
  }

  const insertUpdatePaperDocument = data => {
    const body = {
      ...data,
      Field: data.Field || '',
      FileObjectGuid,
      FileNationalAssembly: fileNationalAssembly,
      FileCongressMeeting: fileCongressMeeting,
      FileMeeting: fileMeeting,
      FileSecurityLevel: fileSecurityLevel,
      ConfidenceLevel: data.ConfidenceLevel || 0,
      CongressMeeting: data.CongressMeeting || 0,
      Meeting: data.Meeting || 0,
      NationalAssembly: data.NationalAssembly || 0,
      PiecesOfPaper: data.PiecesOfPaper || 0,
      PageAmount: data.PageAmount || 0,
      IssuedDate: moment(data.IssuedDate).format()
    }
    setIsLoading(true)
    DocumentService.insertUpdate(body)
      .then(response => {
        setIsLoading(false)
        if (response?.isError) return
        toast({
          title: `${!ObjectGuid ? 'Thêm mới tài liệu thành công' : 'Sửa tài liệu thành công'}`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        history.push(`${fileLink.url}/${FileObjectGuid}/paper`)
      })
      .finally(() => setIsLoading(false))
  }

  const getFileByFileObjectGuid = () => {
    setIsLoading(true)
    FileService.getOne(FileObjectGuid)
      .then(res => {
        if (!res.isError && !res.Status) {
          setFileName(res.Object?.FileNo)
          setFileNationalAssembly(res.Object?.NationalAssembly)
          setFileCongressMeeting(res.Object?.CongressMeeting)
          setFileMeeting(res.Object?.Meeting)
          setFileSecurityLevel(res.Object?.SecurityLevel)

          if (res.Object?.NationalAssembly) {
            setListNationalAssembly(
              nationalAssembly.filter(item => Number(item.CodeValue) === res.Object?.NationalAssembly)
            )
          }
          if (res.Object?.CongressMeeting) {
            setListCongressMeeting(
              congressMeeting.filter(item => Number(item.CodeValue) === res.Object?.CongressMeeting)
            )
          }
          if (res.Object?.Meeting) {
            setListMeeting(meeting.filter(item => Number(item.CodeValue) === res.Object?.Meeting))
          }
        }
      })
      .finally(() => setIsLoading(false))
  }

  const getOrdinalNumber = () => {
    DocumentService.getOrdinalNumber({ FileObjectGuid }).then(res => {
      if (!res.isError && !res.Status) {
        form.setFieldsValue({
          ...form.getFieldsValue(true),
          OrdinalNumber: res.Object
        })
        setOldOrdinalNumber(res?.Object)
      }
    })
  }

  const getPaperDocumentByObjectGuid = () => {
    setIsLoading(true)
    DocumentService.getOne(ObjectGuid)
      .then(res => {
        if (!res.isError && !res.Status) {
          setSoKyHieu(res.Object?.FileNotation)
          form.setFieldsValue({
            ...res?.Object,
            NationalAssembly: res.Object?.NationalAssembly ? res.Object?.NationalAssembly : null,
            CongressMeeting: res.Object?.CongressMeeting ? res.Object?.CongressMeeting : null,
            Meeting: res.Object?.Meeting ? res.Object?.Meeting : null,
            IssuedDate: moment(res.Object?.IssuedDate),
            Field: res.Object?.Field || null,
            ConfidenceLevel: res.Object?.ConfidenceLevel || null,
            SecurityLevel: res.Object?.SecurityLevel ? res.Object?.SecurityLevel : null,
            PiecesOfPaper: res?.Object?.PiecesOfPaper.toString(),
            PageAmount: res?.Object?.PageAmount.toString()
          })
          const listFile = res.Object?.DocumentPaths.map((item, idx) => {
            const lastIndex = item.lastIndexOf('\\')
            return {
              uid: `${idx + 1}`,
              name: `${item.slice(lastIndex + 1)}`,
              status: 'done',
              response: {
                Object: item
              }
              // url: `${API_ENDPOINT}${item}`
            }
          })
          setFileList(listFile)
          setOldOrdinalNumber(res?.Object?.OrdinalNumber)
          setIsReceiving(res.Object?.DocStatus === 1)
        }
      })
      .finally(() => setIsLoading(false))
  }

  const onReceivePaperDocument = () => {
    const body = {
      ObjectGuid,
      FileObjectGuid,
      ListObjectGuidDocSync: [ObjectGuid]
    }
    setIsLoading(true)
    DocumentService.receive(body)
      .then(res => {
        if (res.isError) return
        toast({
          title: `Tiếp nhận tài liệu thành công`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        history.push(`${fileLink.url}/${FileObjectGuid}/paper`)
      })
      .finally(() => setIsLoading(false))
  }

  const onRejectPaperDocument = content => {
    const body = {
      ObjectGuid,
      Content: content.Content
    }

    setIsLoading(true)
    DocumentService.reject(body)
      .then(res => {
        if (res.isError) return
        toast({
          title: `Tài liệu đã bị từ chối`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        history.push(`${fileLink.url}/${FileObjectGuid}/paper`)
      })
      .finally(() => setIsLoading(false))
  }

  const onDeletePaperDocument = content => {
    const body = {
      ObjectGuid,
      Content: content.Content
    }

    setIsLoading(true)
    DocumentService.delete(body)
      .then(res => {
        if (res.isError) return
        toast({
          title: `Tài liệu đã được xóa`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        history.push(`${fileLink.url}/${FileObjectGuid}/paper`)
      })
      .finally(() => setIsLoading(false))
  }

  const onChangeFile = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    let lstFile = []
    newFileList.forEach(item => {
      if (item?.status === 'done') {
        lstFile = [...lstFile, item.response?.Object]
        form.setFieldsValue({
          ...form.getFieldsValue(true),
          DocumentPaths: lstFile
        })
      } else if (item.status === 'error') {
        toast({
          title: `Tải file lên thất bại`,
          status: 'error',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
      }
    })
  }

  const onCheckExistOrdinalNumber = OrdinalNumber => {
    const body = {
      FileObjectGuid,
      OrdinalNumber
    }

    return DocumentService.checkExistOrdinalNumber(body)
  }

  const setFileNotation = value => {
    if (value) {
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        FileNotation: value
      })
    }
  }

  const getFormByFileNotation = option => {
    if (option) {
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        ...option,
        ObjectGuid: '00000000-0000-0000-0000-000000000000',
        IssuedDate: moment(option?.IssuedDate),
        PiecesOfPaper: option?.PiecesOfPaper.toString(),
        PageAmount: option?.PageAmount.toString(),
        Languages: option?.Languages || [],
        DocumentPaths: option?.DocumentPaths || [],
        NationalAssembly: option?.NationalAssembly || null,
        Meeting: option?.Meeting || null,
        CongressMeeting: option?.CongressMeeting || null,
        OrdinalNumber: oldOrdinalNumber,
        IsExist: true
      })
      if (option?.NationalAssembly) {
        setListNationalAssembly(nationalAssembly.filter(item => Number(item.CodeValue) === option?.NationalAssembly))
      }
      if (option?.CongressMeeting) {
        setListCongressMeeting(congressMeeting.filter(item => Number(item.CodeValue) === option?.CongressMeeting))
      }
      if (option?.Meeting) {
        setListMeeting(meeting.filter(item => Number(item.CodeValue) === option?.Meeting))
      }
      setIsReceiving(true)
      setSoKyHieu(option?.FileNotation)
    } else {
      form.resetFields()
      form.setFieldsValue({
        ObjectGuid: '00000000-0000-0000-0000-000000000000',
        OrdinalNumber: oldOrdinalNumber
      })
      setIsReceiving(false)
    }
  }

  useEffect(() => {
    setFileLink(getActiveLinkByPathName(history.location.pathname))
    getFileByFileObjectGuid()

    if (ObjectGuid) {
      getPaperDocumentByObjectGuid()
    } else {
      getOrdinalNumber()
    }
  }, [])

  return (
    <>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>Quản lý dữ liệu</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={fileLink.url}>{fileLink.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Hồ sơ {fileName}</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`${fileLink.url}/${FileObjectGuid}/paper`}>Tài liệu giấy</Link>
        </Breadcrumb.Item>
        {!ObjectGuid ? (
          <Breadcrumb.Item>Thêm mới Tài liệu giấy</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>Xem, Sửa Tài liệu giấy</Breadcrumb.Item>
        )}
      </BreadcrumbWrapper>
      <AddDocumentWrapper>
        <FormAddDocumentWrapper>
          <Form
            layout="vertical"
            initialValues={initialValues}
            form={form}
            labelAlign="left"
            scrollToFirstError={{ behavior: 'smooth', block: 'center', inline: 'center' }}
            onFinish={() => onSubmitForm(form.getFieldsValue(true))}
          >
            <Spin size="small" spinning={isLoading}>
              <BoxWrapper>
                <div className="title-box">
                  <b className="title-label">Thông tin cơ bản: </b>
                </div>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      name="OrdinalNumber"
                      label="Số thứ tự"
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Số thứ tự'
                        },
                        () => ({
                          validator(_, value) {
                            if (value && value.toString() !== oldOrdinalNumber.toString()) {
                              return Promise.resolve(onCheckExistOrdinalNumber(value)).then(res => {
                                if (res?.isError) {
                                  return Promise.reject(new Error('Số thứ tự tài liệu giấy đã tồn tại!'))
                                }
                                return Promise.resolve()
                              })
                            }
                            return Promise.resolve()
                          }
                        })
                      ]}
                    >
                      <Input placeholder="Số thứ tự" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      label="Mã định danh văn bản"
                      name="DocCode"
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Mã định danh văn bản'
                        },
                        {
                          max: 25,
                          message: 'Mã định danh văn bản <= 25 ký tự'
                        },
                        {
                          pattern: new RegExp(CHECK_FORMAT_DOCCODE),
                          message: 'Mã định dạng văn bản không chứa dấu, ký tự đặc biệt'
                        }
                      ]}
                    >
                      <Input placeholder="Mã định danh văn bản" disabled={isReceiving} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="FileNotation"
                      label="Số và ký hiệu: (VD: aaa/aaa-aaa)"
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Số và ký hiệu'
                        },
                        {
                          pattern: new RegExp(CHECK_FORMAT_FILENOTATION),
                          message: 'Sai định dạng Số và ký hiệu'
                        }
                      ]}
                    >
                      <SuggestSearchFileNotation
                        soKyHieu={soKyHieu}
                        setSoKyHieu={setSoKyHieu}
                        onSelect={getFormByFileNotation}
                        setFileNotation={setFileNotation}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      name="Subject"
                      label="Trích yếu nội dung"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Trích yếu nội dung'
                        },
                        {
                          max: 500,
                          message: 'Trích yếu nội dung <= 500 ký tự'
                        }
                      ]}
                    >
                      <TextArea disabled={isReceiving} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      name="CodeNumber"
                      label="Số văn bản"
                      dependencies={['FileNotation']}
                      rules={[{ max: 11, message: 'Số văn bản <= 11 ký tự' }]}
                    >
                      <Input placeholder="Số văn bản" disabled={isReceiving} />
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item
                      name="TypeName"
                      label="Loại văn bản"
                      rules={[
                        {
                          required: true,
                          message: 'Chưa chọn Loại văn bản'
                        }
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Chọn Loại văn bản"
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        {!!documentTypes &&
                          !!documentTypes.length &&
                          documentTypes.map((item, idx) => (
                            <Option key={idx} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="OrganName"
                      label="CQ, tổ chức ban hành"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa chọn CQ, tổ chức ban hành'
                        }
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Chọn CQ, tổ chức ban hành"
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        {!!organName &&
                          !!organName.length &&
                          organName.map((item, idx) => (
                            <Option key={idx} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="Mode"
                      label="Chế độ sử dụng"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Chế độ sử dụng'
                        }
                      ]}
                    >
                      <Select
                        placeholder="Chọn Chế độ sử dụng"
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option value={1}>Hạn chế</Option>
                        <Option value={2}>Không hạn chế</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="AgencyCreate" label="Đơn vị soạn thảo">
                      <Input placeholder="Đơn vị soạn thảo" disabled={isReceiving} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="Field" label="Lĩnh vực">
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Chọn Lĩnh vực"
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option value="1">Lĩnh vực 1</Option>
                        <Option value="2">Lĩnh vực 2</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      name="SecurityLevel"
                      label="Độ bảo mật"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập độ bảo mật'
                        }
                      ]}
                    >
                      <Select
                        placeholder="Chọn Độ bảo mật"
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
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
                  <Col span={8} className="custom-col-8">
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
                      <Radio.Group disabled={isReceiving}>
                        <Radio value={1}>Vĩnh viễn</Radio>
                        <Radio value={2}>Có thời hạn</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.StorageTimeType !== currentValues.StorageTimeType
                      }
                    >
                      {({ getFieldValue }) =>
                        getFieldValue('StorageTimeType') === 2 ? (
                          <>
                            <Col span={4}>
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
                                <InputNumber min={1} max={70} disabled={isReceiving} />
                              </Form.Item>
                            </Col>
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
                      name="IssuedDate"
                      label="Ngày văn bản"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Ngày văn bản'
                        }
                      ]}
                    >
                      <DatePicker
                        getPopupContainer={trigger => trigger.parentNode}
                        style={{ width: '100%' }}
                        locale={localeVN}
                        format={dateFormat}
                        inputReadOnly
                        disabled={isReceiving}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="NationalAssembly"
                      label="Nhiệm kỳ"
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (value === 0) {
                              form.setFieldsValue({
                                ...form.getFieldsValue(true),
                                NationalAssembly: null
                              })
                            }
                            return Promise.resolve()
                          }
                        })
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Chọn nhiệm kỳ"
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option key={0} value={0}>
                          Không chọn
                        </Option>
                        {!!listNationalAssembly &&
                          !!listNationalAssembly.length &&
                          listNationalAssembly.map((item, idx) => (
                            <Option key={idx + 1} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4} className="d-none">
                    <Form.Item
                      name="CongressMeeting"
                      label="Kỳ họp thứ"
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (value === 0) {
                              form.setFieldsValue({
                                ...form.getFieldsValue(true),
                                CongressMeeting: null
                              })
                            }
                            return Promise.resolve()
                          }
                        })
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Chọn Kỳ họp thứ"
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option key={0} value={0}>
                          Không chọn
                        </Option>
                        {!!listCongressMeeting &&
                          !!listCongressMeeting.length &&
                          listCongressMeeting.map((item, idx) => (
                            <Option key={idx + 1} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4} className="d-none">
                    <Form.Item
                      name="Meeting"
                      label="Phiên họp từ"
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (value === 0) {
                              form.setFieldsValue({
                                ...form.getFieldsValue(true),
                                Meeting: null
                              })
                            }
                            return Promise.resolve()
                          }
                        })
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Chọn Phiên họp"
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option key={0} value={0}>
                          Không chọn
                        </Option>
                        {!!listMeeting &&
                          !!listMeeting.length &&
                          listMeeting.map((item, idx) => (
                            <Option key={idx + 1} value={Number(item.CodeValue)}>
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
                  <b className="title-label">Thông tin khác: </b>
                </div>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      name="InforSign"
                      label="Ký hiệu thông tin"
                      rules={[
                        {
                          max: 30,
                          message: 'Ký hiệu thông tin ít hơn 30 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="Ký hiệu thông tin" disabled={isReceiving} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="PiecesOfPaper"
                      label="Số tờ"
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Số tờ'
                        }
                      ]}
                    >
                      <InputNumber min={0} max={9999999999} placeholder="Số tờ" disabled={isReceiving} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="PageAmount"
                      label="Số trang"
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Số trang'
                        }
                      ]}
                    >
                      <InputNumber min={0} max={9999999999} placeholder="Số trang" disabled={isReceiving} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="Languages" label="Ngôn ngữ">
                      <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        showArrow
                        placeholder="Chọn ngôn ngữ"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        {!!languages &&
                          !!languages.length &&
                          languages.map((item, idx) => (
                            <Option key={idx} value={item.CodeKey}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      name="Autograph"
                      label="Bút tích"
                      rules={[
                        {
                          max: 2000,
                          message: 'Bút tích <= 2000 ký tự'
                        }
                      ]}
                    >
                      <TextArea rows={1} disabled={isReceiving} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      name="Description"
                      label="Ghi chú"
                      rules={[
                        {
                          max: 500,
                          message: 'Ghi chú <= 500 ký tự'
                        }
                      ]}
                    >
                      <TextArea disabled={isReceiving} />
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
                        <Input placeholder="Vấn đề chính" disabled={isReceiving} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="KeywordPlace"
                        label="Địa danh"
                        rules={[
                          {
                            required: false,
                            message: 'Nhập Địa danh không quá 100 ký tự!',
                            max: 100
                          }
                        ]}
                      >
                        <Input placeholder="Địa danh" disabled={isReceiving} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="KeywordEvent"
                        label="Sự kiện"
                        rules={[
                          {
                            required: false,
                            message: 'Nhập Sự kiện không quá 100 ký tự!',
                            max: 100
                          }
                        ]}
                      >
                        <Input placeholder="Sự kiện" disabled={isReceiving} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Row gutter={20} style={{ alignItems: 'baseline' }}>
                  <Col>File mẫu</Col>
                  <Col>
                    <Form.Item name="DocumentPaths">
                      <UploadFile
                        multiple
                        accept=".pdf"
                        fileList={fileList}
                        disabled={isReceiving}
                        onChange={onChangeFile}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      name="ConfidenceLevel"
                      label="Mức độ tin cậy"
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (value === 0) {
                              form.setFieldsValue({
                                ...form.getFieldsValue(true),
                                ConfidenceLevel: null
                              })
                            }
                            return Promise.resolve()
                          }
                        })
                      ]}
                    >
                      <Select
                        placeholder="Chọn Mức độ tin cậy"
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option value={0}>Không chọn</Option>
                        <Option value={1}>Bản chính</Option>
                        <Option value={2}>Bản sao</Option>
                        <Option value={3}>Bản gốc</Option>
                        <Option value={4}>Bản sao y bản chính</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="Format" label="Tình trạng vật lý">
                      <Select
                        placeholder="Chọn Tình trạng vật lý"
                        disabled={isReceiving}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option value={1}>Bình thường</Option>
                        <Option value={2}>Hư hỏng</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <div className="d-flex justify-content-center">
                  <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}>
                    {({ getFieldValue }) => (
                      <Space size={20}>
                        {!isObjectGuidDefault(getFieldValue('ObjectGuid')) && getFieldValue('DocStatus') === 1 && (
                          <>
                            <Button type="danger" key="deny" onClick={() => setIsOpenModalDenyReception(true)}>
                              Từ chối
                            </Button>
                            <Button type="primary" key="reception" onClick={() => setIsOpenModalConfirmReception(true)}>
                              Tiếp nhận
                            </Button>
                          </>
                        )}
                        {!isObjectGuidDefault(getFieldValue('ObjectGuid')) && getFieldValue('DocStatus') !== 1 && (
                          <Button type="danger" key="delete" onClick={() => setIsOpenModalDeleteDocument(true)}>
                            Xóa
                          </Button>
                        )}
                        {((!isObjectGuidDefault(getFieldValue('ObjectGuid')) && getFieldValue('DocStatus') !== 1) ||
                          isObjectGuidDefault(getFieldValue('ObjectGuid'))) && (
                          <Button type="primary" htmlType="submit">
                            Ghi lại
                          </Button>
                        )}
                        <Button onClick={() => history.goBack()} key="back">
                          Quay lại
                        </Button>
                      </Space>
                    )}
                  </Form.Item>
                </div>
              </BoxWrapper>
            </Spin>
          </Form>
          <ModalDeleteDocument
            visible={isOpenModalDeleteDocument}
            type="primary"
            onOk={content => onDeletePaperDocument(content)}
            onCancel={() => setIsOpenModalDeleteDocument(false)}
          />
          <ModalConfirmReception
            visible={isOpenModalConfirmReception}
            data={form.getFieldsValue(true)}
            type="primary"
            onOk={() => onReceivePaperDocument()}
            onCancel={() => setIsOpenModalConfirmReception(false)}
          />
          <ModalDenyReception
            visible={isOpenModalDenyReception}
            type="primary"
            onOk={content => onRejectPaperDocument(content)}
            onCancel={() => setIsOpenModalDenyReception(false)}
          />
        </FormAddDocumentWrapper>
      </AddDocumentWrapper>
    </>
  )
}

AddPaperDocument.propTypes = {}

export default AddPaperDocument
