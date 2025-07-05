"use client";

import { useState, useEffect } from "react";
import { StudentNote } from "@/types/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Save, X, Clock, StickyNote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface LessonNotesProps {
  lessonId: string;
  currentTime?: number; // For video lessons
}

export const LessonNotes = ({ lessonId, currentTime }: LessonNotesProps) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editNoteContent, setEditNoteContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [lessonId]);

  const fetchNotes = async () => {
    try {
      // Mock data for now - in real app would fetch from API
      const mockNotes: StudentNote[] = [
        {
          id: "note-1",
          userId: "user-1",
          lessonId,
          content:
            "Punto importante sobre liderazgo: se debe mostrar ejemplo antes que dar órdenes.",
          timestamp: 120, // 2 minutes into video
          createdAt: new Date("2024-02-20T10:30:00"),
          updatedAt: new Date("2024-02-20T10:30:00"),
        },
        {
          id: "note-2",
          userId: "user-1",
          lessonId,
          content:
            "Recordar: la autoestima se construye con pequeños logros diarios.",
          createdAt: new Date("2024-02-20T10:45:00"),
          updatedAt: new Date("2024-02-20T10:45:00"),
        },
      ];

      setNotes(mockNotes.filter((note) => note.lessonId === lessonId));
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const saveNote = async () => {
    if (!newNoteContent.trim()) return;

    try {
      const newNote: StudentNote = {
        id: `note-${Date.now()}`,
        userId: "user-1", // Replace with actual user ID
        lessonId,
        content: newNoteContent.trim(),
        timestamp: currentTime ? Math.floor(currentTime) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setNotes((prev) => [newNote, ...prev]);
      setNewNoteContent("");
      setIsAddingNote(false);

      toast({
        title: "Nota guardada",
        description: "Tu nota ha sido guardada exitosamente",
      });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la nota",
        variant: "destructive",
      });
    }
  };

  const updateNote = async (noteId: string) => {
    if (!editNoteContent.trim()) return;

    try {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? {
                ...note,
                content: editNoteContent.trim(),
                updatedAt: new Date(),
              }
            : note
        )
      );

      setEditingNoteId(null);
      setEditNoteContent("");

      toast({
        title: "Nota actualizada",
        description: "Los cambios han sido guardados",
      });
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la nota",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      setNotes((prev) => prev.filter((note) => note.id !== noteId));

      toast({
        title: "Nota eliminada",
        description: "La nota ha sido eliminada",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la nota",
        variant: "destructive",
      });
    }
  };

  const startEdit = (note: StudentNote) => {
    setEditingNoteId(note.id);
    setEditNoteContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditNoteContent("");
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            Mis Notas
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNote(true)}
            disabled={isAddingNote}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva nota
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4">
        {/* Add Note Form */}
        {isAddingNote && (
          <Card className="mb-4 border-blue-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                {currentTime && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Tiempo: {formatTimestamp(currentTime)}</span>
                  </div>
                )}
                <Textarea
                  placeholder="Escribe tu nota aquí..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNoteContent("");
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveNote}
                    disabled={!newNoteContent.trim()}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Guardar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        <div className="flex-1">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-muted-foreground mb-2">
                Sin notas aún
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Toma notas para recordar puntos importantes de esta lección
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingNote(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear primera nota
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {notes.map((note) => (
                  <Card key={note.id} className="relative">
                    <CardContent className="p-4">
                      {editingNoteId === note.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editNoteContent}
                            onChange={(e) => setEditNoteContent(e.target.value)}
                            rows={3}
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateNote(note.id)}
                              disabled={!editNoteContent.trim()}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Guardar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {note.timestamp && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTimestamp(note.timestamp)}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(note.createdAt), {
                                  addSuffix: true,
                                  locale: es,
                                })}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(note)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNote(note.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {note.content}
                          </p>

                          {note.updatedAt.getTime() !==
                            note.createdAt.getTime() && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Editado{" "}
                              {formatDistanceToNow(new Date(note.updatedAt), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Quick Actions */}
        {notes.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              {notes.length} nota{notes.length !== 1 ? "s" : ""} en esta lección
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
