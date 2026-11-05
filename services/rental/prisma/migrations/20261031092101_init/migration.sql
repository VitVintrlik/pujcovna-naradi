-- CreateEnum
CREATE TYPE "equipmentState" AS ENUM ('AVAILABLE', 'RETIRED');

-- CreateEnum
CREATE TYPE "orderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "equipment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000),
    "state" "equipmentState" NOT NULL DEFAULT 'AVAILABLE',
    "category_id" UUID NOT NULL,
    "pickup_location_id" UUID NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" TEXT NOT NULL,
    "customer_name" VARCHAR(200) NOT NULL,
    "customer_email" VARCHAR(320) NOT NULL,
    "pickup_location_id" UUID NOT NULL,
    "rental_start_date" DATE NOT NULL,
    "rental_end_date" DATE NOT NULL,
    "status" "orderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "order_id" UUID NOT NULL,
    "equipment_id" UUID NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("order_id","equipment_id")
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
CREATE UNIQUE INDEX "equipment_code_key" ON "equipment"("code");

-- CreateIndex
CREATE INDEX "equipment_pickup_location_id_state_idx" ON "equipment"("pickup_location_id", "state");

-- CreateIndex
CREATE INDEX "equipment_category_id_idx" ON "equipment"("category_id");

-- CreateIndex
CREATE INDEX "order_customer_id_idx" ON "order"("customer_id");

-- CreateIndex
CREATE INDEX "order_item_equipment_id_idx" ON "order_item"("equipment_id");

-- CreateIndex
CREATE INDEX "audit_log_entry_entity_type_entity_id_idx" ON "audit_log_entry"("entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
