-- CreateTable
CREATE TABLE "category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickup_location" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "street" VARCHAR(100) NOT NULL,
    "house_number" VARCHAR(20) NOT NULL,
    "postal_code" CHAR(5) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "opening_hours" JSONB NOT NULL,

    CONSTRAINT "pickup_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log_entry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id" TEXT NOT NULL,
    "actor_role" VARCHAR(20) NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" TEXT NOT NULL,
    "details" JSONB,

    CONSTRAINT "audit_log_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pickup_location_street_house_number_postal_code_city_key" ON "pickup_location"("street", "house_number", "postal_code", "city");

-- CreateIndex
CREATE INDEX "audit_log_entry_entity_type_entity_id_idx" ON "audit_log_entry"("entity_type", "entity_id");
