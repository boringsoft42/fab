"use client";

import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Printer, 
  Upload, 
  Palette, 
  Image as ImageIcon,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Trophy,
  GraduationCap,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Code
} from "lucide-react";
import { useCV } from "@/hooks/useCV";
import { CVData } from "@/hooks/useCV";

// Estilos para el PDF del CV
const cvStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #1e40af",
    paddingBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 15,
  },
  contactInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  contactItem: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 10,
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 5,
  },
  summary: {
    fontSize: 11,
    color: "#374151",
    marginBottom: 15,
    textAlign: "justify",
  },
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  company: {
    fontSize: 11,
    color: "#6b7280",
  },
  date: {
    fontSize: 10,
    color: "#9ca3af",
  },
  description: {
    fontSize: 10,
    color: "#374151",
    marginTop: 5,
  },
  educationItem: {
    marginBottom: 10,
  },
  institution: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  degree: {
    fontSize: 11,
    color: "#6b7280",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  skill: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    padding: "3px 8px",
    margin: "2px",
    borderRadius: 3,
    fontSize: 9,
  },
  achievementsItem: {
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f2937",
  },
  achievementDescription: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
  projectsItem: {
    marginBottom: 15,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  projectLocation: {
    fontSize: 10,
    color: "#6b7280",
  },
  languagesItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  languageName: {
    fontSize: 11,
    color: "#1f2937",
  },
  languageLevel: {
    fontSize: 10,
    color: "#6b7280",
  },
});

