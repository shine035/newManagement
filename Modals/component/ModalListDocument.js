import React, { useEffect, useState } from 'react'
import { Button, Col, Empty, Row, Select, Space, Form } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'

// API Service
import GeneralStatisticService from 'src/api/GeneralStatistic'

//
import TruncateText from 'src/components/TruncateText'
import { exportExcelURL } from 'src/helpers'

// styled
import { TableHeadingWrapper } from 'src/pages/Report/styled/DocumentCatalougeWrapper'
import ButtonCustom from 'src/components/Button/Button'
import Icon from 'src/components/Icon/Icon'
import { ModalWrapper, TableContentWrapper } from '../styled/ModalWrapper'

export const ModalListDocument = props => {
  const { title, onCancel, className, onOk, visible, dataSelected } = props
  const [isLoading, setIsLoading] = useState(false)
  const [conditionSearch, setConditionSearch] = useState(null)
  const [listDocumentSecurity, setListDocumentSecurity] = useState([])
  const [paginationData, setPaginationData] = useState({ PageSize: 20, CurrentPage: 1 })

  const columns = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      width: 50,
      render: (value, record, index) => <>{(paginationData.CurrentPage - 1) * paginationData.PageSize + index + 1}</>
    },
    {
      title: 'Tên tài liệu',
      dataIndex: 'Title',
      width: '50%',
      render: value => (
        <TruncateText maxLine={2} content={value} maxWidth="500px">
          <i>{value}</i>
        </TruncateText>
      )
    },
    {
      title: 'Độ mật',
      dataIndex: 'SecurityLevelValue'
    },
    {
      title: 'Hình thức khai thác',
      dataIndex: 'TypeValue'
    }
  ]

  const getListDocumentSecurity = () => {
    setIsLoading(true)
    GeneralStatisticService.getListDocumentSecurity(conditionSearch)
      .then(res => {
        if (res?.Error) return
        setListDocumentSecurity(res?.Object?.Data)
        setPaginationData({
          PageSize: res?.Object?.PageSize,
          CurrentPage: res?.Object?.CurrentPage,
          TotalSearch: res?.Object?.TotalSearch
        })
      })
      .finally(() => setIsLoading(false))
  }

  const handleChangeSecurityLevel = value => {
    const newConditionSearch = {
      ...conditionSearch,
      SecurityLevel: value
    }
    setConditionSearch(newConditionSearch)
  }

  const handleChangePage = (page, pageSize) => {
    const newConditionSearch = {
      ...conditionSearch,
      PageSize: pageSize,
      CurrentPage: page
    }
    setConditionSearch(newConditionSearch)
  }

  const exportDocumentSecurity = () => {
    GeneralStatisticService.exportDocumentSecurity(conditionSearch).then(res => {
      if (!res.isError) {
        exportExcelURL(res.Object)
      }
    })
  }

  useEffect(() => {
    if (conditionSearch) {
      getListDocumentSecurity()
    }
  }, [conditionSearch])

  useEffect(() => {
    if (!visible) return
    setConditionSearch({
      SecurityLevel: 0,
      DataType: dataSelected?.DataType,
      DateType: dataSelected?.DateType,
      CreateDateFrom: dataSelected?.FromDateInput && moment(dataSelected?.FromDateInput).format(),
      CreateDateTo: dataSelected?.ToDateInput && moment(dataSelected?.ToDateInput).format(),
      PageSize: 20,
      CurrentPage: 1
    })
  }, [visible])

  return (
    <ModalWrapper
      title={title || 'Danh sách tài liệu mật được khai thác '}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      closable={false}
      width={900}
      className={className}
      destroyOnClose
      footer={[
        <div className="d-flex justify-content-end" key={1}>
          <Button type="primary" key="back" onClick={onCancel}>
            Đóng
          </Button>
        </div>
      ]}
    >
      <TableHeadingWrapper>
        <div style={{ width: '35%' }}>
          <Form layout="horizontal" labelAlign="left" initialValues={{ SecurityLevel: 0 }}>
            <Row justify="start" gutter="16">
              <Col span={24}>
                <Form.Item label="Độ mật" name="SecurityLevel">
                  <Select
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentNode}
                    onSelect={value => handleChangeSecurityLevel(value)}
                  >
                    <Select.Option value={0}>Tất cả</Select.Option>
                    <Select.Option value={3}>Mật</Select.Option>
                    <Select.Option value={4}>Tối mật</Select.Option>
                    <Select.Option value={5}>Tuyệt mật</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Space>
          <ButtonCustom
            text="Xuất file"
            color="var(--color-primary)"
            icon={<Icon name="download" size={20} className="mx-auto" />}
            size={15}
            onClick={() => {
              exportDocumentSecurity()
            }}
          />
        </Space>
      </TableHeadingWrapper>
      <TableContentWrapper
        className="table-history"
        loading={isLoading}
        columns={columns}
        dataSource={listDocumentSecurity}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy dữ liệu" />
        }}
        pagination={
          paginationData.TotalSearch > 10 && {
            pageSize: paginationData.PageSize,
            current: paginationData.CurrentPage,
            total: paginationData.TotalSearch,
            pageSizeOptions: ['10', '20', '50', '100'],
            locale: { items_per_page: '' },
            onChange: (page, pageSize) => handleChangePage(page, pageSize)
          }
        }
      />
    </ModalWrapper>
  )
}

ModalListDocument.defaultProps = {
  className: 'atbd-modal'
}

ModalListDocument.propTypes = {
  dataSelected: PropTypes.object,
  visible: PropTypes.bool,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  className: PropTypes.string
}
