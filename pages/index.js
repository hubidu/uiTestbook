import React from 'react'
import Head from 'next/head'

import DocumentEditor from '../components/document-editor'

import getDocument from '../services/get-document'
import getElementByPoint from '../services/get-element-by-point'

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

  static async getInitialProps({}) {
    // TODO Let the user select the document (or make it configurable via url parameter)
    const document = await getDocument('WebdriverIO Example')
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

  updateScreenshot = (screenshot) => {
    if (!screenshot) return
    
    if (typeof screenshot === 'string') {
      const img = document.querySelector( "#screenshot" );
      img.src = `data:image/png;base64,${screenshot}`;

    } else {
      const arrayBufferView = new Uint8Array(screenshot);
      const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL( blob );
      const img = document.querySelector( "#screenshot" );
      img.src = imageUrl;
    }
  }

  updateCell = (cell) => {
    const document = this.state.document
    const idx = document.cells.findIndex(c => c.id === cell.id)
    document.cells[idx] = cell
    this.setState({
      document
    })

    this.updateScreenshot(cell.screenshot)
  }

  handleDeviceMessage = (message) => {
    if (message.element) {
      this.setState({highlightedElement: message.element})
      console.log(message.element)
    }
  }

  handleMessage = (message) => {
    console.log('message', message)

    this.updateCell(message.cell)
  }

  handleCellSelectionChange = selectedCell => {
    this.updateScreenshot(selectedCell.screenshot)
    this.setState({
      selectedCell
    })
  }

  handleScreenshotMouseMove = e => {
    const screenshotEl = document.getElementById('screenshot')
    const rect = screenshotEl.getBoundingClientRect()
    const point = { x: e.pageX - rect.left, y: e.pageY - rect.top }
    
    // TODO Need to scale the point using the screenshot image size

    getElementByPoint(point)
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
            <a className="browser-bar is-size-7">{this.state.selectedCell && this.state.selectedCell.screenshotUrl}</a>
            <div className="browser-screenshot">
              <img 
                id="screenshot"  
                onMouseMove={e => this.handleScreenshotMouseMove(e)} 
              />
              {
                this.state.highlightedElement &&
                <div style={{
                  position: 'absolute', 
                  pointerEvents: 'none',
                  zIndex: 1000, 
                  border: '1px solid red', 
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
        max-height: 90vh;
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
