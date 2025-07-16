# Liquibase Database Migrations

This project uses Liquibase for database schema management and migrations with YAML changelog format for better readability and maintainability.

## Overview

Liquibase is a database schema migration tool that allows you to:
- Version control your database schema
- Apply changes consistently across environments
- Rollback changes when needed
- Track migration history

## Project Structure

```
liquibase/
├── changelog/
│   ├── db.changelog-master.yaml   # Master changelog file
│   └── 001-initial-schema.yaml    # Initial schema migration
└── README.md                      # This file
```

## Configuration

The database connection is configured through environment variables in your `.env` file:

- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name (default: nodejs-template)
- `DB_USER`: Database username (default: postgres)
- `DB_PASSWORD`: Database password (default: postgres)

## Available Commands

### Using the TypeScript API (Programmatic):
The application automatically runs migrations on startup. You can also use the `LiquibaseService` in your code:

```typescript
import { liquibaseService } from './src/services/LiquibaseService';

// Apply pending migrations
await liquibaseService.update();

// Check migration status
await liquibaseService.status();

// Validate changelog syntax
await liquibaseService.validate();
```

### Using Liquibase directly (if needed):
```bash
# Apply migrations
npx liquibase update

# Check status
npx liquibase status

# Validate changelog
npx liquibase validate
```

## Creating New Migrations

1. Create a new changelog file in `liquibase/changelog/` with a descriptive name:
   ```yaml
   # 002-add-users-table.yaml
   databaseChangeLog:
     - changeSet:
         id: 002
         author: your-name
         comment: Add users table
         changes:
           - createTable:
               tableName: users
               columns:
                 - column:
                     name: id
                     type: uuid
                     defaultValueComputed: gen_random_uuid()
                     constraints:
                       primaryKey: true
                       nullable: false
                 - column:
                     name: email
                     type: varchar(255)
                     constraints:
                       nullable: false
                       unique: true
                 - column:
                     name: name
                     type: varchar(255)
                     constraints:
                       nullable: false
   ```

2. Include the new changelog in `db.changelog-master.yaml`:
   ```yaml
   databaseChangeLog:
     - include:
         file: liquibase/changelog/002-add-users-table.yaml
         relativeToChangelogFile: false
   ```

3. The migration will be applied automatically when the application starts, or you can run it programmatically:
   ```typescript
   await liquibaseService.update();
   ```

## Best Practices

1. **Always use descriptive changeSet IDs and comments**
2. **Test migrations in a development environment first**
3. **Create tags before major releases**
4. **Use rollback capabilities for testing**
5. **Keep changelog files small and focused**
6. **Use meaningful file names for changelogs**

## Integration with Application

The application automatically runs Liquibase migrations on startup through the `initializeDatabase()` function in `src/config/database.ts`. This ensures the database schema is always up to date.

## Troubleshooting

### Common Issues:

1. **Connection errors**: Check your environment variables and database connectivity
2. **Permission errors**: Ensure the database user has sufficient privileges
3. **Changelog validation errors**: Check XML syntax and schema references

### Useful Commands for Debugging:

```bash
# Check Liquibase version
npx liquibase version

# Generate SQL without executing
npx liquibase updateSQL

# Check what changes would be applied
npx liquibase status --verbose
```

## Resources

- [Liquibase Documentation](https://docs.liquibase.com/)
- [Liquibase Change Types](https://docs.liquibase.com/change-types/home.html)
- [PostgreSQL Support](https://docs.liquibase.com/databases/postgresql.html) 