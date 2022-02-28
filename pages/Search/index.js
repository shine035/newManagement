import React, { useState, useEffect } from 'react'
import { Pagination, Row, Space, Spin, Tooltip, Empty } from 'antd'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/toast'

// Store Redux
import actions from 'src/store/common/actions'

// API Service
import SearchDocumentService from 'src/api/SearchDocumentService'

// Component
import Icon from 'src/components/Icon/Icon'
import ButtonCustom from 'src/components/Button/Button'
import SystemAdvanceSearchWrapper from './components/SystemAdvanceSearch'

// style
import { DataListWrapper, SearchWrapper, TableHeadingWrapper, TreeWrapper } from './styled/SearchWrapper'

const initialSearch = {
  NationalAssemblyFrom: 0,
  NationalAssemblyTo: 0,
  CongressMeetingFrom: 0,
  CongressMeetingTo: 0,
  MeetingFrom: 0,
  MeetingTo: 0,
  GroupFile: 0,
  FileStatus: 0,
  TextSearch: '',
  RefType: 0,
  TypeName: 0,
  CreateDateFrom: '',
  CreateDateTo: '',
  PageSize: 20,
  CurrentPage: 1
}

export default function SearchPage() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { isGetListTicket, isLoadListSearch } = useSelector(state => state.common)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  // State
  const [conditionSearch, setConditionSearch] = useState(initialSearch)
  const [dataSearch, setDataSearch] = useState()
  const [listCheckedKeys, setListCheckedKeys] = useState([])
  const [defaultExpandedKeys, setDefaultExpandedKeys] = useState([])
  const [paginationData, setPaginationData] = useState({})

  // Modal State

  useEffect(() => {
    getListDataSearch()
  }, [isLoadListSearch])

  const getListDataSearch = () => {
    setIsLoading(true)
    // setConditionSearch(newConditionSearch)
    SearchDocumentService.getListAdvancedSearch(conditionSearch)
      .then(res => {
        if (!res.isError && !res.Status) {
          setPaginationData({
            CurrentPage: res.Object?.CurrentPage,
            PageSize: res.Object?.PageSize,
            TotalSearch: res.Object?.TotalSearch
          })
          const expand = res.Object?.Data.map((item, idx) => `${idx}`)
          setDefaultExpandedKeys(expand)
          setListCheckedKeys([])
          setDataSearch(formatTreeData(res?.Object?.Data))
          dispatch(actions.setIsLoadListSearch(false))
        }
      })
      .finally(() => setIsLoading(false))
  }

  const formatTreeData = data => {
    const newData = data.map((item, idx) => {
      const newList = item?.ltSearchDocumentResult.map((lst, idxList) => {
        return {
          ...lst,
          title: (
            <Space>
              <Space className="document-item__name">
                <Icon
                  name={lst?.RefType === 3 ? 'slideshow' : lst?.RefType === 2 ? 'image' : 'insert_drive_file'}
                  size={24}
                  color={lst?.RefType === 3 ? '#8F00FF' : lst?.RefType === 2 ? '#CE3135' : '#1574F6'}
                />
                <span className="name">{lst?.DocumentName}</span>
              </Space>
              <Space className="document-item__status-name">
                <span
                  className={
                    lst?.StatusID === 1
                      ? 'document-receiving'
                      : lst?.StatusID === 2
                      ? 'document-proposed'
                      : 'document-mining'
                  }
                >
                  {lst?.StatusName}
                </span>
                {lst?.StatusID !== 2 ? (
                  <>
                    {lst?.UserID === user?.UserID ? (
                      <Tooltip title="Xem phiếu" color="#2a2a2a">
                        <ButtonCustom
                          color="var(--color-blue-600)"
                          icon={<Icon name="remove_red_eye" size={20} className="mx-auto" />}
                          size={15}
                          onClick={() => {
                            dispatch(actions.setTicketObjectGuid(lst?.TicketObjectGuid))
                            dispatch(actions.setOpenModalDataMining())
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Lập phiếu" color="#2a2a2a">
                        <ButtonCustom
                          color="var(--text-primary)"
                          icon={<Icon name="edit" size={20} className="mx-auto" />}
                          size={15}
                          onClick={() =>
                            toast({
                              title: `Hồ sơ/Tài liệu đang được khai thác. Vui lòng chọn Hồ sơ/Tài liệu khác!`,
                              status: 'warning',
                              position: 'bottom-right',
                              duration: 2000,
                              isClosable: true
                            })
                          }
                        />
                      </Tooltip>
                    )}
                  </>
                ) : (
                  <Tooltip title="Lập phiếu" color="#2a2a2a">
                    <ButtonCustom
                      color="var(--color-primary)"
                      icon={<Icon name="edit" size={20} className="mx-auto" />}
                      size={15}
                      onClick={() => {
                        setListCheckedKeys([`${idx}-${idxList}`])
                        dispatch(
                          actions.setListReferencesFromSearch([
                            {
                              DocSubject: lst.DocumentName,
                              ReferenID: lst.RefID,
                              ReferenType: lst.RefType
                            }
                          ])
                        )
                        dispatch(actions.setTicketObjectGuid(null))
                        dispatch(actions.setOpenModalDataMining())
                      }}
                    />
                  </Tooltip>
                )}
              </Space>
            </Space>
          ),
          key: `${idx}-${idxList}`,
          disableCheckbox: lst?.StatusID === 3
        }
      })
      return {
        ...item,
        title: (
          <Space size={10}>
            <Icon name="folder_open" className="icon-parent" size={24} color="#FF6F00" />
            <b className="name">{item?.FileName}</b>
          </Space>
        ),
        key: `${idx}`,
        children: newList,
        disabled: item?.ltSearchDocumentResult?.find(lst => lst.StatusID === 3)
      }
    })
    return newData
  }

  const handleChangeEasySearch = value => {
    const newConditionSearch = {
      ...conditionSearch,
      CurrentPage: 1,
      TextSearch: value
    }

    setConditionSearch(newConditionSearch)
  }

  const handleChangeAdvanceSearch = allValues => {
    const newConditionSearch = {
      ...conditionSearch,
      ...allValues,
      CurrentPage: 1,
      CreateDateFrom: allValues.CreateDateFrom ? moment(allValues.CreateDateFrom).format() : '',
      CreateDateTo: allValues.CreateDateTo ? moment(allValues.CreateDateTo).format() : ''
    }

    setConditionSearch(newConditionSearch)
  }

  const handleChangePage = (page, pageSize) => {
    const newConditionSearch = {
      ...conditionSearch,
      PageSize: pageSize,
      CurrentPage: page
    }
    setListCheckedKeys([])
    setConditionSearch(newConditionSearch)
  }

  const onSelectDocument = (checkedKeys, node) => {
    const list = node?.checkedNodes
      .filter(item => item?.RefID)
      .map(li => {
        return {
          DocSubject: li.DocumentName,
          ReferenID: li.RefID,
          ReferenType: li.RefType
        }
      })
    setListCheckedKeys(checkedKeys)
    dispatch(actions.setListReferencesFromSearch(list))
  }

  useEffect(() => {
    getListDataSearch()
  }, [isGetListTicket, conditionSearch])

  useEffect(() => {
    return () => dispatch(actions.setCloseModalDataMining())
  }, [])

  useEffect(() => {
    getListDataSearch()
  }, [])

  return (
    <SearchWrapper>
      <Row justify="start" className="mb-3">
        <SystemAdvanceSearchWrapper
          conditionSearch={conditionSearch}
          handleChangeEasySearch={handleChangeEasySearch}
          handleChangeAdvanceSearch={handleChangeAdvanceSearch}
        />
      </Row>
      <Spin spinning={isLoading}>
        <DataListWrapper>
          <TableHeadingWrapper>
            <div>
              <div className="table-heading">Danh sách tìm kiếm</div>
              <div>Số kết quả tìm kiếm: {paginationData.TotalSearch}</div>
            </div>
            <Space>
              <ButtonCustom
                text="Lập phiếu"
                color="var(--color-primary)"
                icon={<Icon name="add" size={20} className="mx-auto" />}
                size={15}
                onClick={() => {
                  dispatch(actions.setTicketObjectGuid(null))
                  dispatch(actions.setOpenModalDataMining())
                }}
              />
            </Space>
          </TableHeadingWrapper>
          {dataSearch && !dataSearch.length ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy dữ liệu" />
          ) : (
            <TreeWrapper
              checkable
              expandedKeys={defaultExpandedKeys}
              checkedKeys={listCheckedKeys}
              treeData={dataSearch}
              onCheck={(record, checkedKeys) => onSelectDocument(record, checkedKeys)}
            />
          )}

          {paginationData.TotalSearch > 10 && (
            <>
              {!!dataSearch && !!dataSearch.length && (
                <div className="d-flex justify-content-end">
                  <Pagination
                    showSizeChanger
                    pageSize={paginationData.PageSize}
                    current={paginationData.CurrentPage}
                    total={paginationData.TotalSearch}
                    pageSizeOptions={['10', '20', '50', '100']}
                    className="styled-pagination"
                    onChange={(page, pageSize) => handleChangePage(page, pageSize)}
                  />
                </div>
              )}
            </>
          )}
        </DataListWrapper>
      </Spin>
    </SearchWrapper>
  )
}
