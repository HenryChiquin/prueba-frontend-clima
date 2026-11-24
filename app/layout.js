import './globals.css';

export const metadata = {
  title: 'Clima actual',
  description: 'Consulta el clima actual de cualquier ciudad.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
