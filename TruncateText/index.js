import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Tooltip } from 'antd'
import { TruncateTextWrapper } from './styled/TruncateTextWrapper'

function TruncateText(props) {
  const { children, content } = props
  const truncateElement = useRef(null)

  const [isShowTooltips, setIsShowTooltips] = useState(false)

  useEffect(() => {
    const { scrollHeight, clientHeight } = truncateElement.current

    if (scrollHeight > clientHeight) {
      setIsShowTooltips(true)
    }
    console.log(isShowTooltips)
    return () => {}
  }, [truncateElement])

  return (
    <TruncateTextWrapper {...props} ref={truncateElement}>
      <Tooltip placement="top" title={content}>
        {children}
      </Tooltip>
    </TruncateTextWrapper>
  )
}

TruncateText.propTypes = {
  maxLine: PropTypes.number,
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  content: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.node])
}

export default TruncateText
