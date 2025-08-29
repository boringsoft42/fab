"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Trophy, Edit3, Save, X } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
  onAchievementsChange: (achievements: Achievement[]) => void;
  isEditing?: boolean;
}

export function AchievementsSection({ 
  achievements, 
  onAchievementsChange, 
  isEditing = false 
}: AchievementsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Achievement>({
    id: "",
    title: "",
    date: "",
    description: "",
  });

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: `achievement-${Date.now()}`,
      title: "",
      date: "",
      description: "",
    };
    onAchievementsChange([...achievements, newAchievement]);
    setEditingId(newAchievement.id);
    setEditForm(newAchievement);
  };

  const removeAchievement = (id: string) => {
    onAchievementsChange(achievements.filter(a => a.id !== id));
  };

  const startEditing = (achievement: Achievement) => {
    setEditingId(achievement.id);
    setEditForm(achievement);
  };

  const saveEdit = () => {
    const updatedAchievements = achievements.map(a => 
      a.id === editForm.id ? editForm : a
    );
    onAchievementsChange(updatedAchievements);
    setEditingId(null);
    setEditForm({ id: "", title: "", date: "", description: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ id: "", title: "", date: "", description: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Logros
        </h3>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={addAchievement}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Logro
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No hay logros registrados</p>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={addAchievement}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar primer logro
              </Button>
            )}
          </div>
        ) : (
          achievements.map((achievement) => (
            <Card key={achievement.id} className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                {editingId === achievement.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Título del logro"
                        className="font-semibold text-base"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        placeholder="Año (ej: 2023)"
                        className="w-24"
                      />
                    </div>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Descripción del logro"
                      className="min-h-[60px]"
                    />
                  </div>
                ) : (
                  // Display mode
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-base text-gray-900">
                            {achievement.title || "Título del logro"}
                          </h4>
                          {achievement.date && (
                            <Badge variant="secondary" className="text-xs">
                              {achievement.date}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {achievement.description || "Descripción del logro"}
                        </p>
                      </div>
                      {isEditing && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(achievement)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeAchievement(achievement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
