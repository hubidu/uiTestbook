import App, {Container} from 'next/app'
import React from 'react'
import io from 'socket.io-client'

class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }
  state = {
    socket: null
  }
  componentDidMount () {
    // connect to WS server and listen event
    const socket = io('http://localhost:3001')
    this.setState({ socket })
  }

  // close socket connection
  componentWillUnmount () {
    this.state.socket.close()
  }

  render () {
    const {Component, pageProps} = this.props
    return (
      <Container>
        <Component {...pageProps} socket={this.state.socket} />
      </Container>
    )
  }
}

export default MyApp