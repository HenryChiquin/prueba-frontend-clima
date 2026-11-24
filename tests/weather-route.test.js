/** @jest-environment node */
import { GET } from '../app/api/weather/route';

const originalFetch = globalThis.fetch;
const originalKey = process.env.OPENWEATHER_API_KEY;

beforeEach(() => {
  globalThis.fetch = jest.fn();
  process.env.OPENWEATHER_API_KEY = 'test-key';
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) {
    delete process.env.OPENWEATHER_API_KEY;
  } else {
    process.env.OPENWEATHER_API_KEY = originalKey;
  }
});

function request(city) {
  return new Request('http://localhost/api/weather?' + new URLSearchParams({ city }));
}

test('consulta por coordenadas y devuelve los datos necesarios', async () => {
  globalThis.fetch
    .mockResolvedValueOnce(Response.json([{
      name: 'Guatemala City', local_names: { es: 'Ciudad de Guatemala' },
      lat: 14.63, lon: -90.51, country: 'GT',
    }]))
    .mockResolvedValueOnce(Response.json({
      main: { temp: 24, humidity: 65 },
      weather: [{ description: 'nublado' }],
    }));

  const result = await GET(request('  Guatemala  '));
  expect(result.status).toBe(200);
  expect(await result.json()).toEqual({
    location: 'Ciudad de Guatemala, GT', temperature: 24, humidity: 65, description: 'nublado',
  });
  const [geocodingUrl, weatherUrl] = globalThis.fetch.mock.calls.map(([url]) => url);
  expect(geocodingUrl.searchParams.get('q')).toBe('Guatemala');
  expect(weatherUrl.searchParams.get('lat')).toBe('14.63');
  expect(weatherUrl.searchParams.get('lon')).toBe('-90.51');
  expect(weatherUrl.searchParams.get('units')).toBe('metric');
  expect(weatherUrl.searchParams.get('lang')).toBe('es');
});

test.each(['', 'a'.repeat(121)])('rechaza una consulta inválida', async (city) => {
  expect((await GET(request(city))).status).toBe(400);
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test('informa que el servicio requiere configuración', async () => {
  delete process.env.OPENWEATHER_API_KEY;
  expect((await GET(request('Guatemala'))).status).toBe(503);
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test('devuelve 404 cuando la búsqueda no encuentra coordenadas', async () => {
  globalThis.fetch.mockResolvedValue(Response.json([]));
  expect((await GET(request('Ciudad inexistente'))).status).toBe(404);
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
});

test('devuelve un error público cuando falla el proveedor', async () => {
  globalThis.fetch.mockResolvedValue(new Response(null, { status: 401 }));
  const result = await GET(request('Guatemala'));
  expect(result.status).toBe(502);
  expect(await result.json()).toEqual({
    error: 'El servicio de clima no está disponible. Intenta de nuevo.',
  });
});
