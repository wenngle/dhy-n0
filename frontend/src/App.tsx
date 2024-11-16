import { useEffect, useState } from 'react'
import './App.css'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Head() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">DHy-No</a>
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

function Body() {
  return (
    <div className="display container">
      <div className="row">
        <div className="col-3">
          <Upload></Upload>
          <br />
          <Query></Query>
        </div>
        <div className="col-9">

          <Graph apiEndpoint='/api/test_data'/>

          {/* <Yap></Yap> */}
        </div>
      </div>
    </div>
  )

}

function Graph({apiEndpoint = '/api/test_data'}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div id="GraphHere" className="bigContainer">

      <LineChart width={800} height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeOpacity={0.4}
        />
        <XAxis dataKey="Time" tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} />
        <YAxis />
        <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
        <Legend />
        <Line type="monotone" dataKey="Inj Gas Meter Volume Instantaneous" stroke="var(--skinGreen)" dot={false} />
      </LineChart>

    </div>
  )
}

function Query() {
  return (
    <div className="bigContainer">
      <button></button>
      <button></button>
      <button></button>

      <button></button>
    </div>
  )
}

function Upload() {
  return (
    <div className="bigContainer">
      <label htmlFor="avatar">Choose a profile picture:</label>
      <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />1

    </div>
  )
}

function Yap() {
  return (
    <div id="YapHere">
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
      <Body></Body>

      {/* <Head></Head> */}
    </>
  )
}

export default App
