CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SELECT * FROM pg_extension;

INSERT INTO reflections (id, success, low_point, take_away, created_date, modified_date) 
VALUES (uuid_generate_v4(),'story', '5', 'sand creek', now(), now());
