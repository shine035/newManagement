import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { AutoComplete, Input } from 'antd'
import debounce from 'lodash/debounce'
import PhotoService from 'src/api/PhotoService'

function SuggestSearchArchivesNumber({
  onSelect,
  disabled,
  archivesNumber,
  setArchivesNumber,
  setValueArchivesNumber
}) {
  const [options, setOptions] = useState([])
  const callBackSearch = useCallback(
    debounce(value => handleSuggestSearch(value), 200),
    []
  )

  const extractLabel = data => {
    return data?.ArchivesNumber
  }

  const handleSuggestSearch = value => {
    if (value !== '') {
      PhotoService.getOneByArchivesNumber(value).then(res => {
        if (res?.isError) return
        if (res?.Object?.length) {
          setOptions(res?.Object?.map(obj => ({ label: extractLabel(obj), value: extractLabel(obj), data: obj })))
        }
        setValueArchivesNumber(value)
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
      onChange={value => setArchivesNumber(value)}
      style={{ width: '100%' }}
      disabled={disabled}
      value={archivesNumber}
    >
      <Input placeholder="Số lưu trữ" allowClear />
    </AutoComplete>
  )
}

SuggestSearchArchivesNumber.propTypes = {
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
  archivesNumber: PropTypes.string,
  setArchivesNumber: PropTypes.func,
  setValueArchivesNumber: PropTypes.func
}

SuggestSearchArchivesNumber.defaultProps = {
  onSelect: () => {},
  disabled: false
}

export default SuggestSearchArchivesNumber
