import React from 'react'

import MarkdownStep from './markdown-cell'
import CodeceptjsStep from './codeceptjs-cell'

import runCells from '../services/run-cells'
import runAllCells from '../services/run-all-cells'

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
    cell.screenshotUrl = undefined
    cell.error = undefined
    cell.result = undefined
    if (resetUrl && i > 0) cell.url = undefined

    i++
  }
  return document
}

const createCell  = (type = 'codeceptjs') => ({ id: guid(), type, state: 'initial', content: '\n await I.' })

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

    runAllCells(document.name, document.cells)
  }

  handleRunToSelectedClick = async () => {
    const document = resetCells(this.state.document)
    this.setState({document})

    const idx = document.cells.findIndex(cell => cell.id === this.state.selectedCell)

    runAllCells(document.name, document.cells.slice(0, idx + 1))
  }

  runSelectedCells = async () => {
    if (!this.state.selectedCell) return
    
    const cellIdx = this.state.document.cells.findIndex(cell => cell.id === this.state.selectedCell)
    const document = resetCells(this.state.document, cellIdx, false)
    this.setState({document})

    runCells(document.name, [this.state.document.cells[cellIdx]])
  }

  handleAddCellClick = () => {
    this.insertCell('below')
  }

  handleDeleteCellClick = () => {
    this.cutCell()
  }

  selectAndEditNextCell = () => {
    const document = this.state.document
    const idx = document.cells.findIndex(cell => cell.id === this.state.selectedCell)
    const newSelectedCell = (idx + 1) < document.cells.length ? document.cells[idx + 1] : document.cells[0]

    this.handleCellClick(newSelectedCell)
  }

  selectNextCell = () => {
    if (this.isEditing()) return
    const document = this.state.document
    const idx = document.cells.findIndex(cell => cell.id === this.state.selectedCell)
    const newSelectedCell = (idx + 1) < document.cells.length ? document.cells[idx + 1] : document.cells[0]

    this.selectCell(newSelectedCell)
  }

  selectPreviousCell = () => {
    if (this.isEditing()) return
    const document = this.state.document
    const idx = document.cells.findIndex(cell => cell.id === this.state.selectedCell)
    const newSelectedCell = (idx - 1) >= 0 ? document.cells[idx - 1] : document.cells[document.cells.length - 1]

    this.selectCell(newSelectedCell)
  }

  handleCellClick = (cell) => {
    this.editCell(cell)
  }

  handleCellContentChange = (cell, newContent) => {
    const document = this.state.document
    const updatedCell = document.cells.find(c => c.id === cell.id)
    updatedCell.content = newContent

    this.setState({document})
  }

  handleKeypress = (e) => {
    // console.log(e)
    if (e.key === 'Enter' && e.shiftKey) {         
      e.preventDefault()
      e.stopPropagation()
      this.runSelectedCells()
      this.selectAndEditNextCell()
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      e.stopPropagation()
      this.runSelectedCells()
    } else if (e.key === 'Enter') {
      this.editSelectedCell()
    } else if (e.key === 'Escape') {
      this.stopEditingCell()
    } else if (e.key === 'ArrowUp') {
      this.selectPreviousCell()
    } else if (e.key === 'ArrowDown') {
      this.selectNextCell()
    } else if (e.key === 'A' && e.shiftKey && !this.isEditing()) {
      e.preventDefault()
      e.stopPropagation()
      this.insertCell('above')
    } else if (e.key === 'B' && e.shiftKey && !this.isEditing()) {
      e.preventDefault()
      e.stopPropagation()
      this.insertCell('below')
    } else if (e.key === 'X' && e.shiftKey && !this.isEditing()) {
      e.preventDefault()
      e.stopPropagation()
      this.cutCell()
    }

  }

  insertCell = (where = 'below') => {
    if (this.isEditing()) return
    const {document, selectedCell} = this.state
    const idx = selectedCell ? document.cells.findIndex(cell => cell.id === selectedCell) : 0

    const newCell = createCell(document.meta.type)
    where === 'above' ? document.cells.splice(idx, 0, newCell) : document.cells.splice(idx + 1, 0, newCell)

    this.setState({document, selectedCell: newCell.id, editedCell: newCell.id})
  }

  stopEditingCell = () => {
    this.setState({
      editedCell: undefined,
    })
  }

  cutCell = () => {
    const {document, selectedCell} = this.state
    if (selectedCell === undefined) return

    const idx =  document.cells.findIndex(cell => cell.id === selectedCell)
    document.cells.splice(idx, 1)

    const newSelectedCell = (idx < document.cells.length) ? document.cells[idx - 1] : undefined

    this.setState({
      document,
      selectedCell: newSelectedCell ? newSelectedCell.id : undefined,
      editedCell: undefined,
    })
  }

  editSelectedCell = () => {
    const { selectedCell } = this.state
    if (this.isEditing()) return
    if (selectedCell === undefined) return
    this.setState({
      selectedCell,
      editedCell: selectedCell,
    })
  }

  selectCell = cell => {
    if (this.isSelected(cell)) return
    
    this.setState({
      selectedCell: cell.id,
      editedCell: undefined,
    })

    this.props.onCellSelectionChange && this.props.onCellSelectionChange(cell)
  }

  editCell = cell => {
    this.setState({
      selectedCell: cell.id,
      editedCell: cell.id,
    })

    this.props.onCellSelectionChange && this.props.onCellSelectionChange(cell)
  }

  isEditing = () => {
    return this.state.editedCell !== undefined
  }

  isSelected = (cell) => {
    return cell.id === this.state.selectedCell
  }

  isEdited = (cell) => {
    return cell.id === this.state.editedCell
  }

  renderCell = (cell, isLastCell) => {
    switch (cell.type) {
      case 'markdown': 
        return <MarkdownStep 
        cell={cell} 
        isLastCell={isLastCell}
        isSelected={this.isSelected(cell)} 
        isEdited={this.isEdited(cell)}
        onClick={e => this.handleCellClick(cell)} 
      />
      case 'puppeteer': 
      case 'webdriverio':
        return <CodeceptjsStep 
          cell={cell} 
          isLastCell={isLastCell}
          isSelected={this.isSelected(cell)} 
          isEdited={this.isEdited(cell)}
          onCellContentChange={this.handleCellContentChange} 
          onClick={e => this.handleCellClick(cell)}
        />
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeypress, false)
  }

  componentWillUnmount() {
     document.removeEventListener("keydown", this.handleKeypress, false)
  }

  render() {
    return (
      <div className="DocumentEditor">
        <div className="DocumentEditor-actions">
          <button className="button is-small" onClick={e => this.handleRunAllClick()}>
            Run All
          </button>
          <button className="button is-small" onClick={e => this.runSelectedCells()}>
            Run Selected
          </button>
          <button className="button is-small" onClick={e => this.handleRunToSelectedClick()}>
            Run to Selected
          </button>
          <button className="button is-small" onClick={e => this.handleAddCellClick()}>
            Add Cell
          </button>
          <button className="button is-small" onClick={e => this.handleDeleteCellClick()}>
            Delete Cell
          </button>
        </div>
      {
        this.state.document.cells.map((cell, i) => 
          <div key={i}>
            {this.renderCell(cell, this.state.document.cells.length - 1 === i)}
          </div>
        )
      }    
      
      <style jsx>{`
        .DocumentEditor {
          margin-left: 5px;
        }
        .DocumentEditor-actions button {
          margin-left: 0.25em;
          margin-bottom: 1em;
        }
      `}</style>
    </div>
    )
  }
}

