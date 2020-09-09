/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-08-24 15:12:23
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-04 22:56:20
 */
import React from 'react';
import G6 from '@antv/g6'
import { jsPlumb } from 'jsplumb'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'
import DragCom from './dragComponent'
import Drag1 from './drag1'
import DropCom from './dropBox'
import Drop2 from './dropBox2'
import { Provider } from './contextType'
import './App.css'

const initData = {
  // 点集
  nodes: [
    {
      id: 'node1', // 节点的唯一标识
      x: 100, // 节点横坐标
      y: 200, // 节点纵坐标
      label: '起始点', // 节点文本
    },
    {
      id: 'node2',
      x: 300,
      y: 200,
      label: '目标点',
    },
  ],
  // 边集
  edges: [
    // 表示一条从 node1 节点连接到 node2 节点的边
    {
      source: 'node1', // 起始点 id
      target: 'node2', // 目标点 id
      label: '我是连线', // 边的文本
    },
  ],
};

class App extends React.Component {

  state = {
    currentNode: {}
  }

  componentDidMount() {
    // console.log(jsPlumb)
    console.log(document.getElementById('node1'))
    console.log(document.getElementById('node2'))
    // const firstInstance = jsPlumb.getInstance()
    // firstInstance.importDefaults({
    //   Connector: ["Flowchart", { curviness: 150 }],
    //   Anchors: ["TopCenter", "BottomCenter"]
    // })
    // firstInstance.connect({
    //   source: 'node1',
    //   target: 'node2',
    //   endpoint: 'Dot'
    // })
    // firstInstance.draggable('node1')
    // firstInstance.draggable('node2')
  }

  // g6initHandle = () => {
  //   const graph = new G6.Graph({
  //     container: 'container', // 指定挂载容器
  //     width: 800, // 图的宽度
  //     height: 500, // 图的高度
  //   })
  //   graph.data(initData); // 加载数据
  //   graph.render(); // 渲染
  // }

  render() {
    return (
      <div className='container'>  
        {/* <div id='container'></div> */}
        {/* <h1>hello world</h1> */}
        <Provider value={{
          currentNode: this.state.currentNode
        }}>
          <DragCom setCurrentNode={(props) => {this.setState({currentNode: props})}} endDrag={() => {this.setState({currentNode: {}})}} id='node1' name='我是盒子A' />
          <Drag1 setCurrentNode={(props) => {this.setState({currentNode: props})}} endDrag={() => {this.setState({currentNode: {}})}} id='node2' name='我是盒子B' />
          <DropCom name='我是放置的组件'/>
          <Drop2 />
        </Provider>
        {/* <div id='node1' className='dragNode'>node one</div>
        <div id='node2' className='dragNode'>node two</div> */}
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(App) 
