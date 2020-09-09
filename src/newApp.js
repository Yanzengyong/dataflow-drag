/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-02 10:11:15
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-09 22:36:03
 */
import React from 'react'
import { DragGroup, ConsumerDragItem } from './drag'
import { Provider } from './contextType'
import './newDrag.css'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { DropBoxFn } from './drop'
import { jsPlumb } from 'jsplumb'

const DropBoxBox = DropBoxFn('box')
const DropBoxYzy = DropBoxFn('yzy')
class NewApp extends React.Component {
  
  state = {
    lastDropNode: {},
    DragList_A: [
      {type: 'box', id: 'box-type-fn1', title: '我是功能1的组件'},
      {type: 'box', id: 'box-type-fn2', title: '我是功能2的组件'},
      {type: 'box', id: 'box-type-fn3', title: '我是功能3的组件'}
    ],
    DragList_B: [
      {type: 'yzy', id: 'yzy-type-fn1', title: '我是Y功能组件1'},
      {type: 'yzy', id: 'yzy-type-fn2', title: '我是Y功能组件2'},
      {type: 'yzy', id: 'yzy-type-fn3', title: '我是Y功能组件3'}
    ],
    dropBoxBoxRange: {},
    dropBoxYzyRange: {},
    currentStatusDropItem: {},
    connectionList: [],
    nodeList: []
  }

  // hover效果功能
  hoverOverlayHandle = () => {
    this.JsPlumbInstance.bind('mouseover', (conn) => {
      const overlay = conn.getOverlay("custom-delete")
      if (overlay) {
        overlay.show()
      }

    })

    this.JsPlumbInstance.bind('mouseout', (conn) => {
      const overlay = conn.getOverlay("custom-delete")
      if (overlay) {
        overlay.hide()
      }

    })
  }

  // 设置放置盒子的边界
  setDropBoxRange = () => {
    const dropBoxBoxDiv = document.querySelector(`#dropBox-box`)
    const dropBoxYzyDiv = document.querySelector(`#dropBox-yzy`)
    const dropBoxBoxX = dropBoxBoxDiv.offsetWidth
    const dropBoxBoxY = dropBoxBoxDiv.offsetHeight
    const dropYzyBoxX = dropBoxYzyDiv.offsetWidth
    const dropYzyBoxY = dropBoxYzyDiv.offsetHeight

    this.setState({
      dropBoxBoxRange: {
        minX: 260,
        maxX: dropBoxBoxX + 260 - 100,
        minY: 0,
        maxY: dropBoxBoxY
      },
      dropBoxYzyRange: {
        minX: 260 + dropBoxBoxX,
        maxX: dropBoxBoxX + dropYzyBoxX + 260 - 100,
        minY: 0,
        maxY: dropYzyBoxY
      }
    })
  }

  componentDidMount() {
    this.JsPlumbInstance = jsPlumb.getInstance()
    this.JsPlumbInstance.setContainer('drag_box')
    this.JsPlumbInstance.importDefaults({

    })
    this.JsPlumbInstance.bind('connection', (conn) => {
      this.setState((prevState) => {
        return {
          connectionList: [...prevState.connectionList, conn]
        }
      }, () => {
        console.log('新增了一个连接', conn)
        
      })

    })

    this.setDropBoxRange()
    this.hoverOverlayHandle()

  }

  addItemToDropBox = (node) => {
    this.setState((prevState) => {
      return {
        lastDropNode: node,
        nodeList: [...prevState.nodeList, node]
      }
    })
  }


  onExecuteHandle = (dropId, dragInfo) => {
    console.log('我点击了执行按钮', dropId, dragInfo)
    const { nodeList } = this.state
    const currentStatusDropItem = nodeList.find((item) => item.dropId === dropId)
    
    setTimeout(() => {
      this.setState({
        currentStatusDropItem: {
          ...currentStatusDropItem,
          status: 'loading'
        }
      })
    }, 3000)
    setTimeout(() => {
      this.setState({
        currentDropItem: {
          status: 'success',
          dropId: dropId,
          dragInfo: dragInfo
        }
      })
    }, 6000)
    setTimeout(() => {
      this.setState({
        currentDropItem: {
          status: 'error',
          dropId: dropId,
          dragInfo: dragInfo
        }
      })
    }, 9000)
  }

  onSettingHandle = (dropId, dragInfo) => {
    console.log('我点击了设置按钮', dropId, dragInfo)
  }

  dropItemClickHandle = (dropId, dragInfo) => {
    console.log('我点击了被放置的节点', dropId, dragInfo)
  }

  deleteDropItemHandle = (dropId, dragInfo) => {
    console.log('我被删除了', dropId, dragInfo)
    this.JsPlumbInstance.remove(dropId)
  }

  deleteConnectHandle = (overlay) => {
    let hasOverlay = !!overlay
    if (hasOverlay) {
      this.JsPlumbInstance.bind('click', function (conn, originalEvent) {

        if (!hasOverlay) {
          return
        }
        if (window.prompt('确定删除所点击的连接吗？ 输入1确定') === '1') {
          this.deleteConnection(conn)
        }
        
        hasOverlay = false
      })
    }
  }
  
  render() {
    const {
      DragList_A,
      DragList_B,
      dropBoxBoxRange,
      dropBoxYzyRange,
      lastDropNode,
      currentStatusDropItem,
      nodeList
    } = this.state

    return (
      <Provider value={{
        nodeList: nodeList,
        lastDropNode: lastDropNode,
        currentStatusDropItem: currentStatusDropItem,
        addItemToDropBox: this.addItemToDropBox,
        onExecuteHandle: this.onExecuteHandle,
        onSettingHandle: this.onSettingHandle,
        dropItemClickHandle: this.dropItemClickHandle,
        deleteDropItemHandle: this.deleteDropItemHandle,
        deleteConnectHandle: this.deleteConnectHandle
      }}>
        <div className='drag_container'>
          <div className='drag_sidebar'>
            <DragGroup title='我是box类型的组件'>
              {
                DragList_A.map((item) => {
                  return (
                    <ConsumerDragItem key={item.id} type={item.type} info={item}/>
                  )
                })
              }
            </DragGroup>
            <DragGroup title='我是Yzy类型的组件'>
              {
                DragList_B.map((item) => {
                  return (
                    <ConsumerDragItem key={item.id} type={item.type} info={item}/>
                  )
                })
              }
            </DragGroup>
          </div>

          <div className='drag_box' id='drag_box'>

            <DropBoxBox 
              JsPlumbInstance={this.JsPlumbInstance}
              id='dropBox-box'
              range={dropBoxBoxRange} 
              type='box' 
              title='我是box类型的接收区'
            />
            <DropBoxYzy 
              JsPlumbInstance={this.JsPlumbInstance}
              id='dropBox-yzy' 
              range={dropBoxYzyRange} 
              type='yzy' 
              title='我是yzy类型的接收区'
            />
    
          </div>
        </div>
      </Provider>
    )
  }
}

export default DragDropContext(HTML5Backend)(NewApp)
