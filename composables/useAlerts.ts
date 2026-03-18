import type { Alert } from '~lib/domain/types'
import type { AlertCreateInput, AlertUpdateInput } from '~lib/domain/alerts'

type AlertsIndexResponse = {
  alerts: Alert[]
  planLimits: {
    maxActiveAlerts: number
    allowTwoSeatAlerts: boolean
  }
}

export const useAlerts = () => {
  const {
    data,
    pending,
    error,
    refresh,
  } = useAsyncData<AlertsIndexResponse>('alerts', () =>
    $fetch('/api/alerts'),
  )

  const alerts = computed(() => data.value?.alerts ?? [])
  const planLimits = computed(() => data.value?.planLimits)

  const createAlert = async (payload: AlertCreateInput) => {
    const created = await $fetch<Alert>('/api/alerts', {
      method: 'POST',
      body: payload,
    })

    if (data.value) {
      data.value = {
        ...data.value,
        alerts: [created, ...data.value.alerts],
      }
    } else {
      data.value = {
        alerts: [created],
        planLimits: {
          maxActiveAlerts: 3,
          allowTwoSeatAlerts: false,
        },
      }
      await refresh()
    }

    return created
  }

  const updateAlert = async (id: string, payload: AlertUpdateInput) => {
    const updated = await $fetch<Alert>(`/api/alerts/${id}`, {
      method: 'PATCH',
      body: payload,
    })

    if (data.value) {
      data.value = {
        ...data.value,
        alerts: data.value.alerts.map((a) => (a.id === id ? updated : a)),
      }
    } else {
      await refresh()
    }

    return updated
  }

  const deleteAlert = async (id: string) => {
    await $fetch(`/api/alerts/${id}`, {
      method: 'DELETE',
    })

    if (data.value) {
      data.value = {
        ...data.value,
        alerts: data.value.alerts.filter((a) => a.id !== id),
      }
    } else {
      await refresh()
    }
  }

  return {
    alerts,
    planLimits,
    isLoading: pending,
    error,
    refresh,
    createAlert,
    updateAlert,
    deleteAlert,
  }
}

