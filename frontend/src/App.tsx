import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";


function CreateAlert({wells=0, cllback = () =>{}}){
  cllback(true);
  alert("Holy-Guacamole!");
  return <></>;
}

const Overveiw = () =>{
  const [w, setWells] = useState([]);
  const [alreadyShown, showAlready] = useState(false)
  useEffect(() => {
    fetch(`/api/wells`)
      .then((response) => response.json())
      .then(setWells)
      .catch((error) => console.error("Error fetching well data:", error));
  }, []);  

 var numWells = 0;
 var numGoodWells = 0;

  const wells = w.map((well) => {
    numWells += 1;
    if(well.has_hydrate == false){numGoodWells+=1;}
  });


  if(numGoodWells == numWells){
    return(
      <div className="p-3">
        <h5 className="border-bottom pb-2">Overview Status</h5>

        <div className="mb-4">
          <h6 className="text-muted mb-1">{numGoodWells}/{numWells} 
          <span> &nbsp;&nbsp; &#10003;</span></h6>
        </div>
      </div>
    );
  }
  return(
    <div className="p-3">
        <h5 className="border-bottom pb-2">Overview Status</h5>

        <div className="mb-4">
          <h6 className="text-muted mb-1">{numGoodWells}/{numWells}</h6>
        </div>
        { alreadyShown ? <></> :
        <CreateAlert wells={(numWells-numGoodWells)} cllback={showAlready} />
        }
      </div>
  );
}

const InfoPanel = ({ data }) => {  

  if (!data) {
    return (
      <div className="h-100 d-flex align-items-top justify-content-center">
        <p className="placedText">Hover over graph to see details</p>
      </div>
    );
  }

  const timestamp = new Date(data.label).toLocaleString();
  const value = data.payload[0]?.value;

  return (
    <div className="p-3">
      <h5 className="border-bottom pb-2">Point Details</h5>

      <div className="mb-4">
        <h6 className="text-muted mb-1">Timestamp</h6>
        <p className="fs-6">{timestamp}</p>
      </div>

      <div className="mb-4">
        <h6 className="text-muted mb-1">Gas Volume</h6>
        <p className="fs-6">{value?.toFixed(2)}</p>
      </div>
    </div>
  );
};

function Navigation({ onViewChange }) {
  const [uploading, setUploading] = useState(false);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', { method: 'POST', body: formData});

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      alert('File uploaded successfully: ' + result.filename);

    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <img
            src={"./dino1-01.png"}
            className="me-2"
            style={{
              height: "40px",
              width: "auto",
              objectFit: "contain",
            }}
          />
          <a className="navbar-brand fw-bold" href="#">
            DHy-No
          </a>
        </div>
        <div className="d-flex align-items-center" id="navbarSupportedContent">
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => onViewChange("grid")}
          >
            All Wells
          </button>
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => onViewChange("single")}
          >
            Single Well
          </button>
        </div>
        <div className="d-flex align-items-center">
          <div className="input-group">
            <label className="input-group-text" htmlFor="inputGroupFile">
              { uploading? 'Uploading...' : 'Upload CSV' }
            </label>
            <input
              type="file"
              className="form-control"
              id="inputGroupFile"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

const WellGrid = ({ onDataPoint }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`/api/wells`)
      .then((response) => response.json())
      .then(setData)
      .catch((error) => console.error("Error fetching well data:", error));
  }, []);

  const wells = data.map((well) => {return {
    id: well.id,
    name: well.well_name,
 };});

  return (
    <div className="row g-4">
      {wells.map(well => (
        <div key={well.id} className="col-12 col-md-6 col-lg-4">
          <WellGraph
            wellId={well.id}
            height={140}
            wellName={well.name}
            onDataPoint={onDataPoint}
          />
        </div>
      ))}
    </div>
  )
};
const SingleWellView = ({ onDataPoint }) => {
  const [selectedWell, setSelectedWell] = useState(0);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`/api/wells`)
      .then((response) => response.json())
      .then(setData)
      .catch((error) => console.error("Error fetching well data:", error));
  }, []);

  const wells = data.map((well) => {return {
    id: well.id,
    name: well.well_name,
 };});

  return (
    <div>
      <div className="mb-4">
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            >
              Select Well
            </button>
          <ul className="dropdown-menu">
            {wells.map(well => (
              <li key={well.id}>
                <button className="dropdown-item"
                onClick={() =>setSelectedWell(well.id)}
                >{well.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <WellGraph
        wellId={selectedWell}
        height={500}
        wellName={wells.find(well => well.id == selectedWell).name}
        onDataPoint={onDataPoint}
      />
    </div>
  )
}

function WellGraph({ wellId = 0, height = 500, wellName = "Test Well", onDataPoint }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/well/${wellId}`)
      .then((response) => response.json())
      .then(setData)
      .catch((error) => console.error("Error fetching well data:", error));
  }, [wellId]);

  const handleMouseMove = (props) => {
    if (props.activePayload) {
      onDataPoint({
        label: props.activeLabel,
        payload: props.activePayload
      })
    }
  };

  const handleMouseLeave = () => {
    onDataPoint(null);
  };

  return (
    <div id="GraphHere" className="card h-100">
      <div className="card-header">
        <h5 className="card-title mb-0">{wellName}</h5>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid strokeOpacity={0.4} />
            <XAxis
              dataKey="Time"
              tickFormatter={(unixTime) =>
                new Date(unixTime).toLocaleDateString()
              }
            />
            <YAxis />
            <Tooltip content = {<></>}/>

            <defs>
              <linearGradient id="wellGradient" gradientTransform="rotate(90)">
                <stop offset="20%" stopColor="#6F8155" />
                <stop offset="80%" stopColor="#AC543B" />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey={"Inj Gas Meter Volume Instantaneous"}
              stroke={"url(#wellGradient)"}
              dot={false}
            />
            {data.map((point, index) => (
              point.Hydrate && (
                <ReferenceLine
                key = {index}
                x = {point.Time}
                stroke="#AC543B"
                strokeOpacity={0.5}/>
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState("grid");
  const [hoverData, setHoverData] = useState(null);
  return (
    <div className="min-vh-100 bg-light">
      <Navigation onViewChange={setView} />
      <div className="container-fluid">
        
        <div className="row">
          <div className="col-md-3 col-lg-2 border-start bg-white shadow-sm p-0">
            <Overveiw />
            <InfoPanel data={hoverData} />
          </div>
          <div className="col-md-9 col-lg-10 p-4">
            {view == "grid" ? (
              <WellGrid onDataPoint={setHoverData} />
            ) : (
              <SingleWellView onDataPoint={setHoverData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
