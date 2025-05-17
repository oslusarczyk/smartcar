-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('pending', 'cancelled', 'confirmed');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "has_admin_privileges" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "brand_id" UUID NOT NULL,
    "brand_name" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("brand_id")
);

-- CreateTable
CREATE TABLE "cars" (
    "car_id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,
    "model" TEXT NOT NULL,
    "price_per_day" INTEGER NOT NULL,
    "seats_available" INTEGER NOT NULL,
    "photo" TEXT NOT NULL,
    "production_year" INTEGER NOT NULL,
    "car_description" TEXT NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("car_id")
);

-- CreateTable
CREATE TABLE "cars_locations" (
    "id" UUID NOT NULL,
    "car_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,

    CONSTRAINT "cars_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "location_id" UUID NOT NULL,
    "location_name" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "reservation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "car_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "reservation_start_date" TIMESTAMP(3) NOT NULL,
    "reservation_end_date" TIMESTAMP(3) NOT NULL,
    "reservation_price" INTEGER,
    "reservation_status" "ReservationStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("brand_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars_locations" ADD CONSTRAINT "cars_locations_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("car_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars_locations" ADD CONSTRAINT "cars_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("car_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE CASCADE ON UPDATE CASCADE;
