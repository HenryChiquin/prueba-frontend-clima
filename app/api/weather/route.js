const providerUrl = 'https://api.openweathermap.org';

async function requestWeatherData(path, params, signal) {
  const url = new URL(path, providerUrl);
  url.search = new URLSearchParams(params);
  const response = await fetch(url, { cache: 'no-store', signal });

  if (!response.ok) throw new Error('OpenWeather no respondió correctamente.');
  return response.json();
}

function errorResponse(error, status) {
  return Response.json({ error }, { status });
}

export async function GET(request) {
  const city = new URL(request.url).searchParams.get('city')?.trim();
  if (!city || city.length > 120) {
    return errorResponse('Ingresa una ciudad de hasta 120 caracteres.', 400);
  }

  const appid = process.env.OPENWEATHER_API_KEY?.trim();
  if (!appid) {
    return errorResponse('El servicio de clima aún no está configurado.', 503);
  }

  try {
    const signal = AbortSignal.timeout(8000);
    const [location] = await requestWeatherData('/geo/1.0/direct', {
      q: city, limit: '1', appid,
    }, signal);

    if (!location) {
      return errorResponse('No encontramos esa ciudad. Revisa el nombre e intenta de nuevo.', 404);
    }

    const current = await requestWeatherData('/data/2.5/weather', {
      lat: location.lat,
      lon: location.lon,
      units: 'metric',
      lang: 'es',
      appid,
    }, signal);

    return Response.json({
      location: [location.local_names?.es || location.name, location.state, location.country]
        .filter(Boolean).join(', '),
      temperature: current.main.temp,
      humidity: current.main.humidity,
      description: current.weather[0].description,
    });
  } catch {
    return errorResponse('El servicio de clima no está disponible. Intenta de nuevo.', 502);
  }
}
