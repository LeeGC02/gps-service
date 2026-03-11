const net = require('net');

const client = net.createConnection({ port: 5000, host: 'localhost' }, () => {
  console.log('🔌 Conectado al servidor TCP');

  // Simular paquete de LOGIN del ST-901
  const loginPacket = Buffer.from([
    0x78, 0x78,             // Header
    0x0d,                   // Longitud
    0x01,                   // Tipo: login
    0x03, 0x60, 0x1e, 0x3e, // IMEI simulado
    0x0e, 0x0e, 0x1c, 0x23, 
    0xc7, 0x00,
    0x00, 0x01,             // Número de serie
    0xd9, 0xdc,             // Checksum
    0x0d, 0x0a              // Final
  ]);

  client.write(loginPacket);
  console.log('📤 Login enviado');

  // Simular paquete de UBICACIÓN cada 3 segundos
  setInterval(() => {
    const locationPacket = Buffer.from([
      0x78, 0x78,             // Header
      0x11,                   // Longitud
      0x12,                   // Tipo: ubicación GPS
      // Latitud: -16.500 (La Paz Bolivia)
      0x00, 0x18, 0xd1, 0x80,
      // Longitud: -68.150
      0x00, 0x66, 0x40, 0x50,
      0x2d,                   // Velocidad: 45 km/h
      0x00, 0x01,             // Número de serie
      0xd9, 0xdc,             // Checksum
      0x0d, 0x0a              // Final
    ]);

    client.write(locationPacket);
    console.log('📤 Ubicación enviada');
  }, 3000);
});

client.on('data', (data) => {
  console.log('📥 Respuesta del servidor:', data.toString('hex'));
});

client.on('error', (err) => {
  console.error('❌ Error:', err.message);
});