import React, { useState, useEffect } from "react";
import axios from "axios";
import JoinByCodeModal from "@/JoinByCodeModal";
import Header from "./components_layouts/header";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

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
import { Check, Lock, Globe, Plus, Import } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Component() {

  const getDifficultyLabel = (difficulty) => {
      switch (difficulty) {
        case 1:
          return { text: <strong>Fácil</strong>, color: "green" };
        case 2:
          return { text: <strong>Medio</strong>, color: "yellow" };
        case 3:
          return { text: <strong>Dificil</strong>, color: "red" };
        default:
          return { text: <strong>Desconocido</strong>, color: "gray" };
      }
    };

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

  const navigate = useNavigate();

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

  const handlePlayClick = (id) => {
    navigate(`/problem/${id}`);
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Navbar */}
      <div className="text-white py-4">
        <div className="container mx-auto flex justify-center items-center mt-5">
          <h1 className="text-2xl font-bold ">Problemas</h1>
          <div className="flex justify-center items-center space-x-2">
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
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

      <div className="container mx-auto px-4 py-6 bg-[#111828]">
      <div className="overflow-x-auto w-full">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-white sm:rounded-lg">
            <Table className="min-w-full divide-y divide-gray-700">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white ">Estado</TableHead>
                  <TableHead className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white hidden md:table-cell">Titulo</TableHead>
                  <TableHead className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white hidden md:table-cell">Descripcion</TableHead>
                  <TableHead className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white hidden md:table-cell">Dificultad</TableHead>
                  <TableHead className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white hidden md:table-cell">Visibilidad</TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-white">
                {rooms.map((room, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{room.is_completed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#11ff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-check"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="m9 9.5 2 2 4-4"/></svg>
                      ) : (
                          <p></p>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{room.description}</TableCell>
                    <TableCell className="hidden md:table-cell">
                          {room.difficulty && (() => {
                          const { text, color } = getDifficultyLabel(room.difficulty);
                          return <span style={{ color }}>{text}</span>;
                      })()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{room.visibility}</TableCell>
                    <TableCell className="text-right">
                    <Button variant="green_button" size="sm" onClick={() => handlePlayClick(room.id)}>Jugar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      </div>         






















      
    </div>
  );
}