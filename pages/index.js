import React from 'react'
import Head from 'next/head'

import DocumentEditor from '../components/document-editor'

import getDocument from '../services/get-document'
import getElementByPoint from '../services/get-element-by-point'


const createImageUrl = (screenshot) => {
  if (!screenshot) return
  
  if (typeof screenshot.screenshot === 'string') {
    return `data:image/png;base64,${screenshot.screenshot}`;
  } else {
    const arrayBufferView = new Uint8Array(screenshot.screenshot);
    const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL( blob );
    return imageUrl;
  }
}


export default class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

   // init state with the prefetched messages
   state = {
    subscribe: false,
    subscribed: false
  }

  static async getInitialProps({query: {docname}}) {
    // TODO Let the user select the document (or make it configurable via url parameter)
    const document = await getDocument(docname || 'WebdriverIO')
    return { document }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.socket && !state.subscribe) return { subscribe: true, document: props.document }
    return null
  }

  subscribe = () => {
    if (this.state.subscribe && !this.state.subscribed) {
      // connect to WS server and listen event
      this.props.socket.on('message', this.handleMessage)
      this.props.socket.on('device', this.handleDeviceMessage)
      this.setState({ subscribed: true })
      this.props.socket.emit('foo', 'bar')
    }
  }
  componentDidMount () {
    this.subscribe()
  }

  componentDidUpdate () {
    this.subscribe()
  }

  // close socket connection
  componentWillUnmount () {
    this.props.socket.off('message', this.handleMessage)
  }

  updateCell = (cell) => {
    const document = this.state.document
    const idx = document.cells.findIndex(c => c.id === cell.id)
    document.cells[idx] = cell
    this.setState({
      document
    })

    this.setState({
      selectedCell: cell,
      highlightedElement: undefined
    })
  }

  handleDeviceMessage = (message) => {
    if (message.element) {
      this.setState({highlightedElement: message.element})
    }
  }

  handleMessage = (message) => {
    console.log('message', message)

    this.updateCell(message.cell)
  }

  handleCellSelectionChange = selectedCell => {
    this.setState({
      selectedCell,
      highlightedElement: undefined
    })
  }

  handleScreenshotMouseMove = e => {
    const screenshot = this.state.selectedCell.screenshot
    if (!screenshot) return

    const screenshotEl = document.getElementById('screenshot')
    const rect = screenshotEl.getBoundingClientRect()
    const scaleFactor = screenshot.size.width / rect.width
    const x = Math.round((e.pageX - rect.left))
    const y = Math.round((e.pageY - rect.top))

    const point = { x, y }

    console.log(x, y, scaleFactor)
    getElementByPoint(point, scaleFactor)
  }

  render () {
    return (
      <div className="wrapper container is-fluid">
        <Head>
          <title>uiTestbook</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />

          <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css' />
          <link href="/static/prism.css" rel="stylesheet" />
        </Head>

        <header>
          ui
          <strong>Testbook</strong>
        </header>
        
        <div className="content">
          <div className="code">
            <DocumentEditor
              document={this.props.document} 
              onCellSelectionChange={this.handleCellSelectionChange} />
          </div>

          <div className="browser">
            <a className="browser-bar is-size-7">
              {
                this.state.selectedCell && this.state.selectedCell.screenshot && this.state.selectedCell.screenshot.url
              
              }
            </a>
            <div className="browser-screenshot">
              {
              this.state.selectedCell && this.state.selectedCell.screenshot &&
              <img 
                id="screenshot"  
                src={createImageUrl(this.state.selectedCell.screenshot)}
                onMouseMove={e => this.handleScreenshotMouseMove(e)} 
              />
              }
              {
                this.state.highlightedElement &&
                <div style={{
                  position: 'absolute', 
                  pointerEvents: 'none',
                  zIndex: 1000, 
                  backgroundColor: 'yellow',
                  opacity: 0.2,
                  top: this.state.highlightedElement.bounds.top, 
                  left: this.state.highlightedElement.bounds.left,
                  width: this.state.highlightedElement.bounds.width,
                  height: this.state.highlightedElement.bounds.height
                }}>

                </div>
              }
            </div>
          </div>
        </div>

      <style jsx global>{`
      .hl-key {
        color: hsl(204, 86%, 53%);
      }
      .hl-string {
        color: hsl(141, 71%, 48%);
      }
      .hl-number {
        color: hsl(141, 71%, 48%);

      }
      .hl-boolean {
        color: hsl(141, 71%, 48%);
      }

      html,
      body,
      #__next,
      .wrapper {
        height: 100%;
        padding: 0;
        margin: 0;
      }

      body {
        overflow:hidden;
      }

      header {
        padding: 10px;
        position: absolute;
        background: white;
        height: 30px;
        width: 100%;
      }

      #screenshot {
        display: block;
        // max-width: 100%;
        // max-height: 90vh;
        // margin: auto;
      }

      .content {
        height: 100%;
        display: -ms-flexbox;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-box;
        display: box;

        -ms-flex-direction: row;
        -webkit-box-orient: horizontal;
        -moz-box-orient: horizontal;
        -ms-box-orient: horizontal;
        box-orient: horizontal;
      }

      .code {
        width: 40%;
        -ms-flex: 0 100px;
        -webkit-box-flex:  0;
        -moz-box-flex:  0;
       -ms-box-flex:  0;
        box-flex:  0;
        padding: 5px;
        margin-top: 50px;
        overflow-y: scroll;
      }

      .browser {
        padding: 5px;
        margin-top: 50px;
        background: #fafafa;
       -ms-flex: 1;
       -webkit-box-flex: 1;
       -moz-box-flex: 1;
       -ms-box-flex: 1;
        box-flex: 1;
        overflow-y: scroll;
      }

      .browser-screenshot {
        position: relative;
      }

      `}</style>
    </div>
    )
  }
}
