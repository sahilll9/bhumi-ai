# PostgreSQL Common Commands

## Quick Access
```bash
psql -U postgres
```

## Internal Commands
```sql
\l              -- list databases
\c bhumi_ai     -- connect to bhumi_ai database
\dt             -- list tables
\q              -- exit psql
```

## Useful Queries
```sql
-- View all farmers
SELECT * FROM farmers;

-- Check verification status
SELECT id, name, verification_status FROM farmers;
```
