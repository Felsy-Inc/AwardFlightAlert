-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "AirportCode" AS ENUM ('AMS', 'BRU', 'CDG', 'FRA', 'LHR', 'LGW', 'MAD', 'BCN', 'FCO', 'LIS', 'ATH', 'VIE', 'JFK', 'EWR', 'BOS', 'IAD', 'MIA', 'LAX', 'SFO', 'HND', 'NRT');

-- CreateEnum
CREATE TYPE "DestinationRegion" AS ENUM ('JAPAN', 'US_EAST', 'US_WEST', 'EUROPE');

-- CreateEnum
CREATE TYPE "Program" AS ENUM ('FLYING_BLUE', 'MILES_AND_MORE', 'AVIOS');

-- CreateEnum
CREATE TYPE "Cabin" AS ENUM ('BUSINESS', 'PREMIUM_ECONOMY', 'ECONOMY', 'FIRST');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProviderRunStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('NONE', 'PENDING', 'SENT', 'FAILED', 'SUPPRESSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ALERT_MATCH', 'WELCOME', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'PAST_DUE', 'CANCELED');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originAirport" "AirportCode" NOT NULL,
    "destinationRegion" "DestinationRegion" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "program" "Program" NOT NULL,
    "cabin" "Cabin" NOT NULL DEFAULT 'BUSINESS',
    "seatsNeeded" INTEGER NOT NULL,
    "maxPoints" INTEGER,
    "maxTaxes" INTEGER,
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderRun" (
    "id" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "status" "ProviderRunStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "recordsIngested" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "metadata" JSONB,

    CONSTRAINT "ProviderRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AwardObservation" (
    "id" TEXT NOT NULL,
    "providerRunId" TEXT,
    "sourceProvider" TEXT NOT NULL,
    "program" "Program" NOT NULL,
    "airline" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "originAirport" "AirportCode" NOT NULL,
    "destinationAirport" "AirportCode" NOT NULL,
    "destinationRegion" "DestinationRegion" NOT NULL,
    "departureDatetime" TIMESTAMP(3) NOT NULL,
    "arrivalDatetime" TIMESTAMP(3) NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "cabin" "Cabin" NOT NULL,
    "pointsCost" INTEGER NOT NULL,
    "taxesAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "seatsAvailable" INTEGER NOT NULL,
    "bookingUrl" TEXT,
    "bookingHint" TEXT,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fingerprintHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AwardObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertMatch" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "observationId" TEXT NOT NULL,
    "matchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notificationStatus" "NotificationStatus" NOT NULL DEFAULT 'NONE',
    "lastNotifiedAt" TIMESTAMP(3),
    "notificationFingerprint" TEXT NOT NULL,

    CONSTRAINT "AlertMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alertId" TEXT,
    "observationId" TEXT,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "providerMessageId" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Profile_email_idx" ON "Profile"("email");

-- CreateIndex
CREATE INDEX "Alert_userId_status_idx" ON "Alert"("userId", "status");

-- CreateIndex
CREATE INDEX "Alert_userId_createdAt_idx" ON "Alert"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Alert_originAirport_destinationRegion_program_status_idx" ON "Alert"("originAirport", "destinationRegion", "program", "status");

-- CreateIndex
CREATE INDEX "ProviderRun_providerName_idx" ON "ProviderRun"("providerName");

-- CreateIndex
CREATE INDEX "ProviderRun_startedAt_idx" ON "ProviderRun"("startedAt");

-- CreateIndex
CREATE INDEX "AwardObservation_originAirport_destinationRegion_program_de_idx" ON "AwardObservation"("originAirport", "destinationRegion", "program", "departureDate");

-- CreateIndex
CREATE INDEX "AwardObservation_destinationRegion_program_departureDate_idx" ON "AwardObservation"("destinationRegion", "program", "departureDate");

-- CreateIndex
CREATE INDEX "AwardObservation_fingerprintHash_idx" ON "AwardObservation"("fingerprintHash");

-- CreateIndex
CREATE INDEX "AlertMatch_alertId_idx" ON "AlertMatch"("alertId");

-- CreateIndex
CREATE INDEX "AlertMatch_observationId_idx" ON "AlertMatch"("observationId");

-- CreateIndex
CREATE UNIQUE INDEX "AlertMatch_alertId_notificationFingerprint_key" ON "AlertMatch"("alertId", "notificationFingerprint");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_createdAt_idx" ON "Notification"("type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AwardObservation" ADD CONSTRAINT "AwardObservation_providerRunId_fkey" FOREIGN KEY ("providerRunId") REFERENCES "ProviderRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertMatch" ADD CONSTRAINT "AlertMatch_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertMatch" ADD CONSTRAINT "AlertMatch_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "AwardObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "AwardObservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
