USE fooddash;

SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'restaurants'
    AND COLUMN_NAME = 'password_hash'
);

SET @add_column_sql = IF(
  @column_exists = 0,
  'ALTER TABLE restaurants ADD COLUMN password_hash VARCHAR(255) NULL AFTER email',
  'SELECT "restaurants.password_hash already exists"'
);

PREPARE add_column_stmt FROM @add_column_sql;
EXECUTE add_column_stmt;
DEALLOCATE PREPARE add_column_stmt;

UPDATE restaurants
SET password_hash = '$2a$10$4uGADf5ku7AnKDxBk3Z2sOC2xjxngAlsDiBhCb.3iuCC7gMfaFbJu'
WHERE password_hash IS NULL;
