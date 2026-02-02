'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { updateSettings } from '@/actions/settings' // import action
import { Settings as SettingsIcon, Save } from 'lucide-react'

// Pass initial settings from server page
export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
    const [loading, setLoading] = useState(false)
    const [settings, setSettings] = useState(initialSettings || {
        primaryColor: '#814AC8',
        accentColor: '#23475B',
        darkMode: true,
        gamification: true,
        soundEnabled: false
    })

    const handleChange = (field: string, value: any) => {
        setSettings({ ...settings, [field]: value })
        // Real-time preview?
        if (field === 'primaryColor') {
            document.documentElement.style.setProperty('--primary', hexToRgb(value))
        }
        if (field === 'accentColor') {
            document.documentElement.style.setProperty('--accent', hexToRgb(value))
        }
    }

    const hexToRgb = (hex: string) => {
        // Basic hex to rgb space separated
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return `${r} ${g} ${b}`
    }

    const handleSave = async () => {
        setLoading(true)
        await updateSettings(settings)
        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
                    <SettingsIcon /> Settings
                </h1>
                <p className="text-neutral-400 text-sm">Personaliza tu Orkesta OS</p>
            </header>

            <div className="space-y-8 bg-neutral-900/30 border border-neutral-800 p-6 rounded-xl">
                {/* Colors */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">Apariencia</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Color Principal (Primary)</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                                    className="bg-transparent h-10 w-10 cursor-pointer"
                                />
                                <span className="text-sm font-mono">{settings.primaryColor}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Color Acento (Accent)</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={settings.accentColor}
                                    onChange={(e) => handleChange('accentColor', e.target.value)}
                                    className="bg-transparent h-10 w-10 cursor-pointer"
                                />
                                <span className="text-sm font-mono">{settings.accentColor}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="darkMode"
                            checked={settings.darkMode}
                            onChange={(e) => handleChange('darkMode', e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-purple-600 focus:ring-purple-600 focus:ring-offset-neutral-900"
                        />
                        <label htmlFor="darkMode" className="text-sm">Modo Oscuro Predeterminado</label>
                    </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-neutral-800">
                    <h2 className="text-lg font-semibold">Gamificación & Feedback</h2>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="gamification"
                                checked={settings.gamification}
                                onChange={(e) => handleChange('gamification', e.target.checked)}
                                className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-purple-600"
                            />
                            <label htmlFor="gamification" className="text-sm">Activar Animaciones y Confetti</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="sound"
                                checked={settings.soundEnabled}
                                onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                                className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-purple-600"
                            />
                            <label htmlFor="sound" className="text-sm">Activar Sonidos de Completado</label>
                        </div>
                    </div>
                </section>

                <div className="pt-4">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Guardando...' : <span className="flex items-center gap-2"><Save size={16} /> Guardar Cambios</span>}
                    </Button>
                </div>
            </div>
        </div>
    )
}
