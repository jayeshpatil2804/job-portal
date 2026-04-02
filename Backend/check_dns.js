const fs = require('fs');
const dns = require('dns');

dns.lookup('aws-1-ap-northeast-1.pooler.supabase.com', (err, addresses) => {
  fs.writeFileSync('dns_res1.txt', 'aws-1: ' + (err ? err.message : addresses));
});

dns.lookup('aws-0-ap-northeast-1.pooler.supabase.com', (err, addresses) => {
  fs.writeFileSync('dns_res0.txt', 'aws-0: ' + (err ? err.message : addresses));
});
