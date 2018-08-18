import React from 'react'

import MarkdownStep from './markdown-cell'
import CodeceptjsStep from './codeceptjs-cell'

import runSteps from '../services/run-steps'

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

const resetCells = (document, fromIndex = 0, resetUrl = true) => {
  const includedCells = document.cells.slice(fromIndex, document.cells.length)

  let i = 0
  for (let cell of includedCells) {
    cell.state = 'initial'
    cell.screenshot = undefined
    cell.error = undefined
    cell.result = undefined
    if (resetUrl && i > 0) cell.url = undefined

    i++
  }
  return document
}

export default class StepEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      document: props.document
    }
  }

  handleRunAllClick = async () => {
    const document = resetCells(this.state.document)
    this.setState({document})
    runSteps(document.cells)
  }

  handleRunToSelectedClick = async () => {
    const document = resetCells(this.state.document)
    this.setState({document})

    runSteps(document.cells.slice(0, this.state.selectedCell))
  }

  handleRunSelectedClick = async () => {
    if (!this.state.selectedCell) return
    
    const cellIdx = this.state.document.cells.findIndex(cell => cell.id === this.state.selectedCell)
    const document = resetCells(this.state.document, cellIdx, false)
    this.setState({document})

    runSteps([this.state.document.cells[cellIdx]])
  }

  handleAddCellClick = () => {
    const document = this.state.document
    document.cells.push({ id: guid(), type: 'codeceptjs', state: 'initial', content: '\n I.' })
    this.setState({document})
  }

  handleDeleteCellClick = () => {
    if (!this.state.selectedCell) return
    const document = this.state.document
    const idx = document.cells.findIndex(cell => cell.id === this.state.selectedCell)
    document.cells.splice(idx, 1)
    this.setState({document})

  }

  handleCellClick = (cell) => {
    this.setState({
      selectedCell: cell.id
    })

    if (this.props.onCellSelectionChange) {
      this.props.onCellSelectionChange(cell)
    }
  }

  handleCellContentChange = (cell, newContent) => {
    const document = this.state.document
    const updatedCell = document.cells.find(c => c.id === cell.id)
    updatedCell.content = newContent

    this.setState({document})
  }

  handleCellKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {         
      console.log('SHIFT + ENTER')
    }
  }

  isSelected = (cell) => {
    return cell.id === this.state.selectedCell
  }

  renderCell = (cell, isSelected) => {
    switch (cell.type) {
      case 'markdown': 
        return <MarkdownStep 
        cell={cell} 
        isSelected={isSelected} 
        onClick={e => this.handleCellClick(cell)} />
      case 'codeceptjs': 
        return <CodeceptjsStep 
          cell={cell} 
          isSelected={isSelected} 
          onCellContentChange={this.handleCellContentChange} 
          onKeyUp={e => this.handleCellKeyPress(e)}
          onClick={e => this.handleCellClick(cell)} />
    }
  }

  render() {
    return (
      <div className="DocumentEditor">
        <div className="DocumentEditor-actions">
          <button className="button is-small" onClick={e => this.handleRunAllClick()}>
            Run All
          </button>
          <button className="button is-small" onClick={e => this.handleRunSelectedClick()}>
            Run Selected
          </button>
          <button className="button is-small" onClick={e => this.handleRunToSelectedClick()}>
            Run to Selected
          </button>
          <button className="button is-small is-primary" onClick={e => this.handleAddCellClick()}>
            Add Cell
          </button>
          <button className="button is-small is-danger" onClick={e => this.handleDeleteCellClick()}>
            Delete Cell
          </button>
        </div>
      {
        this.state.document.cells.map((cell, i) => 
          <div key={i}>
            {this.renderCell(cell, this.isSelected(cell))}
          </div>
        )
      }    
      
      <style jsx>{`
        .DocumentEditor-actions button {
          margin-left: 0.25em;
        }
      `}</style>
    </div>
    )
  }
}

