import React from 'react'
import marked from 'marked'

export default class MarkdownCell extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div 
        className={`MarkdownCell ${this.props.isSelected ? 'bShadow-11' : undefined}`}
      >
        <div dangerouslySetInnerHTML={{__html: marked(this.props.cell.content)}} />
        

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