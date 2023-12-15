import React from 'react'
import SinglePost from '../components/SinglePost'
import TopBar from '../components/TopBar'

function Blogpage() {
  return (
    <div className="blog">
        <TopBar/>
        <SinglePost/>
    </div>
  )
}

export default Blogpage