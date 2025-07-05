&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
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
  Leaf,
  Heart,
  CircleDollarSign,
  HelpCircle,
  Link,
  Video,
} from &ldquo;lucide-react&rdquo;;
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from &ldquo;@/components/ui/tooltip&rdquo;;

interface BusinessPlan {
  tripleImpactAssessment: {
    problemSolved: string;
    beneficiaries: string;
    resourcesUsed: string;
    communityInvolvement: string;
    longTermImpact: string;
  };
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
    tripleImpactAssessment: {
      problemSolved: &ldquo;&rdquo;,
      beneficiaries: &ldquo;&rdquo;,
      resourcesUsed: &ldquo;&rdquo;,
      communityInvolvement: &ldquo;&rdquo;,
      longTermImpact: &ldquo;&rdquo;,
    },
    executiveSummary: &ldquo;&rdquo;,
    businessDescription: &ldquo;&rdquo;,
    marketAnalysis: &ldquo;&rdquo;,
    competitiveAnalysis: &ldquo;&rdquo;,
    marketingPlan: &ldquo;&rdquo;,
    operationalPlan: &ldquo;&rdquo;,
    managementTeam: &ldquo;&rdquo;,
    financialProjections: {
      startupCosts: 0,
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      breakEvenMonth: 0,
    },
    riskAnalysis: &ldquo;&rdquo;,
    appendices: &ldquo;&rdquo;,
  });

  const [financialData, setFinancialData] = useState<FinancialData>({
    initialInvestment: 10000,
    monthlyRevenue: 5000,
    fixedCosts: 2000,
    variableCosts: 1000,
    projectionMonths: 12,
  });

  const [activeTab, setActiveTab] = useState(&ldquo;wizard&rdquo;);

  const planSteps = [
    {
      title: &ldquo;¿Tu Negocio Ayuda?&rdquo;,
      description: &ldquo;Cuéntanos sobre el impacto de tu negocio&rdquo;,
      icon: <Leaf className=&ldquo;h-5 w-5&rdquo; />,
      field: &ldquo;tripleImpactAssessment&rdquo;,
      tooltip:
        &ldquo;Vamos a descubrir juntos si tu negocio puede ayudar a la sociedad y al medio ambiente&rdquo;,
    },
    {
      title: &ldquo;Resumen Ejecutivo&rdquo;,
      description: &ldquo;Una visión general de tu negocio&rdquo;,
      icon: <FileText className=&ldquo;h-5 w-5&rdquo; />,
      field: &ldquo;executiveSummary&rdquo;,
      tooltip:
        &ldquo;Resume los puntos clave de tu plan de negocio, incluyendo la propuesta de valor y los objetivos principales&rdquo;,
    },
    {
      title: &ldquo;Descripción del Negocio&rdquo;,
      description: &ldquo;¿Qué hace tu empresa?&rdquo;,
      icon: <Lightbulb className=&ldquo;h-5 w-5&rdquo; />,
      field: &ldquo;businessDescription&rdquo;,
      tooltip:
        &ldquo;Detalla el propósito de tu empresa, los productos o servicios que ofrece y el problema que resuelve&rdquo;,
    },
    {
      title: &ldquo;Análisis de Mercado&rdquo;,
      description: &ldquo;Tu mercado objetivo y oportunidades&rdquo;,
      icon: <TrendingUp className=&ldquo;h-5 w-5&rdquo; />,
      field: &ldquo;marketAnalysis&rdquo;,
      tooltip:
        &ldquo;Identifica y analiza tu mercado objetivo, tendencias del sector y oportunidades de crecimiento&rdquo;,
    },
    {
      title: &ldquo;Análisis Competitivo&rdquo;,
      description: &ldquo;Quiénes son tus competidores&rdquo;,
      icon: <Target className=&ldquo;h-5 w-5&rdquo; />,
      field: &ldquo;competitiveAnalysis&rdquo;,
      tooltip:
        &ldquo;Evalúa tus competidores directos e indirectos, sus fortalezas y debilidades, y tu ventaja competitiva&rdquo;,
    },
    {
      title: &ldquo;Plan de Marketing&rdquo;,
      description: &ldquo;Cómo vas a atraer clientes&rdquo;,
      icon: <Users className=&ldquo;h-5 w-5&rdquo; />,
      field: &ldquo;marketingPlan&rdquo;,
      tooltip:
        &ldquo;Define tus estrategias de marketing, canales de distribución y tácticas para llegar a tus clientes&rdquo;,
    },
    {
      title: &ldquo;Plan Operacional&rdquo;,
      description: &ldquo;Cómo funcionará tu negocio&rdquo;,
      icon: <Cog className=&ldquo;h-5 w-5&rdquo; />,
      field: &ldquo;operationalPlan&rdquo;,
      tooltip:
        &ldquo;Describe los procesos operativos, recursos necesarios y estructura organizacional de tu negocio&rdquo;,
    },
    {
      title: &ldquo;Equipo de Gestión&rdquo;,
      description: &ldquo;Quiénes están detrás del negocio&rdquo;,
      icon: <Users className=&ldquo;h-5 w-5&rdquo; />,
      field: &ldquo;managementTeam&rdquo;,
      tooltip:
        &ldquo;Presenta al equipo directivo, sus roles, experiencia y las posiciones clave por cubrir&rdquo;,
    },
    {
      title: &ldquo;Proyecciones Financieras&rdquo;,
      description: &ldquo;Números y proyecciones&rdquo;,
      icon: <DollarSign className=&ldquo;h-5 w-5&rdquo; />,
      field: &ldquo;financialProjections&rdquo;,
      tooltip:
        &ldquo;Desarrolla proyecciones financieras realistas, incluyendo costos, ingresos y punto de equilibrio&rdquo;,
    },
    {
      title: &ldquo;Análisis de Riesgos&rdquo;,
      description: &ldquo;Identificar y mitigar riesgos&rdquo;,
      icon: <Shield className=&ldquo;h-5 w-5&rdquo; />,
      field: &ldquo;riskAnalysis&rdquo;,
      tooltip:
        &ldquo;Identifica los principales riesgos del negocio y las estrategias para mitigarlos&rdquo;,
    },
  ];

  const impactQuestions = [
    {
      field: &ldquo;problemSolved&rdquo;,
      question: &ldquo;¿Qué problema ayuda a resolver tu negocio?&rdquo;,
      placeholder:
        &ldquo;Por ejemplo: reducir la basura, dar trabajo a jóvenes, mejorar la educación...&rdquo;,
      helpLink: &ldquo;/courses/impact/problem-identification&rdquo;,
      videoLink: &ldquo;/courses/impact/video-1&rdquo;,
    },
    {
      field: &ldquo;beneficiaries&rdquo;,
      question: &ldquo;¿A quiénes beneficia tu negocio además de tus clientes?&rdquo;,
      placeholder: &ldquo;Por ejemplo: familias locales, estudiantes, el barrio...&rdquo;,
      helpLink: &ldquo;/courses/impact/beneficiaries&rdquo;,
      videoLink: &ldquo;/courses/impact/video-2&rdquo;,
    },
    {
      field: &ldquo;resourcesUsed&rdquo;,
      question: &ldquo;¿Qué recursos naturales usa tu negocio?&rdquo;,
      placeholder: &ldquo;Por ejemplo: agua, electricidad, materiales reciclados...&rdquo;,
      helpLink: &ldquo;/courses/impact/resources&rdquo;,
      videoLink: &ldquo;/courses/impact/video-3&rdquo;,
    },
    {
      field: &ldquo;communityInvolvement&rdquo;,
      question: &ldquo;¿Cómo participa la comunidad en tu negocio?&rdquo;,
      placeholder: &ldquo;Por ejemplo: como trabajadores, proveedores, socios...&rdquo;,
      helpLink: &ldquo;/courses/impact/community&rdquo;,
      videoLink: &ldquo;/courses/impact/video-4&rdquo;,
    },
    {
      field: &ldquo;longTermImpact&rdquo;,
      question: &ldquo;¿Cómo ayudará tu negocio en el futuro?&rdquo;,
      placeholder:
        &ldquo;Por ejemplo: crear más empleos, cuidar el medio ambiente...&rdquo;,
      helpLink: &ldquo;/courses/impact/long-term&rdquo;,
      videoLink: &ldquo;/courses/impact/video-5&rdquo;,
    },
  ];

  const updateBusinessPlan = (field: string, value: unknown) => {
    setBusinessPlan((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateBreakEven = () => {
    const netMonthlyProfit =
      financialData.monthlyRevenue -
      (financialData.fixedCosts + financialData.variableCosts);
    if (netMonthlyProfit <= 0) return &ldquo;No alcanza punto de equilibrio&rdquo;;
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

  const analyzeTripleImpact = () => {
    const assessment = businessPlan.tripleImpactAssessment;
    if (
      assessment.problemSolved.toLowerCase().includes(&ldquo;trabajo&rdquo;) ||
      assessment.problemSolved.toLowerCase().includes(&ldquo;empleo&rdquo;) ||
      assessment.communityInvolvement.toLowerCase().includes(&ldquo;trabajo&rdquo;)
    ) {
      impacts.economic = true;
    }

    if (
      assessment.beneficiaries.length > 0 ||
      assessment.communityInvolvement.length > 0
    ) {
      impacts.social = true;
    }

    if (
      assessment.resourcesUsed.toLowerCase().includes(&ldquo;recicl&rdquo;) ||
      assessment.problemSolved.toLowerCase().includes(&ldquo;ambiente&rdquo;) ||
      assessment.longTermImpact.toLowerCase().includes(&ldquo;ambiente&rdquo;)
    ) {
      impacts.environmental = true;
    }

    return impacts;
  };

  const getImpactFeedback = () => {
    const impactCount = Object.values(impacts).filter(Boolean).length;

    if (impactCount === 0) {
      return {
        message:
          &ldquo;Tu negocio aún puede crecer en su impacto. ¡Sigue explorando!&rdquo;,
        color: &ldquo;text-blue-600&rdquo;,
      };
    } else if (impactCount === 3) {
      return {
        message: &ldquo;¡Excelente! Tu negocio tiene triple impacto. 🌟&rdquo;,
        color: &ldquo;text-green-600&rdquo;,
      };
    } else {
      return {
        message: `Tu negocio ya genera ${impactCount} tipos de impacto. ¡Vas por buen camino!`,
        color: &ldquo;text-blue-600&rdquo;,
      };
    }
  };

  const progress = ((currentStep + 1) / planSteps.length) * 100;

  return (
    <div className=&ldquo;container mx-auto p-6&rdquo;>
      <div className=&ldquo;mb-8&rdquo;>
        <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>
          Simulador de Plan de Negocios
        </h1>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Crea tu plan de negocios paso a paso con herramientas integradas de
          cálculo financiero
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className=&ldquo;space-y-6&rdquo;
      >
        <TabsList className=&ldquo;grid w-full grid-cols-3&rdquo;>
          <TabsTrigger value=&ldquo;wizard&rdquo;>Asistente Guiado</TabsTrigger>
          <TabsTrigger value=&ldquo;canvas&rdquo;>Business Model Canvas</TabsTrigger>
          <TabsTrigger value=&ldquo;calculator&rdquo;>Calculadora Financiera</TabsTrigger>
        </TabsList>

        {/* Guided Wizard */}
        <TabsContent value=&ldquo;wizard&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <div>
                    <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                      {planSteps[currentStep].icon}
                      Paso {currentStep + 1}: {planSteps[currentStep].title}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className=&ldquo;h-4 w-4 ml-2 text-muted-foreground&rdquo; />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className=&ldquo;max-w-xs&rdquo;>
                              {planSteps[currentStep].tooltip}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <p className=&ldquo;text-muted-foreground mt-1&rdquo;>
                      {planSteps[currentStep].description}
                    </p>
                  </div>
                </div>
                <Badge variant=&ldquo;outline&rdquo;>
                  {currentStep + 1} de {planSteps.length}
                </Badge>
              </div>
              <Progress value={progress} className=&ldquo;mt-4&rdquo; />
            </CardHeader>
            <CardContent className=&ldquo;space-y-6&rdquo;>
              {currentStep === 0 ? (
                <div className=&ldquo;max-w-6xl mx-auto&rdquo;>
                  {/* Impact Questions Grid */}
                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
                    {impactQuestions.map((q, index) => (
                      <div
                        key={index}
                        className=&ldquo;bg-white rounded-xl p-6 shadow-sm border-2 border-transparent hover:border-blue-100 transition-all&rdquo;
                      >
                        <div className=&ldquo;space-y-4&rdquo;>
                          <div className=&ldquo;flex items-start gap-3&rdquo;>
                            <div className=&ldquo;bg-blue-50 rounded-full p-2 mt-1&rdquo;>
                              <div className=&ldquo;h-6 w-6 text-blue-600&rdquo;>
                                {index === 0 ? (
                                  <Lightbulb className=&ldquo;h-6 w-6&rdquo; />
                                ) : index === 1 ? (
                                  <Users className=&ldquo;h-6 w-6&rdquo; />
                                ) : index === 2 ? (
                                  <Leaf className=&ldquo;h-6 w-6&rdquo; />
                                ) : index === 3 ? (
                                  <Heart className=&ldquo;h-6 w-6&rdquo; />
                                ) : (
                                  <Target className=&ldquo;h-6 w-6&rdquo; />
                                )}
                              </div>
                            </div>
                            <Label className=&ldquo;text-lg font-medium leading-tight&rdquo;>
                              {q.question}
                            </Label>
                          </div>

                          <Textarea
                            value={
                              businessPlan.tripleImpactAssessment[
                                q.field as keyof typeof businessPlan.tripleImpactAssessment
                              ]
                            }
                            onChange={(e) =>
                              updateBusinessPlan(&ldquo;tripleImpactAssessment&rdquo;, {
                                ...businessPlan.tripleImpactAssessment,
                                [q.field]: e.target.value,
                              })
                            }
                            placeholder={q.placeholder}
                            className=&ldquo;min-h-[120px] text-base resize-none bg-gray-50/50&rdquo;
                          />

                          <div className=&ldquo;flex gap-3 pt-2&rdquo;>
                            <Link
                              href={q.helpLink}
                              className=&ldquo;flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 hover:underline&rdquo;
                            >
                              <FileText className=&ldquo;h-4 w-4&rdquo; />
                              Ver guía
                            </Link>
                            <Link
                              href={q.videoLink}
                              className=&ldquo;flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 hover:underline&rdquo;
                            >
                              <Video className=&ldquo;h-4 w-4&rdquo; />
                              Ver video
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Impact Feedback */}
                  {Object.values(businessPlan.tripleImpactAssessment).some(
                    (value) => value.length > 0
                  ) && (
                    <div className=&ldquo;mt-8 bg-white rounded-xl p-6 shadow-sm border-2 border-transparent&rdquo;>
                      <div
                        className={`text-lg font-medium ${getImpactFeedback().color} flex items-center gap-2`}
                      >
                        <CheckCircle className=&ldquo;h-5 w-5&rdquo; />
                        {getImpactFeedback().message}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {currentStep < 8 && (
                    <div className=&ldquo;space-y-4&rdquo;>
                      <Label className=&ldquo;text-lg&rdquo;>
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
                        className=&ldquo;min-h-[200px]&rdquo;
                      />
                      <div className=&ldquo;space-y-2&rdquo;>
                        <Label>Material de Apoyo</Label>
                        <div className=&ldquo;space-y-2&rdquo;>
                          <div className=&ldquo;flex items-center gap-2&rdquo;>
                            <Link className=&ldquo;h-4 w-4 text-blue-600&rdquo; />
                            <Input
                              placeholder=&ldquo;URL de recursos adicionales...&rdquo;
                              className=&ldquo;flex-1&rdquo;
                            />
                          </div>
                          <div className=&ldquo;flex items-center gap-2&rdquo;>
                            <Video className=&ldquo;h-4 w-4 text-blue-600&rdquo; />
                            <Input
                              placeholder=&ldquo;URL del video explicativo...&rdquo;
                              className=&ldquo;flex-1&rdquo;
                            />
                          </div>
                        </div>
                      </div>
                      <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                        Tip: Sé específico y detallado. Esto te ayudará a
                        clarificar tu idea de negocio.
                      </div>
                    </div>
                  )}

                  {currentStep === 7 && (
                    <div className=&ldquo;space-y-6&rdquo;>
                      <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                        <div className=&ldquo;space-y-2&rdquo;>
                          <Label>Costos de Inicio (Bs.)</Label>
                          <Input
                            type=&ldquo;number&rdquo;
                            value={
                              businessPlan.financialProjections.startupCosts
                            }
                            onChange={(e) =>
                              updateBusinessPlan(&ldquo;financialProjections&rdquo;, {
                                ...businessPlan.financialProjections,
                                startupCosts: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className=&ldquo;space-y-2&rdquo;>
                          <Label>Ingresos Mensuales Proyectados (Bs.)</Label>
                          <Input
                            type=&ldquo;number&rdquo;
                            value={
                              businessPlan.financialProjections.monthlyRevenue
                            }
                            onChange={(e) =>
                              updateBusinessPlan(&ldquo;financialProjections&rdquo;, {
                                ...businessPlan.financialProjections,
                                monthlyRevenue: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className=&ldquo;space-y-2&rdquo;>
                          <Label>Gastos Mensuales (Bs.)</Label>
                          <Input
                            type=&ldquo;number&rdquo;
                            value={
                              businessPlan.financialProjections.monthlyExpenses
                            }
                            onChange={(e) =>
                              updateBusinessPlan(&ldquo;financialProjections&rdquo;, {
                                ...businessPlan.financialProjections,
                                monthlyExpenses: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className=&ldquo;space-y-2&rdquo;>
                          <Label>Mes de Punto de Equilibrio</Label>
                          <Input
                            type=&ldquo;number&rdquo;
                            value={
                              businessPlan.financialProjections.breakEvenMonth
                            }
                            onChange={(e) =>
                              updateBusinessPlan(&ldquo;financialProjections&rdquo;, {
                                ...businessPlan.financialProjections,
                                breakEvenMonth: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className=&ldquo;flex justify-between&rdquo;>
                    <Button
                      variant=&ldquo;outline&rdquo;
                      onClick={() =>
                        setCurrentStep(Math.max(0, currentStep - 1))
                      }
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className=&ldquo;h-4 w-4 mr-2&rdquo; />
                      Anterior
                    </Button>
                    <div className=&ldquo;flex gap-2&rdquo;>
                      <Button variant=&ldquo;outline&rdquo;>
                        <Save className=&ldquo;h-4 w-4 mr-2&rdquo; />
                        Guardar Borrador
                      </Button>
                      {currentStep === planSteps.length - 1 ? (
                        <Button>
                          <CheckCircle className=&ldquo;h-4 w-4 mr-2&rdquo; />
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
                          <ChevronRight className=&ldquo;h-4 w-4 ml-2&rdquo; />
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso del Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;grid grid-cols-3 md:grid-cols-5 gap-4&rdquo;>
                {planSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`text-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      index <= currentStep
                        ? &ldquo;bg-green-50 border-green-200&rdquo;
                        : &ldquo;bg-gray-50 border-gray-200&rdquo;
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div
                      className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        index <= currentStep
                          ? &ldquo;bg-green-100 text-green-600&rdquo;
                          : &ldquo;bg-gray-100 text-gray-400&rdquo;
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className=&ldquo;h-4 w-4&rdquo; />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <p className=&ldquo;text-xs font-medium&rdquo;>{step.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Model Canvas */}
        <TabsContent value=&ldquo;canvas&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle>Business Model Canvas</CardTitle>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                Visualiza tu modelo de negocio de forma interactiva
              </p>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;grid grid-cols-5 gap-4 min-h-[600px]&rdquo;>
                {/* Key Partners */}
                <Card className=&ldquo;border-2 border-blue-200&rdquo;>
                  <CardHeader className=&ldquo;pb-3&rdquo;>
                    <CardTitle className=&ldquo;text-sm text-blue-600&rdquo;>
                      Socios Clave
                    </CardTitle>
                  </CardHeader>
                  <CardContent className=&ldquo;pt-0&rdquo;>
                    <Textarea
                      placeholder=&ldquo;¿Quiénes son tus socios estratégicos?&rdquo;
                      className=&ldquo;min-h-[100px] border-none p-0 resize-none&rdquo;
                    />
                  </CardContent>
                </Card>

                {/* Key Activities */}
                <Card className=&ldquo;border-2 border-green-200&rdquo;>
                  <CardHeader className=&ldquo;pb-3&rdquo;>
                    <CardTitle className=&ldquo;text-sm text-green-600&rdquo;>
                      Actividades Clave
                    </CardTitle>
                  </CardHeader>
                  <CardContent className=&ldquo;pt-0&rdquo;>
                    <Textarea
                      placeholder=&ldquo;¿Qué actividades son esenciales?&rdquo;
                      className=&ldquo;min-h-[100px] border-none p-0 resize-none&rdquo;
                    />
                  </CardContent>
                </Card>

                {/* Value Propositions */}
                <Card className=&ldquo;border-2 border-red-200 row-span-2&rdquo;>
                  <CardHeader className=&ldquo;pb-3&rdquo;>
                    <CardTitle className=&ldquo;text-sm text-red-600&rdquo;>
                      Propuesta de Valor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className=&ldquo;pt-0&rdquo;>
                    <Textarea
                      placeholder=&ldquo;¿Qué valor único ofreces?&rdquo;
                      className=&ldquo;min-h-[200px] border-none p-0 resize-none&rdquo;
                    />
                  </CardContent>
                </Card>

                {/* Customer Relationships */}
                <Card className=&ldquo;border-2 border-purple-200&rdquo;>
                  <CardHeader className=&ldquo;pb-3&rdquo;>
                    <CardTitle className=&ldquo;text-sm text-purple-600&rdquo;>
                      Relación con Clientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className=&ldquo;pt-0&rdquo;>
                    <Textarea
                      placeholder=&ldquo;¿Cómo te relacionas con clientes?&rdquo;
                      className=&ldquo;min-h-[100px] border-none p-0 resize-none&rdquo;
                    />
                  </CardContent>
                </Card>

                {/* Customer Segments */}
                <Card className=&ldquo;border-2 border-orange-200 row-span-2&rdquo;>
                  <CardHeader className=&ldquo;pb-3&rdquo;>
                    <CardTitle className=&ldquo;text-sm text-orange-600&rdquo;>
                      Segmentos de Clientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className=&ldquo;pt-0&rdquo;>
                    <Textarea
                      placeholder=&ldquo;¿Quiénes son tus clientes?&rdquo;
                      className=&ldquo;min-h-[200px] border-none p-0 resize-none&rdquo;
                    />
                  </CardContent>
                </Card>

                {/* Key Resources */}
                <Card className=&ldquo;border-2 border-green-200&rdquo;>
                  <CardHeader className=&ldquo;pb-3&rdquo;>
                    <CardTitle className=&ldquo;text-sm text-green-600&rdquo;>
                      Recursos Clave
                    </CardTitle>
                  </CardHeader>
                  <CardContent className=&ldquo;pt-0&rdquo;>
                    <Textarea
                      placeholder=&ldquo;¿Qué recursos necesitas?&rdquo;
                      className=&ldquo;min-h-[100px] border-none p-0 resize-none&rdquo;
                    />
                  </CardContent>
                </Card>

                {/* Channels */}
                <Card className=&ldquo;border-2 border-purple-200&rdquo;>
                  <CardHeader className=&ldquo;pb-3&rdquo;>
                    <CardTitle className=&ldquo;text-sm text-purple-600&rdquo;>
                      Canales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className=&ldquo;pt-0&rdquo;>
                    <Textarea
                      placeholder=&ldquo;¿Cómo llegas a tus clientes?&rdquo;
                      className=&ldquo;min-h-[100px] border-none p-0 resize-none&rdquo;
                    />
                  </CardContent>
                </Card>

                {/* Cost Structure */}
                <Card className=&ldquo;border-2 border-yellow-200 col-span-2&rdquo;>
                  <CardHeader className=&ldquo;pb-3&rdquo;>
                    <CardTitle className=&ldquo;text-sm text-yellow-600&rdquo;>
                      Estructura de Costos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className=&ldquo;pt-0&rdquo;>
                    <Textarea
                      placeholder=&ldquo;¿Cuáles son tus principales costos?&rdquo;
                      className=&ldquo;min-h-[100px] border-none p-0 resize-none&rdquo;
                    />
                  </CardContent>
                </Card>

                {/* Revenue Streams */}
                <Card className=&ldquo;border-2 border-teal-200 col-span-3&rdquo;>
                  <CardHeader className=&ldquo;pb-3&rdquo;>
                    <CardTitle className=&ldquo;text-sm text-teal-600&rdquo;>
                      Fuentes de Ingresos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className=&ldquo;pt-0&rdquo;>
                    <Textarea
                      placeholder=&ldquo;¿Cómo generas ingresos?&rdquo;
                      className=&ldquo;min-h-[100px] border-none p-0 resize-none&rdquo;
                    />
                  </CardContent>
                </Card>
              </div>

              <div className=&ldquo;flex justify-end mt-6 gap-2&rdquo;>
                <Button variant=&ldquo;outline&rdquo;>
                  <Save className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Guardar Canvas
                </Button>
                <Button>
                  <Download className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Exportar a PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Calculator */}
        <TabsContent value=&ldquo;calculator&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-6&rdquo;>
            {/* Input Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                  <Calculator className=&ldquo;h-5 w-5&rdquo; />
                  Parámetros Financieros
                </CardTitle>
              </CardHeader>
              <CardContent className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Inversión Inicial (Bs.)</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    value={financialData.initialInvestment}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        initialInvestment: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Ingresos Mensuales (Bs.)</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    value={financialData.monthlyRevenue}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        monthlyRevenue: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Costos Fijos Mensuales (Bs.)</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    value={financialData.fixedCosts}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        fixedCosts: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Costos Variables Mensuales (Bs.)</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    value={financialData.variableCosts}
                    onChange={(e) =>
                      setFinancialData((prev) => ({
                        ...prev,
                        variableCosts: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Meses de Proyección</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    min=&ldquo;1&rdquo;
                    max=&ldquo;60&rdquo;
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
                <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                  <PieChart className=&ldquo;h-5 w-5&rdquo; />
                  Indicadores Clave
                </CardTitle>
              </CardHeader>
              <CardContent className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                  <div className=&ldquo;text-center p-4 bg-green-50 rounded-lg&rdquo;>
                    <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>
                      {calculateBreakEven()}
                    </div>
                    <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                      Punto de Equilibrio (meses)
                    </div>
                  </div>
                  <div className=&ldquo;text-center p-4 bg-blue-50 rounded-lg&rdquo;>
                    <div className=&ldquo;text-2xl font-bold text-blue-600&rdquo;>
                      {calculateROI()}%
                    </div>
                    <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                      ROI Anual
                    </div>
                  </div>
                </div>

                <Separator />

                <div className=&ldquo;space-y-3&rdquo;>
                  <div className=&ldquo;flex justify-between&rdquo;>
                    <span>Ganancia Mensual:</span>
                    <span className=&ldquo;font-semibold&rdquo;>
                      Bs.{&ldquo; &rdquo;}
                      {(
                        financialData.monthlyRevenue -
                        financialData.fixedCosts -
                        financialData.variableCosts
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className=&ldquo;flex justify-between&rdquo;>
                    <span>Margen de Ganancia:</span>
                    <span className=&ldquo;font-semibold&rdquo;>
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
                  <div className=&ldquo;flex justify-between&rdquo;>
                    <span>Ganancia Anual:</span>
                    <span className=&ldquo;font-semibold&rdquo;>
                      Bs.{&ldquo; &rdquo;}
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
              <div className=&ldquo;overflow-x-auto&rdquo;>
                <table className=&ldquo;w-full text-sm&rdquo;>
                  <thead>
                    <tr className=&ldquo;border-b&rdquo;>
                      <th className=&ldquo;text-left p-2&rdquo;>Mes</th>
                      <th className=&ldquo;text-right p-2&rdquo;>Ingresos</th>
                      <th className=&ldquo;text-right p-2&rdquo;>Gastos</th>
                      <th className=&ldquo;text-right p-2&rdquo;>Ganancia</th>
                      <th className=&ldquo;text-right p-2&rdquo;>Acumulado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generateCashFlow().map((month) => (
                      <tr key={month.month} className=&ldquo;border-b&rdquo;>
                        <td className=&ldquo;p-2&rdquo;>{month.month}</td>
                        <td className=&ldquo;text-right p-2&rdquo;>
                          Bs. {month.revenue.toLocaleString()}
                        </td>
                        <td className=&ldquo;text-right p-2&rdquo;>
                          Bs. {month.expenses.toLocaleString()}
                        </td>
                        <td
                          className={`text-right p-2 ${month.profit >= 0 ? &ldquo;text-green-600&rdquo; : &ldquo;text-red-600&rdquo;}`}
                        >
                          Bs. {month.profit.toLocaleString()}
                        </td>
                        <td
                          className={`text-right p-2 font-semibold ${month.cumulative >= 0 ? &ldquo;text-green-600&rdquo; : &ldquo;text-red-600&rdquo;}`}
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
