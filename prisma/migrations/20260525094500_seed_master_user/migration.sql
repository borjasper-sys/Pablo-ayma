INSERT INTO "User" (
    "id",
    "name",
    "email",
    "passwordHash",
    "role",
    "active",
    "createdAt"
)
VALUES (
    'master-user',
    'Master',
    'Master',
    '$2b$12$EGQeRbalGXvsu7TqHafOdOxBgopMmIRjEujf5BfMxLzFWzg9DT/6O',
    'MASTER'::"Role",
    true,
    CURRENT_TIMESTAMP
)
ON CONFLICT("email") DO UPDATE SET
    "name" = 'Master',
    "passwordHash" = '$2b$12$EGQeRbalGXvsu7TqHafOdOxBgopMmIRjEujf5BfMxLzFWzg9DT/6O',
    "role" = 'MASTER'::"Role",
    "active" = true;
