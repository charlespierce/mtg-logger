module.exports = {
    DATABASE_FILE: ':memory:',
    MIGRATION_OPTIONS: {
        migrationsPath: './backend/migrations',
        force: 'last'
    }
};
