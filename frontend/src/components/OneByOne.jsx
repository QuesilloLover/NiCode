import React, { useState, useEffect } from "react";
import axios from "axios";
import JoinByCodeModal from "@/JoinByCodeModal";
import Header from "./components_layouts/header";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Lock, Globe, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Component() {
  const [rooms, setRooms] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    isPrivate: false,
    key: "",
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error("No auth token found in localStorage");
      return;
    }

    const config = {
      headers: { Authorization: `Token ${token}` }
    };

    // Fetch data from API
    axios.get("http://localhost:8000/problems/completion/", config)
      .then(response => {
        console.log("Data fetched successfully!", response.data);
        setRooms(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const handleJoinByCode = () => {
    console.log("Joining room with code:", joinCode);
    setShowJoinModal(false);
    setJoinCode("");
  };

  const handleCreateRoom = () => {
    const token = localStorage.getItem('accessToken');
    const payload = {
      name: newRoom.name,
      description: newRoom.description,
      isPrivate: newRoom.isPrivate,
      key: newRoom.key,
    };

    fetch("http://localhost:8000/problems/completion/", {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Room created successfully!", data);
      setRooms([...rooms, data]);
      setShowCreateModal(false);
      setNewRoom({ name: "", description: "", isPrivate: false, key: "" });
    })
    .catch(error => {
      console.error("There was an error creating the room!", error);
    });
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Navbar */}
      <div className="text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Salas Disponibles</h1>
          <div className="flex justify-center items-center space-x-2">
            <Dialog open={showJoinModal} onOpenChange={setShowJoinModal} >
              <DialogTrigger  asChild>
                <Button variant="green_button" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                  Unirme por código
                </Button>
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
              <DialogTrigger asChild className="bg-green-500">
                <Button variant="green_button" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
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
                        <TabsContent value="preview" className="bg-gray-700 p-4 rounded-md min-h-[200px] text-white">
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
                        type="password"
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
      </div>

      {/* Tabla de salas */}
      <div className="container mx-auto px-4 py-6">
        <div className="overflow-x-auto w-full text-white">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Nombre de la Sala</TableHead>
                <TableHead className="hidden md:table-cell">Creador</TableHead>
                <TableHead className="hidden md:table-cell">Usuarios</TableHead>
                <TableHead className="hidden md:table-cell">Visibilidad</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{room.creator}</TableCell>
                  <TableCell className="hidden md:table-cell">{room.users}</TableCell>
                  <TableCell className="hidden md:table-cell">{room.visibility}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="green_button" size="sm">Unirse</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}