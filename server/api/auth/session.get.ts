import { getSupabaseUser } from '~lib/auth/supabaseServer'
import { prisma } from '~lib/db/client'

export default defineEventHandler(async (event) => {
  const user = await getSupabaseUser(event)

  if (!user) {
    return {
      user: null,
      profile: null,
    }
  }

  const email = user.email ?? ''

  let profile = await prisma.profile.findUnique({
    where: { id: user.id },
  })

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        id: user.id,
        email,
      },
    })
  } else if (email && email !== profile.email) {
    profile = await prisma.profile.update({
      where: { id: user.id },
      data: { email },
    })
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  })

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile,
    subscription,
  }
})