// Componente PDF del CV
const CVPDF = ({ cvData }: { cvData: CVData }) => (
  <Document>
    <Page size="A4" style={cvStyles.page}>
      {/* Header */}
      <View style={cvStyles.header}>
        <Text style={cvStyles.name}>
          {cvData.personalInfo?.firstName} {cvData.personalInfo?.lastName}
          </Text>
        <Text style={cvStyles.title}>
            {cvData.targetPosition || "Desarrollador Frontend"}
          </Text>
        <View style={cvStyles.contactInfo}>
          <Text style={cvStyles.contactItem}>{cvData.personalInfo?.email}</Text>
          <Text style={cvStyles.contactItem}>{cvData.personalInfo?.phone}</Text>
          <Text style={cvStyles.contactItem}>
            {cvData.personalInfo?.municipality}, {cvData.personalInfo?.department}
          </Text>
          <Text style={cvStyles.contactItem}>{cvData.personalInfo?.country}</Text>
        </View>
      </View>

      {/* Professional Summary */}
      <View style={cvStyles.section}>
        <Text style={cvStyles.sectionTitle}>Resumen Profesional</Text>
        <Text style={cvStyles.summary}>
          {cvData.professionalSummary || "Joven profesional con sólidos conocimientos en desarrollo web y tecnologías modernas. Comprometido con el aprendizaje continuo y el desarrollo de soluciones innovadoras."}
        </Text>
      </View>

      {/* Work Experience */}
      <View style={cvStyles.section}>
        <Text style={cvStyles.sectionTitle}>Experiencia Laboral</Text>
        {cvData.workExperience?.map((exp, index) => (
          <View key={index} style={cvStyles.experienceItem}>
            <View style={cvStyles.experienceHeader}>
              <Text style={cvStyles.jobTitle}>{exp.jobTitle}</Text>
              <Text style={cvStyles.date}>
                {exp.startDate && exp.endDate ? 
                  `${new Date(exp.startDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} - ${new Date(exp.endDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}` : 
                  exp.startDate ? 
                  `${new Date(exp.startDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} - Presente` : 
                  'Fecha no especificada'
                }
          </Text>
            </View>
            <Text style={cvStyles.company}>{exp.company}</Text>
            <Text style={cvStyles.description}>{exp.description}</Text>
          </View>
        ))}
        {(!cvData.workExperience || cvData.workExperience.length === 0) && (
          <Text style={cvStyles.description}>Sin experiencia laboral registrada</Text>
        )}
      </View>

      {/* Education */}
      <View style={cvStyles.section}>
        <Text style={cvStyles.sectionTitle}>Educación</Text>
        <View style={cvStyles.educationItem}>
          <Text style={cvStyles.institution}>{cvData.education?.institution}</Text>
          <Text style={cvStyles.degree}>{cvData.education?.level}</Text>
          <Text style={cvStyles.date}>{cvData.education?.graduationYear}</Text>
        </View>
      </View>

      {/* Skills */}
      <View style={cvStyles.section}>
        <Text style={cvStyles.sectionTitle}>Habilidades</Text>
        <View style={cvStyles.skillsContainer}>
          {cvData.skills?.map((skill, index) => (
            <Text key={index} style={cvStyles.skill}>
              {skill.name}
              {skill.experienceLevel && ` (${skill.experienceLevel})`}
            </Text>
          ))}
        </View>
      </View>

      {/* Languages */}
      <View style={cvStyles.section}>
        <Text style={cvStyles.sectionTitle}>Idiomas</Text>
        {cvData.languages?.map((language, index) => (
          <View key={index} style={cvStyles.languagesItem}>
            <Text style={cvStyles.languageName}>{language.name}</Text>
            <Text style={cvStyles.languageLevel}>{language.proficiency}</Text>
            </View>
          ))}
        </View>

      {/* Projects */}
      <View style={cvStyles.section}>
        <Text style={cvStyles.sectionTitle}>Proyectos</Text>
        {cvData.projects?.map((project, index) => (
          <View key={index} style={cvStyles.projectsItem}>
            <Text style={cvStyles.projectTitle}>{project.title}</Text>
            {project.location && (
              <Text style={cvStyles.projectLocation}>{project.location}</Text>
            )}
            <Text style={cvStyles.date}>
              {project.startDate && project.endDate ? 
                `${new Date(project.startDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} - ${new Date(project.endDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}` : 
                project.startDate ? 
                `${new Date(project.startDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} - Presente` : 
                'Fecha no especificada'
              }
            </Text>
            <Text style={cvStyles.description}>{project.description}</Text>
            </View>
          ))}
        {(!cvData.projects || cvData.projects.length === 0) && (
          <Text style={cvStyles.description}>Sin proyectos registrados</Text>
        )}
        </View>

      {/* Achievements */}
      <View style={cvStyles.section}>
        <Text style={cvStyles.sectionTitle}>Logros</Text>
        {cvData.achievements?.map((achievement, index) => (
          <View key={index} style={cvStyles.achievementsItem}>
            <Text style={cvStyles.achievementTitle}>{achievement.title}</Text>
            <Text style={cvStyles.achievementDescription}>{achievement.description}</Text>
            <Text style={cvStyles.date}>{achievement.date}</Text>
          </View>
            ))}
          </View>
    </Page>
  </Document>
);

