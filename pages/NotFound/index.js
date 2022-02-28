import React from 'react'
import { Button } from 'antd'
import { useHistory } from 'react-router-dom'

import Icon from 'src/components/Icon/Icon'
import NotFoundImage from 'src/assets/images/404.svg'

function NotFound() {
  const history = useHistory()

  return (
    <div className="d-flex justify-content-center flex-column align-items-center">
      <img src={NotFoundImage} alt="NotFoundImage" width="60%" />
      <div className="mt-5">
        <Button type="primary" icon={<Icon name="home" size={20} className="mr-2" />} onClick={() => history.push('/')}>
          Về trang chủ
        </Button>
      </div>
    </div>
  )
}

NotFound.propTypes = {}

export default NotFound
