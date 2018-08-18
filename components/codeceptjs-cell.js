import React from 'react'
import TextareaAutosize from 'react-autosize-textarea';

const trunc = (str, max = 80) => str && str.slice(0, max) + '...'
function syntaxHighlight(json) {
  if (typeof json != 'string') {
       json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'hl-number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'hl-key';
          } else {
              cls = 'hl-string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'hl-boolean';
      } else if (/null/.test(match)) {
          cls = 'hl-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
}

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

  handleCellClick = () => {
    this.props.onClick && this.props.onClick(this.props.cell)
  }

  handleCellKeyPress = (e) => {
    this.props.onCellKeyPress && this.props.onCellKeyPress(e)
  }

  render() {
    return (
      <div className={`CodeceptjsCell CodeceptjsCell--state-${this.props.cell.state} ${this.props.isSelected ? 'CodeceptjsCell--selected' : ''}`} 
        onClick={e => this.handleCellClick()}
      >
        <div className="CodeceptjsCell-meta">
          <a className="has-text-grey" href={this.props.cell.url} target="_blank">
            {trunc(this.props.cell.url)}
          </a>
        </div>

        <div className={`CodeceptjsCell-content`}>
        {
          this.props.isSelected ?
            <TextareaAutosize 
              ref="cellEditor"
              autoFocus="true"
              className="CodeceptjsCell-editor" 
              rows={5} 
              value={this.props.cell.content} 
              placeholder="Write codeceptjs code here"
              onChange={e => this.handleCellContentChange(e.target.value)} />
            :
            <pre>{this.props.cell.content}</pre>
        }
        </div>
        
        {
          this.props.cell.result && 
          <pre 
            className={`CodeceptjsCell-result`} 
            dangerouslySetInnerHTML={{__html: syntaxHighlight(JSON.stringify(this.props.cell.result, null, 2))}} />
        }

        {
          this.props.cell.error &&
          <div className="CodeceptjsCell-error notification is-danger is-size-7">
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
        <style jsx global>{`
        .CodeceptjsCell-editor {
          padding: 5px 1em;
          border: none;
          cursor: text;
          color: #666;
          white-space: pre-wrap;
          width: 100%;
          font-family: monospace;
          font-size: 0.8rem !important;
          background-color: #fafafa;
          line-height: 1.5em;
        }

        .CodeceptjsCell-editor:focus {
          outline:0px !important;
          -webkit-appearance:none;
        }

        `}</style>           
        <style jsx>{`
        .CodeceptjsCell {
          padding: 5px;
          padding-left: 1em;
          margin-bottom: 2px;
        }

        .CodeceptjsCell--selected {
          border: 1px solid #ddd;
          border-radius: 3px;
        }
        .CodeceptjsCell--state-initial {
        }        
        .CodeceptjsCell--state-running {
          border-left: 3px solid hsl(204, 86%, 53%);
        }
        .CodeceptjsCell--state-execution-failed {
          border-left: 3px solid hsl(348, 100%, 61%);
        }
        .CodeceptjsCell--state-execution-successful {
          border-left: 3px solid hsl(141, 71%, 48%);
        }

        .CodeceptjsCell-error {
          margin-top: 0.5em;
        }

        .CodeceptjsCell-meta {
          font-size: 0.7rem;
        }

        .CodeceptjsCell-content {
          background-color: #fafafa;
          font-size: 0.8rem !important;
        }
        
        .CodeceptjsCell-result {
          font-size: 0.7rem;
          margin-top: 3px;
          border: 1px solid #eee;
          border-radius: 3px;
          background-color: white;
          font-family: monospace;
        }
       
        `}</style>        

      </div>
    )
  }
}