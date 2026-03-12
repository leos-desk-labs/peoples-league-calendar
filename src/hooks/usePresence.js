import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function usePresence(userName) {
  const [presentUsers, setPresentUsers] = useState([])
  const channelRef = useRef(null)

  useEffect(() => {
    if (!userName) return

    const channel = supabase.channel('user-presence', {
      config: {
        presence: {
          key: userName,
        },
      },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.keys(state).map((key) => ({
          name: key,
          ...state[key][0],
        }))
        setPresentUsers(users)
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setPresentUsers((prev) => {
          if (prev.find((u) => u.name === key)) return prev
          return [...prev, { name: key }]
        })
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setPresentUsers((prev) => prev.filter((u) => u.name !== key))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user: userName,
            online_at: new Date().toISOString(),
          })
        }
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userName])

  return { presentUsers }
}