// Template 1: Modern Professional
function ModernProfessionalTemplate({ cvData, isEditing = false }: { cvData: CVData; isEditing?: boolean }) {
  return (
    <div className="bg-white shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <div className="flex items-center gap-6">
          {cvData.personalInfo?.profileImage && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
              <img 
                src={cvData.personalInfo.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {cvData.personalInfo?.firstName} {cvData.personalInfo?.lastName}
            </h1>
            <p className="text-xl text-blue-100 mb-4">
              {cvData.targetPosition || "Desarrollador Frontend"}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {cvData.personalInfo?.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {cvData.personalInfo?.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {cvData.personalInfo?.municipality}, {cvData.personalInfo?.department}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {cvData.personalInfo?.country}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-1 space-y-6">
            {/* Education */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Educación
              </h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-medium">{cvData.education?.institution}</h4>
                  <p className="text-sm text-gray-600">{cvData.education?.level}</p>
                  <p className="text-xs text-gray-500">{cvData.education?.graduationYear}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                    {skill.name}
                    {skill.experienceLevel && (
                      <span className="text-xs ml-1">({skill.experienceLevel})</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Idiomas</h3>
              <div className="space-y-2">
                {cvData.languages?.map((language, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{language.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {language.proficiency}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Enlaces</h3>
              <div className="space-y-2">
                {cvData.socialLinks?.map((link, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{link.platform}:</span>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      {link.url}
                    </a>
                  </div>
                ))}
              </div>
      </div>

            {/* Interests */}
        <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Intereses</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.interests?.map((interest, index) => (
                  <Badge key={index} variant="outline">
                    {interest}
                  </Badge>
                ))}
        </div>
        </div>
      </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-6">
            {/* Professional Summary */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Resumen Profesional</h3>
              <p className="text-gray-700 leading-relaxed">
                {cvData.professionalSummary || "Joven profesional con sólidos conocimientos en desarrollo web y tecnologías modernas. Comprometido con el aprendizaje continuo y el desarrollo de soluciones innovadoras."}
              </p>
            </div>

            {/* Work Experience */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experiencia Laboral
              </h3>
              <div className="space-y-4">
                {cvData.workExperience?.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <h4 className="font-medium">{exp.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      {exp.startDate && exp.endDate ? 
                        `${new Date(exp.startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - ${new Date(exp.endDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}` : 
                        exp.startDate ? 
                        `${new Date(exp.startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - Presente` : 
                        'Fecha no especificada'
                      }
                    </p>
                    <p className="text-sm text-gray-700">{exp.description}</p>
                  </div>
                ))}
                {(!cvData.workExperience || cvData.workExperience.length === 0) && (
                  <p className="text-gray-500 italic">Sin experiencia laboral registrada</p>
              )}
            </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Logros
              </h3>
              <div className="space-y-3">
                {cvData.achievements?.map((achievement, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {achievement.date}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Code className="h-5 w-5" />
                Proyectos
              </h3>
              <div className="space-y-4">
                {cvData.projects?.map((project, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <h4 className="font-medium">{project.title}</h4>
                    {project.location && (
                      <p className="text-sm text-gray-600">{project.location}</p>
                    )}
                    <p className="text-xs text-gray-500 mb-2">
                      {project.startDate && project.endDate ? 
                        `${new Date(project.startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - ${new Date(project.endDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}` : 
                        project.startDate ? 
                        `${new Date(project.startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - Presente` : 
                        'Fecha no especificada'
                      }
                    </p>
                    <p className="text-sm text-gray-700">{project.description}</p>
                  </div>
                ))}
                {(!cvData.projects || cvData.projects.length === 0) && (
                  <p className="text-gray-500 italic">Sin proyectos registrados</p>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Template 2: Creative Portfolio
function CreativePortfolioTemplate({ cvData, isEditing = false }: { cvData: CVData; isEditing?: boolean }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            {cvData.personalInfo?.profileImage && (
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
                <img 
                  src={cvData.personalInfo.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {cvData.personalInfo?.firstName} {cvData.personalInfo?.lastName}
            </h1>
            <p className="text-xl text-purple-600 mb-4">
              {cvData.targetPosition || "Desarrollador Frontend"}
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {cvData.personalInfo?.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {cvData.personalInfo?.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {cvData.personalInfo?.municipality}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* About */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sobre Mí
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Joven profesional apasionado por la tecnología y el desarrollo web. 
                  Busco oportunidades para crecer y contribuir con mis habilidades en proyectos innovadores.
                </p>
        </CardContent>
      </Card>

            {/* Education */}
            <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Educación
                </CardTitle>
        </CardHeader>
        <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-300 pl-4">
                    <h4 className="font-semibold text-gray-800">{cvData.education?.institution}</h4>
                    <p className="text-purple-600">{cvData.education?.level}</p>
                    <p className="text-sm text-gray-500">{cvData.education?.graduationYear}</p>
            </div>
          </div>
        </CardContent>
      </Card>

            {/* Skills */}
            <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
                <CardTitle className="text-purple-800">Habilidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
                  {cvData.skills?.map((skill, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {skill.name}
                      {skill.experienceLevel && (
                        <span className="text-xs ml-1">({skill.experienceLevel})</span>
                      )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Professional Summary */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-800">Resumen Profesional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {cvData.professionalSummary || "Joven profesional con sólidos conocimientos en desarrollo web y tecnologías modernas. Comprometido con el aprendizaje continuo y el desarrollo de soluciones innovadoras."}
                </p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experiencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cvData.workExperience?.map((exp, index) => (
                    <div key={index} className="border-l-4 border-purple-300 pl-4">
                      <h4 className="font-semibold text-gray-800">{exp.jobTitle}</h4>
                      <p className="text-purple-600">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {exp.startDate && exp.endDate ? 
                          `${new Date(exp.startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - ${new Date(exp.endDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}` : 
                          exp.startDate ? 
                          `${new Date(exp.startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - Presente` : 
                          'Fecha no especificada'
                        }
                      </p>
                      <p className="text-sm text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                  {(!cvData.workExperience || cvData.workExperience.length === 0) && (
                    <p className="text-gray-500 italic">Sin experiencia laboral registrada</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Logros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cvData.achievements?.map((achievement, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        </div>
                        <Badge className="bg-purple-200 text-purple-800">
                          {achievement.date}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Template 3: Minimalist
function MinimalistTemplate({ cvData, isEditing = false }: { cvData: CVData; isEditing?: boolean }) {
  return (
    <div className="bg-white max-w-3xl mx-auto p-8">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-8 mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          {cvData.personalInfo?.firstName} {cvData.personalInfo?.lastName}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {cvData.targetPosition || "Desarrollador Frontend"}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>{cvData.personalInfo?.email}</div>
          <div>{cvData.personalInfo?.phone}</div>
          <div>{cvData.personalInfo?.municipality}, {cvData.personalInfo?.department}</div>
          <div>{cvData.personalInfo?.country}</div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Summary */}
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Resumen</h2>
          <p className="text-gray-700 leading-relaxed">
            {cvData.professionalSummary || "Joven profesional con experiencia en desarrollo web y tecnologías modernas. Enfocado en crear soluciones eficientes y experiencias de usuario excepcionales."}
          </p>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Experiencia</h2>
          <div className="space-y-6">
            {cvData.workExperience?.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-500">
                    {exp.startDate && exp.endDate ? 
                      `${new Date(exp.startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - ${new Date(exp.endDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}` : 
                      exp.startDate ? 
                      `${new Date(exp.startDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - Presente` : 
                      'Fecha no especificada'
                    }
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{exp.company}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
            {(!cvData.workExperience || cvData.workExperience.length === 0) && (
              <p className="text-gray-500 italic">Sin experiencia laboral registrada</p>
            )}
          </div>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Educación</h2>
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-gray-900">{cvData.education?.institution}</h3>
              <span className="text-sm text-gray-500">{cvData.education?.graduationYear}</span>
            </div>
            <p className="text-gray-600">{cvData.education?.level}</p>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {cvData.skills?.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {skill.name}
                {skill.experienceLevel && (
                  <span className="text-xs ml-1">({skill.experienceLevel})</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Logros</h2>
          <div className="space-y-4">
            {cvData.achievements?.map((achievement, index) => (
              <div key={index} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                  <span className="text-sm text-gray-500">{achievement.date}</span>
                </div>
                <p className="text-gray-700">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main CV Template Selector
export function CVTemplateSelector() {
  const { cvData, loading, error } = useCV();
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isEditing, setIsEditing] = useState(false);

  const handleDownloadPDF = async () => {
    if (!cvData) return;
    
    try {
      const blob = await pdf(<CVPDF cvData={cvData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CV_${cvData.personalInfo?.firstName}_${cvData.personalInfo?.lastName}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando CV...</p>
        </div>
      </div>
    );
  }

  if (error || !cvData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar el CV</p>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "modern":
        return <ModernProfessionalTemplate cvData={cvData} isEditing={isEditing} />;
      case "creative":
        return <CreativePortfolioTemplate cvData={cvData} isEditing={isEditing} />;
      case "minimalist":
        return <MinimalistTemplate cvData={cvData} isEditing={isEditing} />;
      default:
        return <ModernProfessionalTemplate cvData={cvData} isEditing={isEditing} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Seleccionar Plantilla
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="modern">Profesional Moderno</TabsTrigger>
              <TabsTrigger value="creative">Portfolio Creativo</TabsTrigger>
              <TabsTrigger value="minimalist">Minimalista</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* CV Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vista Previa del CV</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? "Vista Previa" : "Editar"}
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            {renderTemplate()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
