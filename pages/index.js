import React from 'react'
import Head from 'next/head'

import DocumentEditor from '../components/document-editor'

import getDocument from '../services/get-document'

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

   // init state with the prefetched messages
   state = {
    messages: [],
    subscribe: false,
    subscribed: false
  }

  static async getInitialProps({}) {
    const document = await getDocument('Example Document')
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

  updateScreenshot = (message) => {
    if (!message.cell.screenshot) return
    
    const arrayBufferView = new Uint8Array( message.cell.screenshot );
    const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL( blob );
    const img = document.querySelector( "#screenshot" );
    img.src = imageUrl;
  }

  updateCell = (message) => {
    const document = this.state.document
    const idx = document.cells.findIndex(c => c.id === message.cell.id)
    document.cells[idx] = message.cell
    this.setState({
      document
    })

    this.updateScreenshot(message)
  }

  // add messages from server to the state
  handleMessage = (message) => {
    console.log('message', message)

    this.updateCell(message)
  }

  render () {
    return (
      <div className="wrapper container is-fluid">
        <Head>
          <title>My Testing Notebook</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />

          <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css' />
  
        </Head>

        <header>
          <strong>iCodeceptjs </strong>
          Notebook
        </header>
        
        <div className="content">
          <div className="code">
            <DocumentEditor document={this.props.document} />
          </div>

          <div className="browser">
            <img id="screenshot" />
          </div>

        <style jsx global>{`
        html,
        body,
        #__next,
        .wrapper {
          height: 100%;
          padding: 0;
          margin: 0;
        }

        header {
          position: absolute;
          background: white;
          height: 30px;
          width: 100%;
        }

        #screenshot {
          max-width: 100%;
          max-height: 90vh;
          margin: auto;
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
          width: 33%;
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
          background: aliceblue;
         -ms-flex: 1;
         -webkit-box-flex: 1;
         -moz-box-flex: 1;
         -ms-box-flex: 1;
          box-flex: 1;
        }

        `}</style>
      </div>
      </div>
    )
  }
}
