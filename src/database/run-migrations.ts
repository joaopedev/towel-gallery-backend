import dataSource from './data-source';

async function runMigrations() {
  await dataSource.initialize();
  await dataSource.runMigrations();
  await dataSource.destroy();
}

void runMigrations().catch(async (error) => {
  console.error('Migration execution failed.');
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});
