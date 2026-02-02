import { getSettings } from "@/actions/settings"
import SettingsClient from "@/components/features/settings/SettingsClient"

export default async function SettingsPage() {
    const settings = await getSettings()
    return <SettingsClient initialSettings={settings} />
}
