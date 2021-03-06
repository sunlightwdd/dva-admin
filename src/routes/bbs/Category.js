import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import CategoryList from '../../components/bbs/category/List'
import CategorySearch from '../../components/bbs/category/Search'
import CategoryModal from '../../components/bbs/category/ModalForm'
import {checkPower} from '../../utils'
import {ADD, UPDATE, DELETE} from '../../constants/options'

function Category({location, curPowers, dispatch, bbsCategory, modal}) {

  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)

  const {field, keyword} = location.query

  const searchProps = {
    field,
    keyword,
    addPower,
    onSearch(fieldsValue) {
      const {pathname} = location
      !!fieldsValue.keyword.length
        ? dispatch(routerRedux.push({
          pathname: pathname,
          query: {
            ...fieldsValue
          }
        }))
        : dispatch(routerRedux.push({pathname: pathname}))
    },
    onAdd() {
      dispatch({
        type: 'modal/showModal',
        payload: {
          type: 'create'
        }
      })
    }
  }

  const listProps = {
    bbsCategory,
    updatePower,
    deletePower,
    location,
    onPageChange(page) {
      const {query, pathname} = location
      dispatch(routerRedux.push({
        pathname: pathname,
        query: {
          ...query,
          current: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    onDeleteItem(id) {
      dispatch({type: 'bbsCategory/delete', payload: {id}})
    },
    onEditItem(item) {
      dispatch({
        type: 'modal/showModal',
        payload: {
          type: 'update',
          curItem: item
        }
      })
    }
  }

  const modalProps = {
    modal,
    onOk(data) {
      dispatch({
        type: !!data.cid
          ? 'bbsCategory/update'
          : 'bbsCategory/create',
        payload: {
          curItem: data
        }
      })
    },
    onCancel() {
      dispatch({type: 'modal/hideModal'})
    }
  }

  return (
    <div className='content-inner'>
      <CategorySearch {...searchProps}/>
      <CategoryList {...listProps}/>
      <CategoryModal {...modalProps}/>
    </div>
  )
}

Category.propTypes = {
  bbsCategory: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ bbsCategory, modal }) {
  return { bbsCategory, modal }
}

export default connect(mapStateToProps)(Category)
