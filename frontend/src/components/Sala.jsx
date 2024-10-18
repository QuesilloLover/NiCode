import React, { useState } from "react";
import NiCode from "../assets/NiCode.png";
import JoinByCodeModal from "@/JoinByCodeModal";
import Header from './components_layouts/header'

import { Link } from "react-router-dom"
import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Lock, Globe, Plus } from "lucide-react"

export default function Component() {
  const [rooms, setRooms] = useState([
    { name: "Sala 1", creator: "User 01", users: "4/10", visibility: "Privada" },
    { name: "Sala 2", creator: "User 05", users: "10/10", visibility: "Pública" },
    { name: "Sala 3", creator: "User 10", users: "9/10", visibility: "Pública" },
    { name: "Sala 4", creator: "User 07", users: "3/10", visibility: "Privada" },
    { name: "Sala 5", creator: "User 04", users: "2/10", visibility: "Pública" },
    { name: "Sala 6", creator: "User 02", users: "4/10", visibility: "Privada" },
    { name: "Sala 7", creator: "User 06", users: "5/10", visibility: "Privada" },
  ])

  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinCode, setJoinCode] = useState("")

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    isPrivate: false,
    key: "",
  })

  const handleJoinByCode = () => {
    // Implement join logic here
    console.log("Joining room with code:", joinCode)
    setShowJoinModal(false)
    setJoinCode("")
  }

  const handleCreateRoom = () => {
    // Implement room creation logic here
    console.log("Creating new room:", newRoom)
    setShowCreateModal(false)
    setNewRoom({ name: "", description: "", isPrivate: false, key: "" })
  }

  return (
    <div>
      {/* Header */}
      <Header/>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Salas</h1>
          <div className="space-x-2">
            <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
              <DialogTrigger asChild>
                <Button variant="outline">Unirme por código</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Unirse a una sala</DialogTitle>
                  <DialogDescription>
                    Introduce el código de la sala a la que quieres unirte.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Código
                    </Label>
                    <Input
                      id="code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleJoinByCode}>Unirme</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Crear sala
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Crear nueva sala</DialogTitle>
                  <DialogDescription>
                    Completa los detalles para crear una nueva sala. La descripción admite formato Markdown.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 h-full overflow-y-auto">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room-name" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="room-name"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="room-description" className="text-right mt-2">
                      Descripción
                    </Label>
                    <div className="col-span-3">
                      <Tabs defaultValue="edit" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="edit">Editar</TabsTrigger>
                          <TabsTrigger value="preview">Vista previa</TabsTrigger>
                        </TabsList>
                        <TabsContent value="edit">
                          <Textarea
                            id="room-description"
                            value={newRoom.description}
                            onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                            className="min-h-[200px]"
                            placeholder="Escribe la descripción en Markdown..."
                          />
                        </TabsContent>
                        <TabsContent value="preview" className="bg-gray-700 p-4 rounded-md min-h-[200px]">
                          <ReactMarkdown>{newRoom.description}</ReactMarkdown>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="room-private">Sala privada</Label>
                    <Switch
                      id="room-private"
                      checked={newRoom.isPrivate}
                      onCheckedChange={(checked) => setNewRoom({ ...newRoom, isPrivate: checked })}
                    />
                  </div>
                  {newRoom.isPrivate && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="room-key" className="text-right">
                        Clave
                      </Label>
                      <Input
                        id="room-key"
                        type="text"
                        value={newRoom.key}
                        onChange={(e) => setNewRoom({ ...newRoom, key: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateRoom}>Crear sala</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre de la Sala</TableHead>
              <TableHead>Creador</TableHead>
              <TableHead>Usuarios</TableHead>
              <TableHead>Visibilidad</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>{room.creator}</TableCell>
                <TableCell>{room.users}</TableCell>
                <TableCell>
                  {room.visibility === "Privada" ? (
                    <Lock className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Globe className="h-4 w-4 text-green-500" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Check className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}