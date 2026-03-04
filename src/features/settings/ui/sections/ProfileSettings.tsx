'use client'

import { SettingsSection } from './SettingsSection'
import { useProfileStore } from '../../profile/profile.store'
import { useShallow } from 'zustand/shallow'

export function ProfileSettings() {
  const { name, email, setName, setEmail } = useProfileStore(
    useShallow((state) => ({
      name: state.name,
      email: state.email,
      setName: state.setName,
      setEmail: state.setEmail
    }))
  )

  return (
    <SettingsSection title="Profile">
      <div className="space-y-4 max-w-md">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            disabled
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground
            disabled:opacity-60 disabled:cursor-not-allowed"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground
            disabled:opacity-60 disabled:cursor-not-allowed"
            placeholder="you@example.com"
          />
        </div>
      </div>
    </SettingsSection>
  )
}
