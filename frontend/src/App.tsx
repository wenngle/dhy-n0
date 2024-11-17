import { useEffect, useState } from 'react'
import './App.css'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Head() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        
      <img src = {"./dino1-01.png"}/>
        <a className="navbar-brand" href="#">DHy-No</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
              <button type = "button" className="nav-link active" aria-current="page" onClick={
                function(){
                  document.getElementById('displayAllGraphs').style.display = "block";
                  document.getElementById('displayOneGraph').style.display = "none"; 
                }
              }>all 9</button>
            </li>
            <li className="nav-item">
              <button type = "button" className="nav-link active" aria-current="page" onClick={
                function(){
                  document.getElementById('displayAllGraphs').style.display = "none";
                  document.getElementById('displayOneGraph').style.display = "block"; 
                }
              }
              > one at a time</button>
            </li>

          </ul>
          
          <Upload></Upload>
        </div>
      </div>
    </nav>
  )
}

function Body() {
  return (
    <div className="display container">
      <div className="row">
        <div id = "toolTip" className="col-2">
          {/* <Upload></Upload>
          <br />
          <Query></Query> */}
        </div>
        <div id = "GraphDisplay" className="col-10">
          <GraphWrapper></GraphWrapper>

          {/* <Yap></Yap> */}
        </div>
      </div>
    </div>
  )

}

function GraphWrapper(){
  // var displayAll= "<div className = 'row'><div className = 'col-4'><Graph apiEndpoint='/api/test_data'/></div> <div className = 'col-4'><Graph apiEndpoint='/api/test_data'/></div> <div className = 'col-4'><Graph apiEndpoint='/api/test_data'/></div  </div> <div className = 'row'>          <div className = 'col-4'><Graph apiEndpoint='/api/test_data'/></div>          <div className = 'col-4'><Graph apiEndpoint='/api/test_data'/></div>          <div className = 'col-4'><Graph apiEndpoint='/api/test_data'/></div> </div> <div className = 'row'> <div className = 'col-4'><Graph apiEndpoint='/api/test_data'/></div> <div className = 'col-4'><Graph apiEndpoint='/api/test_data'/></div> <div className = 'col-4'><Graph apiEndpoint='/api/test_data'/></div> </div> </div>"
  
  function DisplayAll(){
    var h = 140;
    return (

      <>
        <div className = "row">
          <div className = "col-4">
            <Graph apiEndpoint='/api/well/0' Height={h} WellName="Well 1" />
          </div>
          <div className = "col-4">
            <Graph apiEndpoint='/api/well/1' Height={h} WellName="Well 2"/></div>
          <div className = "col-4">
            <Graph apiEndpoint='/api/well/2' Height={h} WellName="Well 3"/></div>
        </div>
        <div className = "row">
          <div className = "col-4">
            <Graph apiEndpoint='/api/well/3' Height={h} WellName="Well 4"/></div>
          <div className = "col-4">
            <Graph apiEndpoint='/api/well/4' Height={h} WellName="Well 5"/></div>
          <div className = "col-4">
            <Graph apiEndpoint='/api/well/5' Height={h} WellName="Well 6"/></div>
        </div>
        <div className = "row">
          <div className = "col-4">
            <Graph apiEndpoint='/api/well/6' Height={h} WellName="Well 7"/></div>
          <div className = "col-4">
            <Graph apiEndpoint='/api/well/7' Height={h} WellName="Well 8"/></div>
          <div className = "col-4">
            <Graph apiEndpoint='/api/well/8' Height={h} WellName="Well 9"/></div>
        </div>
      </>
    );
  }
  function DisplayOne(){
    return (

      <>
        <div className = "singleWells col-12s"><Graph apiEndpoint="/api/well/0" WellName="Well 1"/></div>
      </>
    );
  }
  
  
  
  return(
      <div id = "graphDisplayContainer">
        
      <br />
        <div id = "displayAllGraphs">
          <DisplayAll />
        </div>
        <div id = "displayOneGraph">
          <DisplayOne />
        </div>
      </div>
    );

}

const labelFormatter = ({ label }) => {
  return (label) => new Date(label).toLocaleString();
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    function getData(){
      const formattedDate = (dlabel) => new Date(dlabel).toLocaleString();
      console.log(formattedDate(label)); 

      return(<labelFormatter />)
    }
        
    document.getElementById('toolTip').innerHTML = getData();
    return ( <></>
      // <div className="custom-tooltip">
      //   <p className="label">{`${(label) => new Date(label).toLocaleString()} : ${payload[0].value}`}</p>
      //   <p className="intro">{"hi"}</p>
      //   <p className="desc">Anything you want can be displayed here.</p>
      // </div>
    );
  }
  document.getElementById('toolTip').innerHTML = "no";
  return null;
};

function Graph({apiEndpoint = '/api/test_data', Height=500, WellName = "TestWell"}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div id="GraphHere" className="bigContainer">
      <div className="wellNameTitle">{WellName}</div>
      <ResponsiveContainer width = "100%" height = {Height}>
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeOpacity={0.4}
          />
          <XAxis dataKey="Time" tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} />
          <YAxis />
          {/* <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} /> */}
          <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} content={<CustomTooltip />} />
          
           <defs>
            <linearGradient id="myGradient" gradientTransform="rotate(90)">
              <stop offset="20%" stopColor="#6F8155" />
              <stop offset="80%" stopColor="#AC543B" />
            </linearGradient>
          </defs>
          <Line type="monotone" dataKey={"Inj Gas Meter Volume Instantaneous"} stroke={"url(#myGradient)"} dot={false} />
        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}

function Upload() {
  return (
    <div className="rightNav">
      <label htmlFor="avatar">Upload New</label>
      <input type="file" id="avatar" name="avatar" accept="csv" />

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


      {/* <Head></Head> */}
    </>
  )
}

export default App
