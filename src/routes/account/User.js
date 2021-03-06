import React, {PropTypes} from 'react'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import UserList from '../../components/account/user/List'
import UserSearch from '../../components/account/user/Search'
import UserModal from '../../components/account/user/ModalForm'
import {checkPower} from '../../utils'
import {ADD, UPDATE, DELETE} from '../../constants/options'

function User({location, curPowers, dispatch, accountUser, modal}) {

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
    accountUser,
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
      dispatch({type: 'accountUser/delete', payload: {id}})
    },
    onEditItem(item) {
      dispatch({
        type: 'accountUser/showModal',
        payload: {
          type: 'update',
          curItem: item
        }
      })
    },
    onStatusItem(item) {
      dispatch({
        type: 'accountUser/updateStatus',
        payload: {
          curItem: item
        }
      })
    }
  }

  const modalProps = {
    modal,
    onOk(data) {
      dispatch({
        type: !!data.id
          ? 'accountUser/update'
          : 'accountUser/create',
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
      <UserSearch {...searchProps}/>
      <UserList {...listProps}/>
      <UserModal {...modalProps}/>
    </div>
  )
}

User.propTypes = {
  accountUser: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps({ accountUser, modal }) {
  return { accountUser, modal }
}

export default connect(mapStateToProps)(User)
