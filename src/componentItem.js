import React from 'react'

class DragItem extends React.Component {
  render() {
    const {
      title
    } = this.props
    return (
      <li>
        {title}
      </li>
    )
  }
}

export default DragItem