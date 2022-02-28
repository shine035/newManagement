import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'antd'

function StatusStorageUnit(props) {
  const { status, statusName } = props

  const SwitchCase = () => {
    switch (status) {
      case 1:
        return (
          <div className="font-weight-bold" style={{ color: 'var(--color-blue-dark)' }}>
            <Badge status="success" /> {statusName}
          </div>
        )

      case 2:
        return (
          <div className="font-weight-bold" style={{ color: 'var(--color-red-600)' }}>
            <Badge status="error" /> {statusName}
          </div>
        )
      default:
        return 'You are a User'
    }
  }

  return <SwitchCase />
}

StatusStorageUnit.propTypes = {
  status: PropTypes.number,
  statusName: PropTypes.string
}

export default StatusStorageUnit
