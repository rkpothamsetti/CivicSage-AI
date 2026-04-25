import { useState } from 'react';

export default function PollingFinder() {
  const [query, setQuery] = useState('');
  const [mapSrc, setMapSrc] = useState(
    'https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=polling+booth+near+me&zoom=12'
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const encoded = encodeURIComponent(`polling booth ${query} India`);
    setMapSrc(
      `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encoded}&zoom=13`
    );
  };

  return (
    <div>
      <div className="section-header">
        <h2>📍 Find Your Polling Booth</h2>
        <p>Search for polling stations near your location using Google Maps</p>
        <div className="section-divider"></div>
      </div>

      <div className="finder-container">
        <form className="finder-search" onSubmit={handleSearch}>
          <input
            className="finder-input"
            placeholder="Enter your area, city, or pincode..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            🔍 Search
          </button>
        </form>

        <div className="finder-map">
          <iframe
            title="Polling Station Finder"
            src={mapSrc}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="finder-info">
          <strong>📌 Tips to find your booth:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
            <li>Search by your area name, locality, or PIN code</li>
            <li>You can also check your exact booth at <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer">voters.eci.gov.in</a></li>
            <li>Use the <a href="https://play.google.com/store/apps/details?id=com.eci.citizen" target="_blank" rel="noopener noreferrer">Voter Helpline App</a> for booth-level details</li>
            <li>Carry your Voter ID (EPIC) or any approved photo ID on polling day</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
