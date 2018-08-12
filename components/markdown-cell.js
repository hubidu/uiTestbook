import React from 'react'

export default class MarkdownCell extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={`MarkdownCell ${this.props.isSelected ? 'bShadow-11' : undefined}`}>
        

        {this.props.cell.content}
        <style jsx>{`
          .MarkdownCell {
            margin: 5px 2px;
          }
          .MarkdownCell--selected {
            border-left: 2px solid blue;
          }
        `}</style>        
      </div>
    )
  }
}