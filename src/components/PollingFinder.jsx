import { useState, useEffect } from 'react';
import { trackPollingSearch } from '../lib/analytics';

export default function PollingFinder() {
  const [query, setQuery] = useState('');
  const [mapsApiKey, setMapsApiKey] = useState('');
  const [mapSrc, setMapSrc] = useState('');

  // Fetch Maps API key from server config instead of hardcoding
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const config = await res.json();
          const key = config.mapsApiKey;
          setMapsApiKey(key);
          setMapSrc(`https://www.google.com/maps/embed/v1/search?key=${key}&q=polling+booth+near+me&zoom=12`);
        }
      } catch (err) {
        // Fallback: use a default embed without API key
        console.debug('Config fetch failed, using fallback map');
        setMapSrc('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770948.039!2d77.0!3d20.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768');
      }
    }
    fetchConfig();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim() || !mapsApiKey) return;
    const encoded = encodeURIComponent(`polling booth ${query} India`);
    setMapSrc(
      `https://www.google.com/maps/embed/v1/search?key=${mapsApiKey}&q=${encoded}&zoom=13`
    );
    trackPollingSearch(query);
  };

  return (
    <div>
      <div className="section-header">
        <h2 id="finder-heading">📍 Find Your Polling Booth</h2>
        <p>Search for polling stations near your location using Google Maps</p>
        <div className="section-divider" aria-hidden="true"></div>
      </div>

      <div className="finder-container" role="region" aria-labelledby="finder-heading">
        <form className="finder-search" onSubmit={handleSearch} role="search" aria-label="Search for polling booths">
          <input
            id="polling-search-input"
            className="finder-input"
            placeholder="Enter your area, city, or pincode..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Enter your area, city, or pincode to find polling booths"
          />
          <button
            id="polling-search-btn"
            type="submit"
            className="btn-primary"
            aria-label="Search for polling booths"
          >
            🔍 Search
          </button>
        </form>

        <div className="finder-map">
          {mapSrc && (
            <iframe
              title="Polling Station Finder"
              src={mapSrc}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Google Maps showing polling station locations"
            />
          )}
        </div>

        <div className="finder-info" role="complementary" aria-label="Tips for finding your booth">
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
