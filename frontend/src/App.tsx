import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Head(){
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Dy-No</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Link</a>
        </li>
        
      </ul>
    </div>
  </div>
</nav>
    )
}

function Body(){
  return(
    <div className = "container">
      <div className = "row">
        <div className="col-3">
          <Query></Query>         
          <Upload></Upload>
        </div>
        <div className="col-9">          
          <Graph></Graph>
          
          <Yap></Yap>
        </div>
      </div>
    </div>
  )
  
}

function Graph(){
  return (
    <div id = "GraphHere" className = "bigContainer">

    </div>
  )
}

function Query(){
  return(
    <div></div>
  )
}

function Upload(){
  return(
    <div className = "bigContainer">
      <label htmlFor="avatar">Choose a profile picture:</label>
      <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />1

    </div>
  )
}

function Yap(){
  return(
    <div id = "YapHere">
      <p>hiiiiiiii:3</p>
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/hello')
    .then(response => response.json())
    .then(data => setMessage(data.message))
    .catch(error => console.error('Error:', error));
  }, []);
  
  return (
    <>
      <Head></Head>
      <Body></Body>
      
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </>
  )
}

export default App
