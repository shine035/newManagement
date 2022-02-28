import React, { useState, useEffect } from 'react'
import { useHistory, useParams, Link } from 'react-router-dom'
import { Breadcrumb, Menu } from 'antd'

// API Service
import FileService from 'src/api/FileService'
import GalleryService from 'src/api/GalleryService'

// Component
import FilmCategory from 'src/pages/DataManagement/components/FilmCategory'
import PaperCategory from 'src/pages/DataManagement/components/PaperCategory'
import Gallery from 'src/pages/DataManagement/components/Gallery'
import PhotoDocument from 'src/pages/DataManagement/components/PhotoDocument'

// Styled Component
import { DataManagementWrapper, BreadcrumbWrapper } from 'src/pages/DataManagement/styled/DataManagementWrapper'

DetailPaperFile.propTypes = {}

DetailPaperFile.defaultProps = {}
function DetailPaperFile() {
  const { FileObjectGuid, tabActive, GalleryObjectGuid } = useParams()
  const history = useHistory()

  // State
  const [current, setCurrent] = useState(tabActive)
  const [fileName, setFileName] = useState('')
  const [galleryName, setGalleryName] = useState('')
  const [totalPaper, setTotalPaper] = useState(0)
  const [totalGallery, setTotalGallery] = useState(0)
  const [totalFilm, setTotalFilm] = useState(0)

  const handleClick = e => {
    setCurrent(e.key)
    history.push(`/paper-file/${FileObjectGuid}/${e.key}`)
  }

  const getFileByObjectGuid = () => {
    FileService.getOne(FileObjectGuid).then(res => {
      if (res?.isError) return
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
      setTotalPaper(res?.Object?.DocTotal)
      setTotalGallery(res?.Object?.GalleryTotal)
      setTotalFilm(res?.Object?.FilmTotal)
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
          <Link to="/paper-file">Danh sách hồ sơ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item> Hồ sơ {fileName}</Breadcrumb.Item>
        <Breadcrumb.Item>
          {tabActive === 'paper'
            ? 'Tài liệu giấy'
            : tabActive === 'gallery'
            ? 'Sưu tập ảnh'
            : tabActive === 'film'
            ? 'Tài liệu phim, âm thanh'
            : ''}
        </Breadcrumb.Item>
        {GalleryObjectGuid && <Breadcrumb.Item>{galleryName}</Breadcrumb.Item>}
        {GalleryObjectGuid && <Breadcrumb.Item>Tài liệu ảnh</Breadcrumb.Item>}
      </BreadcrumbWrapper>
      <Menu onClick={e => handleClick(e)} selectedKeys={[current]} mode="horizontal">
        <Menu.Item key="paper">Tài liệu giấy ({totalPaper})</Menu.Item>
        <Menu.Item key="gallery">Sưu tập ảnh ({totalGallery})</Menu.Item>
        <Menu.Item key="film">Tài liệu phim, âm thanh ({totalFilm})</Menu.Item>
      </Menu>
      {current === 'paper' ? (
        <PaperCategory />
      ) : current === 'gallery' ? (
        GalleryObjectGuid ? (
          <PhotoDocument />
        ) : (
          <Gallery />
        )
      ) : current === 'film' ? (
        <FilmCategory />
      ) : (
        ''
      )}
    </DataManagementWrapper>
  )
}

export default DetailPaperFile
