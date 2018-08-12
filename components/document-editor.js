import React from 'react'

import MarkdownStep from './markdown-step'
import CodeceptjsStep from './codeceptjs-step'

import runSteps from '../services/run-steps'

export default class StepEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      document: props.document
    }
  }

  handleRunAllClick = async () => {
    await runSteps(this.state.document.cells)
  }

  handleRunSelectedClick = async () => {
    if (!this.state.selectedCell) return

    await runSteps(this.state.document.cells.filter(cell => cell.id === this.state.selectedCell))
  }

  handleCellClick = (cell) => {
    this.setState({
      selectedCell: cell.id
    })
  }

  isSelected = (cell) => {
    return cell.id === this.state.selectedCell
  }

  renderCell = (cell, isSelected) => {
    switch (cell.type) {
      case 'markdown': return <MarkdownStep step={cell} isSelected={isSelected} />
      case 'codeceptjs': return <CodeceptjsStep cell={cell} isSelected={isSelected} />
    }
  }

  render() {
    return (
      <div>
        <div>
          <button className="button is-small" onClick={e => this.handleRunAllClick()}>
            Run All
          </button>
          <button className="button is-small" onClick={e => this.handleRunSelectedClick()}>
            Run Selected
          </button>
        </div>
      {
        this.state.document.cells.map((cell, i) => 
          <div key={i} onClick={e => this.handleCellClick(cell)}>
            {this.renderCell(cell, this.isSelected(cell))}
          </div>
        )
      }    
      
      <style jsx>{`

      `}</style>
    </div>
    )
  }
}

