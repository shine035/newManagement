import React, { useEffect, useState } from 'react'
import { useHistory, useParams, Link } from 'react-router-dom'
import { Breadcrumb, Form, Input, Col, Row, Select, DatePicker, Radio, Button, Spin, Space, InputNumber } from 'antd'
import { useToast } from '@chakra-ui/toast'
import moment from 'moment'
import { useSelector } from 'react-redux'

// API Service
import PhotoService from 'src/api/PhotoService'
import GalleryService from 'src/api/GalleryService'
import FileService from 'src/api/FileService'

// Components
import { ModalDeleteDocument } from 'src/components/Modals/component/ModalDeleteDocument'
import UploadFile from 'src/components/UploadFile'

// Function Helpers
import { isObjectGuidDefault } from 'src/helpers/ObjectGuid'
import { getActiveLinkByPathName } from 'src/helpers/string'
import { localeVN, dateFormat } from 'src/helpers/FomatDateTime'

// Styled Component
import SuggestSearchArchivesNumber from './SuggestSearchArchivesNumber'
import { BreadcrumbWrapper, AddDocumentWrapper, FormAddDocumentWrapper, BoxWrapper } from '../styled/AddDocumentWrapper'

const { Option } = Select
const { TextArea } = Input

const initialValues = {
  ObjectGuid: '00000000-0000-0000-0000-000000000000',
  EventName: '',
  ImageTitle: '',
  ArchivesNumber: '',
  PhotoGearNo: 0,
  PhotoPocketNo: 0,
  PhotoNo: 0,
  FilmGearNo: 0,
  FilmPocketNo: 0,
  FilmNo: 0,
  Photographer: '',
  PhotoTime: '',
  PhotoPlace: '',
  FilmSize: '',
  DeliveryUnit: '',
  DeliveryDate: '',
  InforSign: '',
  Description: '',
  Format: 1,
  SecurityLevel: 1,
  PhotoStatus: 2,
  Mode: 2,
  Colour: 1,
  StorageTimeType: 2,
  Maintenance: '',
  PhotoType: 1,
  Form: 1,
  GalleryNationalAssembly: 0,
  GalleryCongressMeeting: 0,
  GalleryMeeting: 0,
  NationalAssembly: null,
  CongressMeeting: null,
  Meeting: null,
  GalleryObjectGuid: '00000000-0000-0000-0000-000000000000',
  ImagePath: '',
  FileSecurityLevel: 0
}

