const fs = require('fs');
const { Client } = require('pg');

async function runSql(config, filePath) {
  const client = new Client(config);
  await client.connect();
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await client.query(sql);
    console.log(`✅ Ejecutado exitosamente: ${filePath}`);
  } catch(e) {
    console.error(`❌ Error en ${filePath}:`, e);
  } finally {
    await client.end();
  }
}

async function main() {
  await runSql({
    host: '100.106.74.8', port: 5433, database: 'vintelarg_base', user: 'pgadmin', password: 'Vintelarg013'
  }, '001A_create_master_tables.sql');

  await runSql({
    host: '100.106.74.8', port: 5434, database: 'aware_analytics', user: 'postgres', password: 'NovaDB2026!Segura#'
  }, '001B_create_analytics_tables.sql');
}

main();
