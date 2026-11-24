import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import RootLayout from '../app/layout';

test('la página inicial presenta el formulario de búsqueda', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: '¿Cómo está el clima?' })).toBeVisible();
  expect(screen.getByRole('textbox', { name: 'Ciudad' })).toBeVisible();
});

test('el documento declara el idioma de la interfaz', () => {
  expect(RootLayout({ children: null }).props.lang).toBe('es');
});
