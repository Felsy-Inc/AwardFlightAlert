import { ingestMockProvider } from '../server/services/providerIngestService'

const parseNumberArg = (value: string | undefined) => {
  if (!value) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

const main = async () => {
  const seed = process.env.SEED ?? process.argv.find((a) => a.startsWith('--seed='))?.split('=')[1]
  const observations =
    parseNumberArg(process.env.OBSERVATIONS) ??
    parseNumberArg(process.argv.find((a) => a.startsWith('--observations='))?.split('=')[1])

  const res = await ingestMockProvider({
    seed,
    observations,
  })

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        providerRunId: res.run.id,
        requested: res.requested,
        inserted: res.inserted,
        deduped: res.deduped,
      },
      null,
      2,
    ),
  )
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})

