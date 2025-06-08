"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

import { Send, BarChart2, MessageSquare, FileText, Bot, User, Loader2 } from "lucide-react"
import { Separator } from "@/components/shadcn/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { Input } from "@/components/shadcn/input"
import { ScrollArea } from "@/components/shadcn/scroll-area"
import { VoiceRecorder } from "@/components/app/audio_input"
import ReactMarkdown from 'react-markdown'

interface Message {
  sender: "user" | "ai"
  text: string
  timestamp: Date
}

export default function Chat() {
  // Estado para el informe
  const [report, setReport] = useState<string>("")
  const [reportMessage, setReportMessage] = useState<string>("")
  const [isReportLoading, setIsReportLoading] = useState<boolean>(false)

  // Estados para el chat
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState<string>("")
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false)

  // Referencia para hacer scroll automático al final del chat
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Hook para hacer scroll al final cada vez que los mensajes cambian
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])


  const onAudioRecorded = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice.webm");

    const response = await fetch("http://localhost:5000/transcribe/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Texto transcrito:", data.text);
  };
  
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage: Message = {
      sender: "user",
      text: chatInput,
      timestamp: new Date(),
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setChatInput("")

    setIsChatLoading(true)

    try {
      const chatCloudFunctionUrl = "http://127.0.0.1:5000/query/"

      const response = await fetch(chatCloudFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userMessage.text }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiResponse: Message = {
          sender: "ai",
          text: data.response.output,
          timestamp: new Date(),
        }
        setMessages((prevMessages) => [...prevMessages, aiResponse])
      } else {
        const errorData = await response.json()
        const errorMessage: Message = {
          sender: "ai",
          text: `Error: ${errorData.error || "Error desconocido al comunicarse con la IA."}`,
          timestamp: new Date(),
        }
        setMessages((prevMessages) => [...prevMessages, errorMessage])
      }
    } catch (error) {
      console.error("Error de red o del servidor al chatear:", error)
      const errorMessage: Message = {
        sender: "ai",
        text: "Error de conexión. Inténtalo de nuevo más tarde.",
        timestamp: new Date(),
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    setIsReportLoading(true)
    setReport("")
    setReportMessage("")
    try {
      const generateReportCloudFunctionUrl =
        "http://127.0.0.1:5000/inform/"
      const response = await fetch(generateReportCloudFunctionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      if (response.ok) {
        const data = await response.json()
        console.log("hoola", data)
        if (data.response.output) {
          setReport(data.response.output)
          setReportMessage("Informe generado con éxito.")
        } else {
          setReportMessage("No se pudo generar el informe.")
        }
      } else {
        const errorData = await response.json()
        setReportMessage(`Error al generar el informe: ${errorData.error || "Error desconocido"}`)
      }
    } catch (error) {
      console.error("Error de red o del servidor al generar informe:", error)
      setReportMessage("Error de conexión. Inténtalo de nuevo más tarde.")
    } finally {
      setIsReportLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Gestión de Instalaciones</h1>
          <p className="text-muted-foreground">Genera informes y consulta información con nuestro asistente de IA</p>
        </div>

        <Separator />

        {/* Tabs para organizar las funcionalidades */}
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Informes
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Asistente IA
            </TabsTrigger>
          </TabsList>

          {/* Tab de Informes */}
          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generador de Informes de Instalaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Genera un informe completo del estado de las instalaciones
                  </p>
                  <Button onClick={handleGenerateReport} disabled={isReportLoading} className="flex items-center gap-2">
                    {isReportLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart2 className="h-4 w-4" />}
                    {isReportLoading ? "Generando..." : "Generar Informe"}
                  </Button>
                </div>

                {reportMessage && (
                  <div className="flex items-center gap-2">
                    <Badge variant={reportMessage.includes("Error") ? "destructive" : "default"}>
                      {reportMessage.includes("Error") ? "Error" : "Éxito"}
                    </Badge>
                    <span className="text-sm">{reportMessage}</span>
                  </div>
                )}

                {report && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Informe Generado</h3>
                    <div className="rounded-md border">
                      <ScrollArea className="h-96 w-full p-4">
                        <ReactMarkdown>
                          {report}
                        </ReactMarkdown>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Chat */}
          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Asistente de IA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[500px]">
                  <ScrollArea className="flex-1 p-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                        <Bot className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">¡Hola! Soy tu asistente de IA</h3>
                          <p className="text-sm text-muted-foreground">
                            Pregúntame sobre las instalaciones o reseñas del gimnasio
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            {msg.sender === "ai" && (
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Bot className="h-4 w-4 text-primary" />
                                </div>
                              </div>
                            )}
                            <div className={`flex flex-col gap-1 max-w-[80%]`}>
                              <div
                                className={`p-3 rounded-lg ${msg.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                                  }`}
                              >
                                {msg.text}
                              </div>
                              <span
                                className={`text-xs text-muted-foreground ${msg.sender === "user" ? "text-right" : "text-left"
                                  }`}
                              >
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                            {msg.sender === "user" && (
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                  <User className="h-4 w-4 text-primary-foreground" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Input del chat */}
                  <div className="border-t p-4">
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Escribe tu pregunta aquí..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={isChatLoading}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={isChatLoading || !chatInput.trim()} size="icon">
                        {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                      <VoiceRecorder onAudioRecorded={onAudioRecorded} />
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
