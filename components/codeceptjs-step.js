import React from 'react'


export default class CodeceptjsCell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className={`CodeceptjsCell is-size-7 CodeceptjsCell--state-${this.props.cell.state} ${this.props.isSelected ? 'box' : undefined}`}>
        <pre>
          {this.props.cell.content}
        </pre>

        {
          this.props.cell.error &&
          <div className="notification is-danger">
            {this.props.cell.error.message}
            <br/>  
            <br/>  
            Expected: ${this.props.cell.error.expected}<br/>
            Actual: ${this.props.cell.error.actual}<br/>
          </div>
        }
        <div>

        </div>
        <style jsx>{`
        .CodeceptjsCell {
          margin: 5px 2px;
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
        `}</style>        

      </div>
    )
  }
}