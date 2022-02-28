import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { AutoComplete, Input } from 'antd'
import moment from 'moment'
import debounce from 'lodash/debounce'
import DocumentService from 'src/api/DocumentService'
import { useSelector } from 'react-redux'

function SuggestSearchFileNotation({ onSelect, disabled, setFileNotation, soKyHieu, setSoKyHieu }) {
  const { organName } = useSelector(state => state.common)
  const [options, setOptions] = useState([])
  const callBackSearch = useCallback(
    debounce(value => handleSuggestSearch(value), 200),
    []
  )

  const findOrganNameById = id => {
    const result = organName.find(item => item?.SortOrder === id)
    return result?.Text
  }

  const extractLabel = data => {
    const fileNotation = data?.FileNotation
    const OrganName = findOrganNameById(data?.OrganName)
    const issuedDate = moment(data?.IssuedDate).format('YYYY')
    const compactData = [fileNotation, OrganName, issuedDate]?.filter(f => !!f)
    return compactData?.join(' -- ')
  }

  const handleSuggestSearch = value => {
    if (value !== '') {
      DocumentService.getOneByFileNotation(value).then(res => {
        if (res?.isError) return
        if (res?.Object?.length) {
          setOptions(res?.Object?.map(obj => ({ label: extractLabel(obj), value: extractLabel(obj), data: obj })))
        }
        setFileNotation(value)
      })
    } else {
      setOptions([])
      handleSelect(value, [])
    }
  }

  const handleSelect = (value, option) => {
    if (onSelect) {
      onSelect(option?.data)
    }
  }

  return (
    <AutoComplete
      options={options}
      onSelect={handleSelect}
      onSearch={callBackSearch}
      onChange={value => setSoKyHieu(value)}
      style={{ width: '100%' }}
      disabled={disabled}
      value={soKyHieu}
    >
      <Input placeholder="Số và ký hiệu" allowClear />
    </AutoComplete>
  )
}

SuggestSearchFileNotation.propTypes = {
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
  setFileNotation: PropTypes.func,
  soKyHieu: PropTypes.string,
  setSoKyHieu: PropTypes.func
}

SuggestSearchFileNotation.defaultProps = {
  onSelect: () => {},
  disabled: false
}

export default SuggestSearchFileNotation
