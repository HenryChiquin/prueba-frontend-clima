import WeatherSearch from './weather-search';

export default function Home() {
  return (
    <main>
      <header>
        <p className="brand">CLIMA ACTUAL</p>
        <h1>¿Cómo está el clima?</h1>
        <p className="intro">Consulta las condiciones actuales de tu ciudad.</p>
      </header>
      <WeatherSearch />
    </main>
  );
}
