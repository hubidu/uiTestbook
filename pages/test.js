import React from 'react'
import Head from 'next/head'


export default class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static async getInitialProps() {
    return {}
  }

  render () {
    return (
    <div className="wrapper">

    <div id="page-wrap">
      <div id="one-true" className="group">
        <div className="col"><h3>I am listed first in source order.</h3><p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p></div>
        <div className="col"><p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p></div>
        <div className="col"><p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p></div>
      </div>
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


    #page-wrap { 
        height: 100%; margin: 0 30px; 
    }
    #page-wrap > div { 
        // margin: 0 0 50px 0; 
        min-width: 500px; width: 100%; 
    }
    
    #one-true { 
        overflow: hidden; 
        height: 100%;
    }
    #one-true .col {
        width: 27%;
        height: 100%;
        background-color: #eee;
        padding: 30px 3.15% 0; 
        float: left;
        margin-bottom: -99999px;
        padding-bottom: 99999px;
    }
    #one-true .col:nth-child(1) { margin-left: 33.3% }
    #one-true .col:nth-child(2) { margin-left: -66.3% }
    #one-true .col:nth-child(3) { left: 0 }
    `}</style>
    </div>
    )
  }
}
