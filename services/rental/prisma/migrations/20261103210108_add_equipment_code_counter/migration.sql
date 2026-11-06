BEGIN;

CREATE TABLE "equipment_code_counter" (
    "id" VARCHAR(50) NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "equipment_code_counter_pkey" PRIMARY KEY ("id")
);

LOCK TABLE "equipment" IN SHARE ROW EXCLUSIVE MODE;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "equipment" WHERE "code" !~ '^K[0-9]+$') THEN
        RAISE EXCEPTION 'Cannot initialize equipment counter: unrecognized equipment code.';
    END IF;
END;
$$;

INSERT INTO "equipment_code_counter" ("id", "last_number")
SELECT 'equipment', COALESCE(MAX(SUBSTRING("code" FROM 2)::INTEGER), 0)
FROM "equipment";

COMMIT;