function AddPhotoDocument() {
  const history = useHistory()
  const toast = useToast()
  const [form] = Form.useForm()
  const { FileObjectGuid, GalleryObjectGuid, ObjectGuid } = useParams()
  const { nationalAssembly, congressMeeting, meeting, securityLevel } = useSelector(state => state.common)

  // State
  const [fileName, setFileName] = useState('')
  const [galleryName, setGalleryName] = useState('')
  const [fileList, setFileList] = useState([])
  const [fileLink, setFileLink] = useState({})
  const [isDisable, setIsDisable] = useState(false)
  const [archivesNumber, setArchivesNumber] = useState('')
  const [fileSecurityLevel, setFileSecurityLevel] = useState(1)

  // State Loading
  const [isLoading, setIsLoading] = useState(false)

  // State Modal
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)

  // State List QHK, KHT, PH
  const [listNationalAssembly, setListNationalAssembly] = useState([])
  const [listCongressMeeting, setListCongressMeeting] = useState([])
  const [listMeeting, setListMeeting] = useState([])

  const disabledStartDate = current => {
    return current && current > moment(form.getFieldValue('DeliveryDate')).endOf('day')
  }

  const disabledEndDate = current => {
    return current && current < moment(form.getFieldValue('PhotoTime')).endOf('day')
  }

  const insertUpdatePaperDocument = (data, isContinue = false) => {
    setIsLoading(true)

    const body = {
      ...data,
      GalleryObjectGuid,
      FileSecurityLevel: fileSecurityLevel,
      NationalAssembly: data.NationalAssembly || 0,
      CongressMeeting: data.CongressMeeting || 0,
      Meeting: data.Meeting || 0,
      PhotoTime: moment(data.PhotoTime).format(),
      DeliveryDate: moment(data.DeliveryDate).format()
    }

    PhotoService.insertUpdate(body)
      .then(res => {
        setIsLoading(false)
        if (res.isError) return
        toast({
          title: `${!ObjectGuid ? 'Thêm mới tài liệu thành công' : 'Sửa tài liệu thành công'}`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        if (!isContinue) {
          history.push(`${fileLink.url}/${FileObjectGuid}/gallery/${GalleryObjectGuid}/photo`)
        } else {
          setFileList([])
          form.setFieldsValue({
            ...form.getFieldsValue(true),
            ObjectGuid: '00000000-0000-0000-0000-000000000000',
            ImageTitle: '',
            ArchivesNumber: '',
            PhotoGearNo: 0,
            PhotoPocketNo: 0,
            PhotoNo: 0,
            FilmGearNo: 0,
            FilmPocketNo: 0,
            FilmNo: 0,
            Description: '',
            Format: 1,
            SecurityLevel: 1,
            PhotoStatus: 2,
            Mode: 2,
            FilmSize: '',
            Colour: 1,
            StorageTimeType: 2,
            Maintenance: '',
            PhotoType: 1,
            Form: 1,
            ImagePath: '',
            InforSign: ''
          })
          setIsDisable(false)
          setArchivesNumber('')
        }
      })
      .finally(() => setIsLoading(false))
  }

  const onSubmitForm = (isContinue = false) => {
    form.validateFields().then(() => {
      insertUpdatePaperDocument(form.getFieldsValue(true), isContinue)
    })
  }

  const getInforByObjectGuid = () => {
    setIsLoading(true)
    Promise.all([FileService.getOne(FileObjectGuid), GalleryService.getOne(GalleryObjectGuid)])
      .then(res => {
        if (!res[0].isError && !res[0].Status) {
          setFileName(res[0].Object?.FileNo)
          setFileSecurityLevel(res[0].Object?.SecurityLevel)
        }
        if (!res[1].isError && !res[1].Status) {
          setGalleryName(res[1].Object?.OrganizationCollectCode)
          form.setFieldsValue({
            ...form.getFieldsValue(true),
            GalleryNationalAssembly: res[1].Object?.NationalAssembly,
            GalleryCongressMeeting: res[1].Object?.CongressMeeting,
            GalleryMeeting: res[1].Object?.Meeting
          })
          if (res[1].Object?.NationalAssembly) {
            setListNationalAssembly(
              nationalAssembly.filter(item => Number(item.CodeValue) === res[1].Object?.NationalAssembly)
            )
          }
          if (res[1].Object?.CongressMeeting) {
            setListCongressMeeting(
              congressMeeting.filter(item => Number(item.CodeValue) === res[1].Object?.CongressMeeting)
            )
          }
          if (res[1].Object?.Meeting) {
            setListMeeting(meeting.filter(item => Number(item.CodeValue) === res[1].Object?.Meeting))
          }
        }
      })
      .finally(() => setIsLoading(false))
  }

  const getPhotoByObjectGuid = () => {
    setIsLoading(true)

    PhotoService.getOne(ObjectGuid)
      .then(res => {
        if (!res.isError && !res.Status) {
          form.setFieldsValue({
            ...res.Object,
            NationalAssembly: res.Object?.NationalAssembly ? res.Object?.NationalAssembly : null,
            CongressMeeting: res.Object?.CongressMeeting ? res.Object?.CongressMeeting : null,
            Meeting: res.Object?.Meeting ? res.Object?.Meeting : null,
            PhotoTime: moment(res.Object?.PhotoTime),
            DeliveryDate: moment(res.Object?.DeliveryDate)
          })
          if (res.Object?.ImagePath) {
            const lastIndex = res.Object?.ImagePath?.lastIndexOf('\\')
            const listFile = {
              uid: '0',
              name: `${res.Object?.ImagePath?.slice(lastIndex + 1)}`,
              status: 'done',
              response: {
                Object: res.Object?.ImagePath
              }
            }
            setFileList([listFile])
            setArchivesNumber(res?.Object?.ArchivesNumber)
          }
        }
      })
      .finally(() => setIsLoading(false))
  }

  const onDeleteFilmDocument = content => {
    const body = {
      ObjectGuid,
      Content: content.Content
    }
    PhotoService.delete(body)
      .then(res => {
        if (res.isError) return
        toast({
          title: `Tài liệu đã được xóa`,
          status: 'success',
          position: 'bottom-right',
          duration: 2000,
          isClosable: true
        })
        history.push(`${fileLink.url}/${FileObjectGuid}/gallery/${GalleryObjectGuid}/photo`)
      })
      .finally(() => {
        setIsOpenModalDelete(false)
      })
  }

  const onChangeFile = ({ file: newFile }) => {
    setFileList([newFile])

    if (newFile?.status === 'done') {
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        ImagePath: newFile?.response?.Object
      })
    } else if (newFile?.status === 'removed') {
      setFileList([])
    } else if (newFile?.status === 'error') {
      toast({
        title: `Tải file lên thất bại`,
        status: 'error',
        position: 'bottom-right',
        duration: 2000,
        isClosable: true
      })
    }
  }

  const setValueArchivesNumber = value => {
    if (value) {
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        ArchivesNumber: value
      })
    }
  }

  const getFormByArchivesNumber = option => {
    if (option) {
      form.setFieldsValue({
        ...form.getFieldsValue(true),
        ...option,
        ObjectGuid: '00000000-0000-0000-0000-000000000000',
        DeliveryDate: moment(option?.DeliveryDate),
        PhotoTime: moment(option?.PhotoTime),
        IsExist: true
      })
      if (option?.ImagePath) {
        const lastIndex = option?.ImagePath?.lastIndexOf('\\')
        const listFile = {
          uid: '0',
          name: `${option?.ImagePath?.slice(lastIndex + 1)}`,
          status: 'done',
          response: {
            Object: option?.ImagePath
          }
        }
        setFileList([listFile])
      }
      if (option?.NationalAssembly) {
        setListNationalAssembly(nationalAssembly.filter(item => Number(item.CodeValue) === option?.NationalAssembly))
      }
      if (option?.CongressMeeting) {
        setListCongressMeeting(congressMeeting.filter(item => Number(item.CodeValue) === option?.CongressMeeting))
      }
      if (option?.Meeting) {
        setListMeeting(meeting.filter(item => Number(item.CodeValue) === option?.Meeting))
      }
      setIsDisable(true)
    } else {
      form.resetFields()
      setFileList([])
      setListNationalAssembly([])
      setListCongressMeeting([])
      setListMeeting([])
      setIsDisable(false)
      getInforByObjectGuid()
    }
  }

  useEffect(() => {
    setFileLink(getActiveLinkByPathName(history.location.pathname))
    getInforByObjectGuid()
    if (ObjectGuid) {
      getPhotoByObjectGuid()
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
          <Link to={`${fileLink.url}/${FileObjectGuid}/gallery`}>Sưu tập ảnh</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{galleryName}</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`${fileLink.url}/${FileObjectGuid}/gallery/${GalleryObjectGuid}/photo`}>Tài liệu ảnh</Link>
        </Breadcrumb.Item>
        {!ObjectGuid ? (
          <Breadcrumb.Item>Thêm mới Tài liệu ảnh</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>Xem, Sửa Tài liệu ảnh</Breadcrumb.Item>
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
            focusToFirstError
          >
            <Spin size="small" spinning={isLoading}>
              <BoxWrapper>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      label="Tên sự kiện"
                      name="EventName"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Tên sự kiện'
                        },
                        {
                          max: 500,
                          message: 'Tên sự kiện <= 500 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="Tên sự kiện" disabled={isDisable} allowClear />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      label="Tiêu đề"
                      name="ImageTitle"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Tiêu đề'
                        },
                        {
                          max: 500,
                          message: 'Tiêu đề <= 500 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="Tiêu đề" disabled={isDisable} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      label="Số lưu trữ"
                      name="ArchivesNumber"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập Số lưu trữ'
                        },
                        {
                          max: 50,
                          message: 'Số lưu trữ <= 50 ký tự'
                        }
                      ]}
                    >
                      <SuggestSearchArchivesNumber
                        archivesNumber={archivesNumber}
                        setArchivesNumber={setArchivesNumber}
                        setValueArchivesNumber={setValueArchivesNumber}
                        onSelect={getFormByArchivesNumber}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      label="Khóa"
                      name="NationalAssembly"
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
                        placeholder="Chọn Khóa"
                        disabled={isDisable}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option key={0} value={0}>
                          Không chọn
                        </Option>
                        {!!listNationalAssembly &&
                          !!listNationalAssembly.length &&
                          listNationalAssembly.map((item, idx) => (
                            <Option key={idx} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
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
                        disabled={isDisable}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option key={0} value={0}>
                          Không chọn
                        </Option>
                        {!!listCongressMeeting &&
                          !!listCongressMeeting.length &&
                          listCongressMeeting.map((item, idx) => (
                            <Option key={idx} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item
                      name="Meeting"
                      label="Phiên họp"
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
                        disabled={isDisable}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option key={0} value={0}>
                          Không chọn
                        </Option>
                        {!!listMeeting &&
                          !!listMeeting.length &&
                          listMeeting.map((item, idx) => (
                            <Option key={idx} value={Number(item.CodeValue)}>
                              {item.Text}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="Photographer"
                      label="Tác giả"
                      rules={[{ max: 300, message: 'Tên tác giả <= 300 ký tự' }]}
                    >
                      <Input placeholder="Tác giả" disabled={isDisable} />
                    </Form.Item>
                  </Col>
                  <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}>
                    {({ getFieldValue }) => (
                      <Col span={4}>
                        <Form.Item
                          name="PhotoTime"
                          label="Thời gian chụp"
                          dependencies={['DeliveryDate']}
                          required
                          rules={[
                            { required: true, message: 'Nhâp thời gian chụp' },
                            () => ({
                              validator(_, value) {
                                if (
                                  (!value ||
                                    moment(value.format('YYYY-MM-DD')).isAfter(
                                      moment(getFieldValue('DeliveryDate')).format('YYYY-MM-DD')
                                    )) &&
                                  getFieldValue('DeliveryDate')
                                ) {
                                  return Promise.reject(new Error(`Thời gian chụp phải trước Ngày giao nộp`))
                                }
                                return Promise.resolve()
                              }
                            })
                          ]}
                        >
                          <DatePicker
                            getPopupContainer={trigger => trigger.parentNode}
                            style={{ width: '100%' }}
                            locale={localeVN}
                            format={dateFormat}
                            inputReadOnly
                            disabled={isDisable}
                            disabledDate={disabledStartDate}
                          />
                        </Form.Item>
                      </Col>
                    )}
                  </Form.Item>
                </Row>
                <Row gutter={20}>
                  <Col span={8} className="custom-col-8">
                    <Form.Item
                      name="StorageTimeType"
                      label="Thời hạn bảo quản"
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập thời hạn bảo quản'
                        }
                      ]}
                    >
                      <Radio.Group disabled={isDisable}>
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
                                <InputNumber min={1} max={70} disabled={isDisable} />
                              </Form.Item>
                            </Col>
                            <div>Năm</div>
                          </>
                        ) : null
                      }
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="PhotoType" label="Loại hình">
                      <Select
                        placeholder="Chọn Loại hình"
                        getPopupContainer={trigger => trigger.parentNode}
                        disabled={isDisable}
                      >
                        <Option value={1}>Chân dung</Option>
                        <Option value={2}>Hoạt động</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="Form" label="Hình thức" required>
                      <Radio.Group disabled={isDisable}>
                        <Radio value={1}>Dương bản</Radio>
                        <Radio value={2}>Âm bản</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.Form !== currentValues.Form}
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('Form') === 1 ? (
                        <>
                          <Col span={2}>
                            <Form.Item
                              name="PhotoGearNo"
                              label="Hộp ảnh số"
                              rules={[
                                () => ({
                                  validator(_, value) {
                                    if (!value || value.toString().length <= 5) {
                                      form.setFieldsValue({
                                        ...form.getFieldsValue(true),
                                        PhotoGearNo: value.toString().replace(/\D/g, '')
                                      })
                                      return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('Nhập Hộp ảnh số <= 5 ký tự'))
                                  }
                                })
                              ]}
                            >
                              <Input disabled={isDisable} />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <Form.Item
                              name="PhotoPocketNo"
                              label="Túi ảnh số"
                              rules={[
                                () => ({
                                  validator(_, value) {
                                    if (!value || value.toString().length <= 5) {
                                      form.setFieldsValue({
                                        ...form.getFieldsValue(true),
                                        PhotoPocketNo: value.toString().replace(/\D/g, '')
                                      })
                                      return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('Nhập Túi ảnh số <= 5 ký tự'))
                                  }
                                })
                              ]}
                            >
                              <Input disabled={isDisable} />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <Form.Item
                              name="PhotoNo"
                              label="Ảnh số"
                              rules={[
                                () => ({
                                  validator(_, value) {
                                    if (!value || value.toString().length <= 5) {
                                      form.setFieldsValue({
                                        ...form.getFieldsValue(true),
                                        PhotoNo: value.toString().replace(/\D/g, '')
                                      })
                                      return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('Nhập Ảnh số <= 5 ký tự'))
                                  }
                                })
                              ]}
                            >
                              <Input disabled={isDisable} />
                            </Form.Item>
                          </Col>
                        </>
                      ) : (
                        <>
                          <Col span={2}>
                            <Form.Item
                              name="FilmGearNo"
                              label="Hộp phim số"
                              rules={[
                                () => ({
                                  validator(_, value) {
                                    if (!value || value.toString().length <= 5) {
                                      form.setFieldsValue({
                                        ...form.getFieldsValue(true),
                                        FilmGearNo: value.toString().replace(/\D/g, '')
                                      })
                                      return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('Nhập Hộp phim số <= 5 ký tự'))
                                  }
                                })
                              ]}
                            >
                              <Input disabled={isDisable} />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <Form.Item
                              name="FilmPocketNo"
                              label="Túi phim số"
                              rules={[
                                () => ({
                                  validator(_, value) {
                                    if (!value || value.toString().length <= 5) {
                                      form.setFieldsValue({
                                        ...form.getFieldsValue(true),
                                        FilmPocketNo: value.toString().replace(/\D/g, '')
                                      })
                                      return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('Nhập Túi phim số <= 5 ký tự'))
                                  }
                                })
                              ]}
                            >
                              <Input disabled={isDisable} />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <Form.Item
                              name="FilmNo"
                              label="Phim số"
                              rules={[
                                () => ({
                                  validator(_, value) {
                                    if (!value || value.toString().length <= 5) {
                                      form.setFieldsValue({
                                        ...form.getFieldsValue(true),
                                        FilmNo: value.toString().replace(/\D/g, '')
                                      })
                                      return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('Nhập Phim số <= 5 ký tự'))
                                  }
                                })
                              ]}
                            >
                              <Input disabled={isDisable} />
                            </Form.Item>
                          </Col>
                        </>
                      )
                    }
                  </Form.Item>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      label="Địa điểm chụp"
                      name="PhotoPlace"
                      rules={[{ max: 300, message: 'Địa điểm chụp không quá 300 ký tự' }]}
                    >
                      <Input placeholder="Địa điểm chụp" disabled={isDisable} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item
                      name="Colour"
                      label="Màu sắc"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa chọn màu sắc'
                        }
                      ]}
                    >
                      <Select
                        placeholder="Chọn Màu sắc"
                        getPopupContainer={trigger => trigger.parentNode}
                        disabled={isDisable}
                      >
                        <Option value={1}>Màu</Option>
                        <Option value={2}>Đen trắng</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="FilmSize"
                      label="Cỡ phim/ảnh"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa nhập kích cỡ phim/ảnh'
                        }
                      ]}
                    >
                      <Input placeholder="Cỡ phim/ảnh" disabled={isDisable} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="Format"
                      label="Tình trạng vật lý"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Chưa chọn tình trạng vật lý'
                        }
                      ]}
                    >
                      <Select
                        placeholder="Chọn tình trạng vật lý"
                        getPopupContainer={trigger => trigger.parentNode}
                        disabled={isDisable}
                      >
                        <Option value={1}>Bình thường</Option>
                        <Option value={2}>Hư hỏng</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="DeliveryUnit"
                      label="ĐV, CN giao ảnh"
                      rules={[
                        {
                          max: 100,
                          message: 'ĐV, CN giao ảnh <= 100 ký tự'
                        }
                      ]}
                    >
                      <Input placeholder="ĐV, CN giao ảnh" disabled={isDisable} />
                    </Form.Item>
                  </Col>
                  <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}>
                    {({ getFieldValue }) => (
                      <Col span={4}>
                        <Form.Item
                          name="DeliveryDate"
                          label="Ngày giao nộp"
                          dependencies={['PhotoTime']}
                          required
                          rules={[
                            { required: true, message: 'Nhập ngày giao nộp' },
                            () => ({
                              validator(_, value) {
                                if (
                                  (!value ||
                                    moment(value.format('YYYY-MM-DD')).isBefore(
                                      moment(getFieldValue('PhotoTime')).format('YYYY-MM-DD')
                                    )) &&
                                  getFieldValue('PhotoTime')
                                ) {
                                  return Promise.reject(new Error(`Ngày giao nộp phải sau Thời gian chụp`))
                                }
                                return Promise.resolve()
                              }
                            })
                          ]}
                        >
                          <DatePicker
                            getPopupContainer={trigger => trigger.parentNode}
                            style={{ width: '100%' }}
                            locale={localeVN}
                            format={dateFormat}
                            inputReadOnly
                            disabled={isDisable}
                            disabledDate={disabledEndDate}
                          />
                        </Form.Item>
                      </Col>
                    )}
                  </Form.Item>
                  <Col span={4}>
                    <Form.Item name="SecurityLevel" label="Độ bảo mật">
                      <Select
                        placeholder="Chọn Độ bảo mật"
                        getPopupContainer={trigger => trigger.parentNode}
                        disabled={isDisable}
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
                </Row>
                <Row gutter={20} style={{ alignItems: 'baseline' }}>
                  <Col>File tài liệu</Col>
                  <Col>
                    <Form.Item name="ImagePath">
                      <UploadFile
                        multiple={false}
                        accept=".png, .jpeg, .jpg, .bmp"
                        fileList={fileList}
                        onChange={onChangeFile}
                        disabled={isDisable}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <Form.Item
                      name="Description"
                      label="Ghi chú"
                      rules={[{ max: 500, message: 'Ghi chú <= 500 ký tự' }]}
                    >
                      <TextArea disabled={isDisable} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={4}>
                    <Form.Item name="Mode" label="Chế độ sử dụng">
                      <Select
                        placeholder="Chọn Chế độ sử dụng"
                        getPopupContainer={trigger => trigger.parentNode}
                        disabled={isDisable}
                      >
                        <Option value={1}>Hạn chế</Option>
                        <Option value={2}>Không hạn chế</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="InforSign"
                      label="Ký hiệu thông tin"
                      rules={[{ max: 30, message: 'Ký hiệu thông tin <= 30 ký tự' }]}
                    >
                      <Input placeholder="Ký hiệu thông tin" disabled={isDisable} />
                    </Form.Item>
                  </Col>
                </Row>
                <div className="d-flex justify-content-center">
                  <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}>
                    {({ getFieldValue }) => (
                      <Space size={20}>
                        {!isObjectGuidDefault(getFieldValue('ObjectGuid')) && (
                          <Button type="danger" key="delete" onClick={() => setIsOpenModalDelete(true)}>
                            Xóa
                          </Button>
                        )}
                        <Button type="primary" onClick={() => onSubmitForm(false)}>
                          Ghi lại
                        </Button>
                        {isObjectGuidDefault(getFieldValue('ObjectGuid')) && (
                          <Button type="primary" onClick={() => onSubmitForm(true)}>
                            Ghi lại và thêm tiếp
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
        </FormAddDocumentWrapper>
      </AddDocumentWrapper>
      <ModalDeleteDocument
        visible={isOpenModalDelete}
        onOk={content => onDeleteFilmDocument(content)}
        onCancel={() => setIsOpenModalDelete(false)}
      />
    </>
  )
}

AddPhotoDocument.propTypes = {}

export default AddPhotoDocument
