'use client'

import { useState, useEffect } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
// Using native API for simplicity and no-dep reliability in MVP
// Types usually require 'dom-speech-recognition' or similar, but we can cast window.

export function AudioCapture({ onTranscript }: { onTranscript: (text: string) => void }) {
    const [isListening, setIsListening] = useState(false)
    const [recognition, setRecognition] = useState<any>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recog = new SpeechRecognition()
                recog.continuous = true // Keep listening? No, usually short bursts for tasks.
                recog.lang = 'es-ES'
                recog.interimResults = true

                recog.onresult = (event: any) => {
                    let interimTranscript = ''
                    let finalTranscript = ''

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript
                        } else {
                            interimTranscript += event.results[i][0].transcript
                        }
                    }

                    if (finalTranscript) {
                        onTranscript(finalTranscript)
                        // Optional: Stop after one sentence? Or let user stop.
                    }
                }

                recog.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error)
                    setIsListening(false)
                }

                setRecognition(recog)
            }
        }
    }, [onTranscript])

    const toggleListen = () => {
        if (!recognition) return alert('Tu navegador no soporta reconocimiento de voz.')

        if (isListening) {
            recognition.stop()
            setIsListening(false)
        } else {
            recognition.start()
            setIsListening(true)
        }
    }

    return (
        <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={toggleListen}
            className={isListening ? "bg-red-900/50 text-red-200 animate-pulse" : ""}
        >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
    )
}
