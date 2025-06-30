"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  FileText,
  TrendingUp,
  DollarSign,
  PieChart,
  Target,
  Users,
  Lightbulb,
  Shield,
  Cog,
  Save,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

interface BusinessPlan {
  executiveSummary: string;
  businessDescription: string;
  marketAnalysis: string;
  competitiveAnalysis: string;
  marketingPlan: string;
  operationalPlan: string;
  managementTeam: string;
  financialProjections: {
    startupCosts: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    breakEvenMonth: number;
  };
  riskAnalysis: string;
  appendices: string;
}

interface FinancialData {
  initialInvestment: number;
  monthlyRevenue: number;
  fixedCosts: number;
  variableCosts: number;
  projectionMonths: number;
}

export default function BusinessPlanSimulatorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessPlan, setBusinessPlan] = useState<BusinessPlan>({
    executiveSummary: "",
    businessDescription: "",
    marketAnalysis: "",
    competitiveAnalysis: "",
    marketingPlan: "",
    operationalPlan: "",
    managementTeam: "",
    financialProjections: {
      startupCosts: 0,
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      breakEvenMonth: 0,
    },
    riskAnalysis: "",
    appendices: "",
  });

  const [financialData, setFinancialData] = useState<FinancialData>({
    initialInvestment: 10000,
    monthlyRevenue: 5000,
    fixedCosts: 2000,
    variableCosts: 1000,
    projectionMonths: 12,
  });

  const [activeTab, setActiveTab] = useState("wizard");

  const planSteps = [
    {
      title: "Resumen Ejecutivo",
      description: "Una visión general de tu negocio",
      icon: <FileText className="h-5 w-5" />,
      field: "executiveSummary",
    },
    {
      title: "Descripción del Negocio",
      description: "¿Qué hace tu empresa?",
      icon: <Lightbulb className="h-5 w-5" />,
      field: "businessDescription",
    },
    {
      title: "Análisis de Mercado",
      description: "Tu mercado objetivo y oportunidades",
      icon: <TrendingUp className="h-5 w-5" />,
      field: "marketAnalysis",
    },
    {
      title: "Análisis Competitivo",
      description: "Quiénes son tus competidores",
      icon: <Target className="h-5 w-5" />,
      field: "competitiveAnalysis",
    },
    {
      title: "Plan de Marketing",
      description: "Cómo vas a atraer clientes",
      icon: <Users className="h-5 w-5" />,
      field: "marketingPlan",
    },
    {
      title: "Plan Operacional",
      description: "Cómo funcionará tu negocio",
      icon: <Cog className="h-5 w-5" />,
      field: "operationalPlan",
    },
    {
      title: "Equipo de Gestión",
      description: "Quiénes están detrás del negocio",
      icon: <Users className="h-5 w-5" />,
      field: "managementTeam",
    },
    {
      title: "Proyecciones Financieras",
      description: "Números y proyecciones",
      icon: <DollarSign className="h-5 w-5" />,
      field: "financialProjections",
    },
    {
      title: "Análisis de Riesgos",
      description: "Identificar y mitigar riesgos",
      icon: <Shield className="h-5 w-5" />,
      field: "riskAnalysis",
    },
  ];

  const updateBusinessPlan = (field: string, value: any) => {
    setBusinessPlan((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateBreakEven = () => {
    const netMonthlyProfit =
      financialData.monthlyRevenue -
      (financialData.fixedCosts + financialData.variableCosts);
    if (netMonthlyProfit <= 0) return "No alcanza punto de equilibrio";
    return Math.ceil(financialData.initialInvestment / netMonthlyProfit);
  };

  const calculateROI = () => {
    const annualProfit =
      (financialData.monthlyRevenue -
        (financialData.fixedCosts + financialData.variableCosts)) *
      12;
    return ((annualProfit / financialData.initialInvestment) * 100).toFixed(1);
  };

  const generateCashFlow = () => {
    const months = [];
    let cumulativeCash = -financialData.initialInvestment;

    for (let i = 1; i <= financialData.projectionMonths; i++) {
      const monthlyProfit =
        financialData.monthlyRevenue -
        (financialData.fixedCosts + financialData.variableCosts);
      cumulativeCash += monthlyProfit;
      months.push({
        month: i,
        revenue: financialData.monthlyRevenue,
        expenses: financialData.fixedCosts + financialData.variableCosts,
        profit: monthlyProfit,
        cumulative: cumulativeCash,
      });
    }
    return months;
  };

  const progress = ((currentStep + 1) / planSteps.length) * 100;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Simulador de Plan de Negocios
        </h1>
        <p className="text-muted-foreground">
          Crea tu plan de negocios paso a paso con herramientas integradas de
          cálculo financiero
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wizard">Asistente Guiado</TabsTrigger>
          <TabsTrigger value="canvas">Business Model Canvas</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora Financiera</TabsTrigger>
        </TabsList>

        {/* Guided Wizard */}
        <TabsContent value="wizard" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {planSteps[currentStep].icon}
                    Paso {currentStep + 1}: {planSteps[currentStep].title}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {planSteps[currentStep].description}
                  </p>
                </div>
                <Badge variant="outline">
                  {currentStep + 1} de {planSteps.length}
                </Badge>
              </div>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep < 8 && (
                <div className="space-y-4">
                  <Label className="text-lg">
                    Describe {planSteps[currentStep].title.toLowerCase()}
                  </Label>
                  <Textarea
                    placeholder={`Explica ${planSteps[currentStep].description.toLowerCase()}...`}
                    value={
                      businessPlan[
                        planSteps[currentStep].field as keyof BusinessPlan
                      ] as string
                    }
                    onChange={(e) =>
                      updateBusinessPlan(
                        planSteps[currentStep].field,
                        e.target.value
                      )
                    }
                    className="min-h-[200px]"
                  />
                  <div className="text-sm text-muted-foreground">
                    Tip: Sé específico y detallado. Esto te ayudará a clarificar
                    tu idea de negocio.
                  </div>
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Costos de Inicio (Bs.)</Label>
                      <Input
                        type="number"
                        value={businessPlan.financialProjections.startupCosts}
                        onChange={(e) =>
                          updateBusinessPlan("financialProjections", {
                            ...businessPlan.financialProjections,
                            startupCosts: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ingresos Mensuales Proyectados (Bs.)</Label>
                      <Input
                        type="number"
                        value={businessPlan.financialProjections.monthlyRevenue}
                        onChange={(e) =>
                          updateBusinessPlan("financialProjections", {
                            ...businessPlan.financialProjections,
                            monthlyRevenue: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gastos Mensuales (Bs.)</Label>
                      <Input
                        type="number"
                        value={
                          businessPlan.financialProjections.monthlyExpenses
                        }
                        onChange={(e) =>
                          updateBusinessPlan("financialProjections", {
                            ...businessPlan.financialProjections,
                            monthlyExpenses: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mes de Punto de Equilibrio</Label>
                      <Input
                        type="number"
                        value={businessPlan.financialProjections.breakEvenMonth}
                        onChange={(e) =>
                          updateBusinessPlan("financialProjections", {
                            ...businessPlan.financialProjections,
                            breakEvenMonth: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Borrador
                  </Button>
                  {currentStep === planSteps.length - 1 ? (
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Finalizar Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        setCurrentStep(
                          Math.min(planSteps.length - 1, currentStep + 1)
                        )
                      }
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso del Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {planSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`text-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      index <= currentStep
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div
                      className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        index <= currentStep
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <p className="text-xs font-medium">{step.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Model Canvas */}
        <TabsContent value="canvas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Model Canvas</CardTitle>
              <p className="text-muted-foreground">
                Visualiza tu modelo de negocio de forma interactiva
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 min-h-[600px]">
                {/* Key Partners */}
                <Card className="border-2 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-blue-600">
                      Socios Clave
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder="¿Quiénes son tus socios estratégicos?"
                      className="min-h-[100px] border-none p-0 resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Key Activities */}
                <Card className="border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-green-600">
                      Actividades Clave
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder="¿Qué actividades son esenciales?"
                      className="min-h-[100px] border-none p-0 resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Value Propositions */}
                <Card className="border-2 border-red-200 row-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-red-600">
                      Propuesta de Valor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder="¿Qué valor único ofreces?"
                      className="min-h-[200px] border-none p-0 resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Customer Relationships */}
                <Card className="border-2 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-purple-600">
                      Relación con Clientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder="¿Cómo te relacionas con clientes?"
                      className="min-h-[100px] border-none p-0 resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Customer Segments */}
                <Card className="border-2 border-orange-200 row-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-orange-600">
                      Segmentos de Clientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder="¿Quiénes son tus clientes?"
                      className="min-h-[200px] border-none p-0 resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Key Resources */}
                <Card className="border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-green-600">
                      Recursos Clave
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder="¿Qué recursos necesitas?"
                      className="min-h-[100px] border-none p-0 resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Channels */}
                <Card className="border-2 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-purple-600">
                      Canales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder="¿Cómo llegas a tus clientes?"
                      className="min-h-[100px] border-none p-0 resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Cost Structure */}
                <Card className="border-2 border-yellow-200 col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-yellow-600">
                      Estructura de Costos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder="¿Cuáles son tus principales costos?"
                      className="min-h-[100px] border-none p-0 resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Revenue Streams */}
                <Card className="border-2 border-teal-200 col-span-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-teal-600">
                      Fuentes de Ingresos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder="¿Cómo generas ingresos?"
                      className="min-h-[100px] border-none p-0 resize-none"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end mt-6 gap-2">
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Canvas
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar a PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Parámetros Financieros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Inversión Inicial (Bs.)</Label>
                  <Input
                    type="number"
                    value={financialData.initialInvestment}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        initialInvestment: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ingresos Mensuales (Bs.)</Label>
                  <Input
                    type="number"
                    value={financialData.monthlyRevenue}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        monthlyRevenue: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Costos Fijos Mensuales (Bs.)</Label>
                  <Input
                    type="number"
                    value={financialData.fixedCosts}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        fixedCosts: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Costos Variables Mensuales (Bs.)</Label>
                  <Input
                    type="number"
                    value={financialData.variableCosts}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        variableCosts: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meses de Proyección</Label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={financialData.projectionMonths}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        projectionMonths: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Indicadores Clave
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {calculateBreakEven()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Punto de Equilibrio (meses)
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {calculateROI()}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ROI Anual
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Ganancia Mensual:</span>
                    <span className="font-semibold">
                      Bs.{" "}
                      {(
                        financialData.monthlyRevenue -
                        financialData.fixedCosts -
                        financialData.variableCosts
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margen de Ganancia:</span>
                    <span className="font-semibold">
                      {(
                        ((financialData.monthlyRevenue -
                          financialData.fixedCosts -
                          financialData.variableCosts) /
                          financialData.monthlyRevenue) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ganancia Anual:</span>
                    <span className="font-semibold">
                      Bs.{" "}
                      {(
                        (financialData.monthlyRevenue -
                          financialData.fixedCosts -
                          financialData.variableCosts) *
                        12
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Projection */}
          <Card>
            <CardHeader>
              <CardTitle>Proyección de Flujo de Caja</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Mes</th>
                      <th className="text-right p-2">Ingresos</th>
                      <th className="text-right p-2">Gastos</th>
                      <th className="text-right p-2">Ganancia</th>
                      <th className="text-right p-2">Acumulado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generateCashFlow().map((month) => (
                      <tr key={month.month} className="border-b">
                        <td className="p-2">{month.month}</td>
                        <td className="text-right p-2">
                          Bs. {month.revenue.toLocaleString()}
                        </td>
                        <td className="text-right p-2">
                          Bs. {month.expenses.toLocaleString()}
                        </td>
                        <td
                          className={`text-right p-2 ${month.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          Bs. {month.profit.toLocaleString()}
                        </td>
                        <td
                          className={`text-right p-2 font-semibold ${month.cumulative >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          Bs. {month.cumulative.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
