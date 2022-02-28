import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Breadcrumb, Menu } from 'antd'

// API Service
import FileService from 'src/api/FileService'
import GalleryService from 'src/api/GalleryService'

// Component
import Gallery from 'src/pages/DataManagement/components/Gallery'
import PhotoDocument from 'src/pages/DataManagement/components/PhotoDocument'

// Styled Component
import { DataManagementWrapper, BreadcrumbWrapper } from 'src/pages/DataManagement/styled/DataManagementWrapper'

DetailPaperFile.propTypes = {}

DetailPaperFile.defaultProps = {}
function DetailPaperFile() {
  const { FileObjectGuid, GalleryObjectGuid } = useParams()
  // State
  const [fileName, setFileName] = useState('')
  const [galleryName, setGalleryName] = useState('')
  const [totalGallery, setTotalGallery] = useState(0)

  const getFileByObjectGuid = () => {
    FileService.getOne(FileObjectGuid).then(res => {
      setFileName(res.Object?.FileNo)
    })
  }

  const getGalleryByObjectGuid = () => {
    GalleryService.getOne(GalleryObjectGuid).then(res => {
      if (res?.isError) return
      setGalleryName(res?.Object?.OrganizationCollectCode)
    })
  }

  const getTotalDocFilmGalleryByFile = () => {
    FileService.countDocFilmGalleryByFile(FileObjectGuid).then(res => {
      if (res?.isError) return
      setTotalGallery(res?.Object?.GalleryTotal)
    })
  }

  useEffect(() => {
    if (GalleryObjectGuid) {
      getGalleryByObjectGuid()
    }
  }, [GalleryObjectGuid])

  useEffect(() => {
    Promise.all([getFileByObjectGuid(), getTotalDocFilmGalleryByFile()])
  }, [])

  return (
    <DataManagementWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb.Item>Quản lý dữ liệu</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/look-file">Danh sách hồ sơ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Hồ sơ {fileName}</Breadcrumb.Item>
        <Breadcrumb.Item>Sưu tập ảnh</Breadcrumb.Item>
        {GalleryObjectGuid && <Breadcrumb.Item>{galleryName}</Breadcrumb.Item>}
        {GalleryObjectGuid && <Breadcrumb.Item>Tài liệu ảnh</Breadcrumb.Item>}
      </BreadcrumbWrapper>
      <Menu selectedKeys="gallery" mode="horizontal">
        <Menu.Item key="gallery">Sưu tập ảnh ({totalGallery})</Menu.Item>
      </Menu>

      {GalleryObjectGuid ? <PhotoDocument /> : <Gallery />}
    </DataManagementWrapper>
  )
}

export default DetailPaperFile
