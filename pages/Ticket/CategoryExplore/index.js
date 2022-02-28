import React, { useState } from 'react'
import { Row, Breadcrumb, Space } from 'antd'

// Component
import Icon from 'src/components/Icon/Icon'
import ButtonCustom from 'src/components/Button/Button'
import SystemAdvanceSearch from './components/SystemAdvanceSearch'

// style
import {
  CategoryExploreWrapper,
  BreadcrumbWrapper,
  TableHeadingWrapper,
  TableStyledWrapper
} from './styled/CategoryExploreWrapper'

const initialSearch = {
  TextSearch: '',
  ObjectGuidFile: '',
  NationalAssemblyFrom: 0,
  NationalAssemblyTo: 0,
  CongressMeetingFrom: 0,
  CongressMeetingTo: 0,
  MeetingFrom: 0,
  MeetingTo: 0,
  TypeName: 0,
  SecurityLevel: '',
  Mode: 0,
  IssuedDateFrom: '',
  IssuedDateTo: '',
  DocStatus: 0,
  PageSize: 10,
  CurrentPage: 1
}
function CategoryExplore() {
  const [conditionSearch, setConditionSearch] = useState(initialSearch)

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      width: 10,
      render: text => <span className="w-100">{text}</span>
    },
    {
      title: 'Hồ sơ số',
      dataIndex: 'number',
      width: 120,
      align: 'center'
    },
    {
      title: 'Số kí hiệu',
      dataIndex: 'code',
      width: 150,
      render: text => <a>{text}</a>
    },
    {
      title: 'Tiêu đề tài liệu',
      dataIndex: 'title',
      width: 300
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      width: 500
    }
  ]

  const data = [
    {
      index: 1,
      key: '1',
      number: '01',
      code: 'VB01',
      title: 'Luật môi trường',
      note: 'Chú ý'
    },
    {
      index: 2,
      key: '2',
      number: '02',
      code: 'VB01',
      title: 'Luật môi trường',
      note: 'Chú ý'
    },
    {
      index: 3,
      key: '3',
      number: 2,
      code: 'VB01',
      title: 'Luật môi trường',
      note: 'Chú ý'
    },
    {
      index: 4,
      key: '4',
      number: 2,
      code: 'VB01',
      title: 'Luật môi trường',
      note: 'Chú ý'
    },
    {
      index: 5,
      key: '5',
      number: 2,
      code: 'VB01',
      title: 'Luật môi trường',
      note: 'Chú ý'
    },
    {
      index: 6,
      key: '6',
      number: 2,
      code: 'VB01',
      title: 'Luật môi trường',
      note: 'Chú ý'
    },
    {
      index: 8,
      key: '8',
      number: 2,
      code: 'VB01',
      title: 'Luật môi trường',
      note: 'Chú ý'
    },
    {
      index: 7,
      key: '7',
      number: 2,
      code: 'VB01',
      title: 'Luật môi trường',
      note: 'Chú ý'
    }
  ]

  const handleChangeEasySearch = value => {
    const newConditionSearch = {
      ...conditionSearch,
      TextSearch: value
    }
    setConditionSearch(newConditionSearch)
  }

  const handleChangeAdvanceSearch = allValues => {
    const newConditionSearch = {
      ...conditionSearch,
      NationalAssemblyFrom: allValues.NationalAssemblyFrom,
      CongressMeetingFrom: allValues.CongressMeetingFrom,
      MeetingFrom: allValues.MeetingFrom,
      TypeName: allValues.TypeName,
      SecurityLevel: allValues.SecurityLevel,
      Mode: allValues.Mode,
      IssuedDateFrom: allValues.IssuedDateFrom,
      IssuedDateTo: allValues.IssuedDateTo,
      DocStatus: allValues.DocStatus
    }
    setConditionSearch(newConditionSearch)
  }

  const rowSelection = {
    onChange: () => {},
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
      name: record.name
    })
  }

  return (
    <CategoryExploreWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>
          <a href="">Quản lý yêu cầu SDDL</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Danh mục tài liệu phục vụ khai thác</Breadcrumb.Item>
      </BreadcrumbWrapper>

      <Row justify="start" className="mb-0">
        <SystemAdvanceSearch
          conditionSearch={conditionSearch}
          handleChangeEasySearch={handleChangeEasySearch}
          handleChangeAdvanceSearch={handleChangeAdvanceSearch}
        />
      </Row>
      <TableHeadingWrapper>
        <div>
          <div className="table-heading">Danh sách tài liệu phục vụ khai thác: 4</div>
        </div>
        <Space>
          <ButtonCustom
            text="Xuất file"
            color="var(--color-primary)"
            icon={<Icon name="download" size={20} className="mx-auto" />}
            size={15}
          />
        </Space>
      </TableHeadingWrapper>

      <TableStyledWrapper
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        columns={columns}
        dataSource={data}
      />
    </CategoryExploreWrapper>
  )
}

CategoryExplore.propTypes = {}

export default CategoryExplore
