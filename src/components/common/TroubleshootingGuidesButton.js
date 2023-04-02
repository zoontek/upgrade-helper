import styled from '@emotion/styled'
import { Button as AntdButton, Popover } from 'antd'
import { useRef, useState } from 'react'
import { TroubleshootingGuides } from './TroubleshootingGuides'

export const testIDs = {
  troubleshootingGuidesButton: 'troubleshootingGuidesButton',
}

const Icon = styled.span`
  font-family: initial;
`

const Button = styled(AntdButton)`
  width: 32px;
  padding: 0;
  color: initial;
`

const TroubleshootingGuidesButton = () => {
  const [showContent, setShowContent] = useState(false)
  const hasHandledClick = useRef(false)

  const handlePopoverVisibilityChange = (visibility) => {
    if (hasHandledClick.current) {
      return
    }

    setShowContent(false)
  }

  const handleToggleShowContent = () => {
    hasHandledClick.current = true

    setShowContent((prevState) => !prevState)

    setTimeout(() => {
      hasHandledClick.current = false
    }, 0)
  }

  return (
    <Popover
      placement="bottomRight"
      content={<TroubleshootingGuides isTooltipOpen={showContent} />}
      trigger="click"
      open={showContent}
      onOpenChange={handlePopoverVisibilityChange}
    >
      <Button
        data-testid={testIDs.troubleshootingGuidesButton}
        onClick={handleToggleShowContent}
      >
        <Icon role="img">⚠️</Icon>
      </Button>
    </Popover>
  )
}

export { TroubleshootingGuidesButton }
