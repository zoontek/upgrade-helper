import { DownloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { getBinaryFileURL } from '../../utils'

const DownloadFileButton = ({ open, version, path, packageName, ...props }) => {
  return open ? (
    <Button
      {...props}
      type="ghost"
      shape="circle"
      icon={<DownloadOutlined />}
      target="_blank"
      href={getBinaryFileURL({ packageName, version, path })}
    />
  ) : null
}

export default DownloadFileButton
