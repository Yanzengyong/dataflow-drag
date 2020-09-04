/*
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-02 10:11:15
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-04 17:49:36
 */
import React from 'react'
import { DragGroup, DragItem } from './dragTypeList'
import { Provider } from './contextType'
import DragTypeList from './dragTypeList'
import './newDrag.css'

const a = () => {
  return (
    <div>
      <DragGroup type='box'>
        <DragItem title='yzy'/>
      </DragGroup>
    
    </div>
  )
}

export default (a)

// export default class NewApp extends React.Component {
  
//   state = {
//     initDragList: [{}]
//   }
  
//   render() {
//     const {
//       initDragList
//     } = this.state
//     return (
//       <Provider value={{}}>
//         <div className='drag_container'>
//           <div className='drag_sidebar'>
//             {
//               initDragList.map((item) => (
//                 <DragTypeList />
//               ))

//             }

//           </div>

//           <div className='drag_box'>
            
//           </div>
//         </div>
//       </Provider>
//     )
//   }
// }