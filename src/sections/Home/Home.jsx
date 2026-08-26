import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="home-coords" aria-hidden="true">
        <span>LAT 41.902</span>
        <span>LON 12.496</span>
      </div>

      <div className="home-title">
        <h1>MUSTAFA</h1>
        <p className="home-subtitle">
          <span className="home-subtitle-dash" />
          COMPUTER SCIENCE // AI // SOFTWARE
        </p>
      </div>

      <div className="home-stats" aria-hidden="true">
        <span>NODES 5476</span>
        <span>LATENCY 0.004 MS</span>
        <span>CYCLE 1845</span>
      </div>

      <div className="home-sector" aria-hidden="true">
        <span className="home-sector-line" />
        SECTOR 04 // OBSERVATION
        <span className="home-sector-line" />
      </div>
    </div>
  )
}

export default Home
