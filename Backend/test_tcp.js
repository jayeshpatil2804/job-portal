const net = require('net');

const client = net.createConnection({ host: 'aws-1-ap-northeast-1.pooler.supabase.com', port: 6543 }, () => {
  console.log('connected to aws-1 6543');
  client.end();
});

client.on('error', (err) => {
  console.error('error on aws-1:', err.message);
});

const client0 = net.createConnection({ host: 'aws-0-ap-northeast-1.pooler.supabase.com', port: 6543 }, () => {
  console.log('connected to aws-0 6543');
  client0.end();
});

client0.on('error', (err) => {
  console.error('error on aws-0:', err.message);
});
