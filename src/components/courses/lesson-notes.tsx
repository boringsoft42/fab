&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { StudentNote } from &ldquo;@/types/courses&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { ScrollArea } from &ldquo;@/components/ui/scroll-area&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Plus, Edit2, Trash2, Save, X, Clock, StickyNote } from &ldquo;lucide-react&rdquo;;
import { formatDistanceToNow } from &ldquo;date-fns&rdquo;;
import { es } from &ldquo;date-fns/locale&rdquo;;
import { useToast } from &ldquo;@/hooks/use-toast&rdquo;;

interface LessonNotesProps {
  lessonId: string;
  currentTime?: number; // For video lessons
}

export const LessonNotes = ({ lessonId, currentTime }: LessonNotesProps) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState(&ldquo;&rdquo;);
  const [editNoteContent, setEditNoteContent] = useState(&ldquo;&rdquo;);

  useEffect(() => {
    fetchNotes();
  }, [lessonId]);

  const fetchNotes = async () => {
    try {
      // Mock data for now - in real app would fetch from API
      const mockNotes: StudentNote[] = [
        {
          id: &ldquo;note-1&rdquo;,
          userId: &ldquo;user-1&rdquo;,
          lessonId,
          content:
            &ldquo;Punto importante sobre liderazgo: se debe mostrar ejemplo antes que dar órdenes.&rdquo;,
          timestamp: 120, // 2 minutes into video
          createdAt: new Date(&ldquo;2024-02-20T10:30:00&rdquo;),
          updatedAt: new Date(&ldquo;2024-02-20T10:30:00&rdquo;),
        },
        {
          id: &ldquo;note-2&rdquo;,
          userId: &ldquo;user-1&rdquo;,
          lessonId,
          content:
            &ldquo;Recordar: la autoestima se construye con pequeños logros diarios.&rdquo;,
          createdAt: new Date(&ldquo;2024-02-20T10:45:00&rdquo;),
          updatedAt: new Date(&ldquo;2024-02-20T10:45:00&rdquo;),
        },
      ];

      setNotes(mockNotes.filter((note) => note.lessonId === lessonId));
    } catch (error) {
      console.error(&ldquo;Error fetching notes:&rdquo;, error);
    }
  };

  const saveNote = async () => {
    if (!newNoteContent.trim()) return;

    try {
      const newNote: StudentNote = {
        id: `note-${Date.now()}`,
        userId: &ldquo;user-1&rdquo;, // Replace with actual user ID
        lessonId,
        content: newNoteContent.trim(),
        timestamp: currentTime ? Math.floor(currentTime) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setNotes((prev) => [newNote, ...prev]);
      setNewNoteContent(&ldquo;&rdquo;);
      setIsAddingNote(false);

      toast({
        title: &ldquo;Nota guardada&rdquo;,
        description: &ldquo;Tu nota ha sido guardada exitosamente&rdquo;,
      });
    } catch (error) {
      console.error(&ldquo;Error saving note:&rdquo;, error);
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudo guardar la nota&rdquo;,
        variant: &ldquo;destructive&rdquo;,
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
      setEditNoteContent(&ldquo;&rdquo;);

      toast({
        title: &ldquo;Nota actualizada&rdquo;,
        description: &ldquo;Los cambios han sido guardados&rdquo;,
      });
    } catch (error) {
      console.error(&ldquo;Error updating note:&rdquo;, error);
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudo actualizar la nota&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      setNotes((prev) => prev.filter((note) => note.id !== noteId));

      toast({
        title: &ldquo;Nota eliminada&rdquo;,
        description: &ldquo;La nota ha sido eliminada&rdquo;,
      });
    } catch (error) {
      console.error(&ldquo;Error deleting note:&rdquo;, error);
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;No se pudo eliminar la nota&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    }
  };

  const startEdit = (note: StudentNote) => {
    setEditingNoteId(note.id);
    setEditNoteContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditNoteContent(&ldquo;&rdquo;);
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, &ldquo;0&rdquo;)}`;
  };

  return (
    <Card className=&ldquo;h-full flex flex-col&rdquo;>
      <CardHeader className=&ldquo;pb-3&rdquo;>
        <div className=&ldquo;flex items-center justify-between&rdquo;>
          <CardTitle className=&ldquo;text-lg flex items-center gap-2&rdquo;>
            <StickyNote className=&ldquo;h-5 w-5&rdquo; />
            Mis Notas
          </CardTitle>
          <Button
            variant=&ldquo;outline&rdquo;
            size=&ldquo;sm&rdquo;
            onClick={() => setIsAddingNote(true)}
            disabled={isAddingNote}
          >
            <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Nueva nota
          </Button>
        </div>
      </CardHeader>

      <CardContent className=&ldquo;flex-1 flex flex-col p-4&rdquo;>
        {/* Add Note Form */}
        {isAddingNote && (
          <Card className=&ldquo;mb-4 border-blue-200&rdquo;>
            <CardContent className=&ldquo;p-4&rdquo;>
              <div className=&ldquo;space-y-3&rdquo;>
                {currentTime && (
                  <div className=&ldquo;flex items-center gap-2 text-sm text-muted-foreground&rdquo;>
                    <Clock className=&ldquo;h-4 w-4&rdquo; />
                    <span>Tiempo: {formatTimestamp(currentTime)}</span>
                  </div>
                )}
                <Textarea
                  placeholder=&ldquo;Escribe tu nota aquí...&rdquo;
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div className=&ldquo;flex justify-end gap-2&rdquo;>
                  <Button
                    variant=&ldquo;outline&rdquo;
                    size=&ldquo;sm&rdquo;
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNoteContent(&ldquo;&rdquo;);
                    }}
                  >
                    <X className=&ldquo;h-4 w-4 mr-1&rdquo; />
                    Cancelar
                  </Button>
                  <Button
                    size=&ldquo;sm&rdquo;
                    onClick={saveNote}
                    disabled={!newNoteContent.trim()}
                  >
                    <Save className=&ldquo;h-4 w-4 mr-1&rdquo; />
                    Guardar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        <div className=&ldquo;flex-1&rdquo;>
          {notes.length === 0 ? (
            <div className=&ldquo;text-center py-8&rdquo;>
              <StickyNote className=&ldquo;h-12 w-12 text-muted-foreground mx-auto mb-3&rdquo; />
              <h3 className=&ldquo;font-medium text-muted-foreground mb-2&rdquo;>
                Sin notas aún
              </h3>
              <p className=&ldquo;text-sm text-muted-foreground mb-4&rdquo;>
                Toma notas para recordar puntos importantes de esta lección
              </p>
              <Button
                variant=&ldquo;outline&rdquo;
                size=&ldquo;sm&rdquo;
                onClick={() => setIsAddingNote(true)}
              >
                <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Crear primera nota
              </Button>
            </div>
          ) : (
            <ScrollArea className=&ldquo;h-full&rdquo;>
              <div className=&ldquo;space-y-3&rdquo;>
                {notes.map((note) => (
                  <Card key={note.id} className=&ldquo;relative&rdquo;>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      {editingNoteId === note.id ? (
                        <div className=&ldquo;space-y-3&rdquo;>
                          <Textarea
                            value={editNoteContent}
                            onChange={(e) => setEditNoteContent(e.target.value)}
                            rows={3}
                            autoFocus
                          />
                          <div className=&ldquo;flex justify-end gap-2&rdquo;>
                            <Button
                              variant=&ldquo;outline&rdquo;
                              size=&ldquo;sm&rdquo;
                              onClick={cancelEdit}
                            >
                              <X className=&ldquo;h-4 w-4 mr-1&rdquo; />
                              Cancelar
                            </Button>
                            <Button
                              size=&ldquo;sm&rdquo;
                              onClick={() => updateNote(note.id)}
                              disabled={!editNoteContent.trim()}
                            >
                              <Save className=&ldquo;h-4 w-4 mr-1&rdquo; />
                              Guardar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className=&ldquo;flex items-start justify-between mb-2&rdquo;>
                            <div className=&ldquo;flex items-center gap-2&rdquo;>
                              {note.timestamp && (
                                <Badge variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                                  <Clock className=&ldquo;h-3 w-3 mr-1&rdquo; />
                                  {formatTimestamp(note.timestamp)}
                                </Badge>
                              )}
                              <span className=&ldquo;text-xs text-muted-foreground&rdquo;>
                                {formatDistanceToNow(new Date(note.createdAt), {
                                  addSuffix: true,
                                  locale: es,
                                })}
                              </span>
                            </div>
                            <div className=&ldquo;flex gap-1&rdquo;>
                              <Button
                                variant=&ldquo;ghost&rdquo;
                                size=&ldquo;sm&rdquo;
                                onClick={() => startEdit(note)}
                                className=&ldquo;h-6 w-6 p-0&rdquo;
                              >
                                <Edit2 className=&ldquo;h-3 w-3&rdquo; />
                              </Button>
                              <Button
                                variant=&ldquo;ghost&rdquo;
                                size=&ldquo;sm&rdquo;
                                onClick={() => deleteNote(note.id)}
                                className=&ldquo;h-6 w-6 p-0 text-red-600 hover:text-red-700&rdquo;
                              >
                                <Trash2 className=&ldquo;h-3 w-3&rdquo; />
                              </Button>
                            </div>
                          </div>

                          <p className=&ldquo;text-sm leading-relaxed whitespace-pre-wrap&rdquo;>
                            {note.content}
                          </p>

                          {note.updatedAt.getTime() !==
                            note.createdAt.getTime() && (
                            <p className=&ldquo;text-xs text-muted-foreground mt-2&rdquo;>
                              Editado{&ldquo; &rdquo;}
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
          <div className=&ldquo;mt-4 pt-4 border-t&rdquo;>
            <div className=&ldquo;text-xs text-muted-foreground text-center&rdquo;>
              {notes.length} nota{notes.length !== 1 ? &ldquo;s&rdquo; : &ldquo;&rdquo;} en esta lección
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
