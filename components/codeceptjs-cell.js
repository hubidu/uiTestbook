import React from 'react'

export default class CodeceptjsCell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleCellContentChange = (newContent) => {
    if (this.props.onCellContentChange) {
      this.props.onCellContentChange(this.props.cell, newContent)
    }
  }

  render() {
    return (
      <div className={`CodeceptjsCell is-size-7 `}>
        <div className={`CodeceptjsCell-content CodeceptjsCell--state-${this.props.cell.state} ${this.props.isSelected ? 'bShadow-11' : undefined}`}>
          {
            this.props.isSelected ?
              <textarea className="CodeceptjsCell-contentEditable" rows={4} value={this.props.cell.content} onChange={e => this.handleCellContentChange(e.target.value)}></textarea>
              :
              <pre>{this.props.cell.content}</pre>
          }
        </div>

        {
          this.props.cell.error &&
          <div className="CodeceptjsCell-error notification is-danger">
            {this.props.cell.error.message}
            {
              this.props.cell.error.actual &&
              <div>
                Expected: ${this.props.cell.error.expected}<br/>
                Actual: ${this.props.cell.error.actual}<br/>
              </div>
            }
          </div>
        }
        <div>

        </div>
        <style jsx>{`
        .CodeceptjsCell {
          margin: 5px 2px;
          padding: 2px;
          font-family: monospace;
          background-color: #eee;
        }
        .CodeceptjsCell--selected {
          border-left: 2px solid blue;
        }
        .CodeceptjsCell--state-running {
          border-left: 2px solid blue;
        }
        .CodeceptjsCell--state-execution-failed {
          border-left: 2px solid red;
        }
        .CodeceptjsCell--state-execution-successful {
          border-left: 2px solid green;
        }

        .CodeceptjsCell-contentEditable {
          border: none;
          width: 100%;
          padding: 2px;
          font-family: monospace;
          background-color: #eee;
          font-size: 1em;
        }
        `}</style>        

      </div>
    )
  }
}