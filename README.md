# Clima actual

Aplicación de Next.js para consultar temperatura, humedad y condiciones por ciudad.

## Desarrollo local

1. Instalar las dependencias con `npm ci` 
2. Copia `.env.example` a `.env.local` y asigna tu clave activa de OpenWeather a `OPENWEATHER_API_KEY`.
3. Ejecuta `npm run dev` y abre [localhost:3000](http://localhost:3000).


La ruta de servidor consulta la API de geocodificación y el clima actual de OpenWeather. La clave se lee en el servidor. se puede buscar usando ciudad y código de país, por ejemplo `Guatemala,GT`.

## Pruebas

- `npm test` ejecuta Jest y React Testing Library.
- Las pruebas simulan las respuestas HTTP y se pueden ejecutar sin una clave de OpenWeather.
