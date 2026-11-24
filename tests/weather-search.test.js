import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeatherSearch from '../app/weather-search';

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

async function searchFor(city) {
  const user = userEvent.setup();
  render(<WeatherSearch />);
  const input = screen.getByRole('textbox', { name: 'Ciudad' });
  await user.type(input, city);
  expect(input).toHaveValue(city);
  await user.click(screen.getByRole('button', { name: 'Buscar' }));
}

test('muestra la temperatura, humedad y descripción tras buscar', async () => {
  globalThis.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      location: 'Guatemala, GT',
      temperature: 24,
      humidity: 65,
      description: 'nublado',
    }),
  });
  await searchFor('Guatemala');
  expect(globalThis.fetch).toHaveBeenCalledWith('/api/weather?city=Guatemala');
  expect(await screen.findByRole('heading', { name: 'Guatemala, GT' })).toBeVisible();
  expect(screen.getByText('24 °C')).toBeVisible();
  expect(screen.getByText('65 %')).toBeVisible();
  expect(screen.getByText('nublado')).toBeVisible();
});

test('muestra un error para una ciudad inexistente', async () => {
  globalThis.fetch.mockResolvedValue({
    ok: false,
    json: async () => ({ error: 'No encontramos esa ciudad.' }),
  });
  await searchFor('Ciudad inexistente');
  expect(await screen.findByRole('alert')).toHaveTextContent('No encontramos esa ciudad.');
});

test('valida el campo cuando se pulsa el botón sin una ciudad', async () => {
  await searchFor('   ');
  expect(screen.getByRole('alert')).toHaveTextContent('Ingresa el nombre de una ciudad.');
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test('muestra la carga y desactiva el botón durante una búsqueda', async () => {
  let rejectRequest;
  globalThis.fetch.mockReturnValue(new Promise((_, reject) => { rejectRequest = reject; }));
  await searchFor('Guatemala');
  expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('Consultando el clima…');
  rejectRequest(new Error('Sin conexión'));
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar.');
  expect(screen.getByRole('button', { name: 'Buscar' })).toBeEnabled();
});
