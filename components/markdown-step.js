import React from 'react'

export default class MarkdownStep extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={`MarkdownStep ${this.props.isSelected && 'MarkdownStep--selected'}`}>
        

        {this.props.step.content}
        <style jsx>{`
          .MarkdownStep {
            margin: 5px 2px;
          }
          .MarkdownStep--selected {
            border-left: 2px solid blue;
          }
        `}</style>        
      </div>
    )
  }
}