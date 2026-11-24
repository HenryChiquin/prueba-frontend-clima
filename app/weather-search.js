'use client';

import { useState } from 'react';

export default function WeatherSearch() {
  const [city, setCity] = useState('');
  const [search, setSearch] = useState({ status: 'idle' });
  const isLoading = search.status === 'loading';

  async function handleSubmit(event) {
    event.preventDefault();
    if (isLoading) return;

    const query = city.trim();
    if (!query) {
      setSearch({ status: 'error', message: 'Ingresa el nombre de una ciudad.' });
      return;
    }

    setSearch({ status: 'loading' });
    try {
      const response = await fetch('/api/weather?' + new URLSearchParams({ city: query }));
      const data = await response.json();

      if (!response.ok) {
        setSearch({ status: 'error', message: data.error });
        return;
      }

      setSearch({ status: 'success', weather: data });
    } catch {
      setSearch({ status: 'error', message: 'No se pudo conectar. Intenta de nuevo.' });
    }
  }

  return (
    <section aria-label="Consulta del clima">
      <form onSubmit={handleSubmit}>
        <label htmlFor="city">Ciudad</label>
        <div className="controls">
          <input
            id="city"
            name="city"
            value={city}
            maxLength={120}
            placeholder="Ej. Ciudad de Guatemala"
            onChange={(event) => setCity(event.target.value)}
          />
          <button type="submit" disabled={isLoading}>Buscar</button>
        </div>
      </form>
      <div role="status">
        {isLoading && <p>Consultando el clima…</p>}
        {search.status === 'success' && <WeatherResult weather={search.weather} />}
      </div>
      {search.status === 'error' && <p role="alert">{search.message}</p>}
    </section>
  );
}

function WeatherResult({ weather }) {
  return (
    <article className="result">
      <h2>{weather.location}</h2>
      <p className="condition">{weather.description}</p>
      <dl>
        <div>
          <dt>Temperatura</dt>
          <dd>{weather.temperature} °C</dd>
        </div>
        <div>
          <dt>Humedad</dt>
          <dd>{weather.humidity} %</dd>
        </div>
      </dl>
    </article>
  );
}
