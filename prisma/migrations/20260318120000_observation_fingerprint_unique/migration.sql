-- Deduplicate observations by fingerprintHash, keeping the most recent one.
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "fingerprintHash"
      ORDER BY "observedAt" DESC, "createdAt" DESC, id DESC
    ) AS rn
  FROM "AwardObservation"
)
DELETE FROM "AwardObservation"
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- Enforce dedupe at the database level.
CREATE UNIQUE INDEX "AwardObservation_fingerprintHash_key" ON "AwardObservation"("fingerprintHash");

