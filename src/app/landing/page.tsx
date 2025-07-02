import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, TrendingUp, Zap, Globe, Smartphone, Leaf } from "lucide-react"

export default function LandingPage() {
  const emprendimientos = [
    {
      id: 1,
      nombre: "EcoTech Solutions",
      descripcion:
        "Plataforma tecnológica que integra sensores IoT y algoritmos de machine learning para optimizar el consumo energético en edificios comerciales, reduciendo hasta un 40% los costos operativos.",
      categoria: "Tecnología",
      subcategoria: "Sostenibilidad",
      anoCreacion: "2021",
      crecimiento: "+150%",
      icon: Leaf,
      color: "bg-green-500",
    },
    {
      id: 2,
      nombre: "FinanceAI",
      descripcion:
        "Aplicación móvil que utiliza inteligencia artificial para analizar patrones de gasto, predecir flujos de efectivo y ofrecer recomendaciones personalizadas de ahorro e inversión.",
      categoria: "Finanzas",
      subcategoria: "FinTech",
      anoCreacion: "2022",
      crecimiento: "+200%",
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      id: 3,
      nombre: "HealthConnect",
      descripcion:
        "Ecosistema digital de telemedicina que conecta pacientes con especialistas, incluye monitoreo remoto de signos vitales y gestión integral de historiales médicos.",
      categoria: "Salud",
      subcategoria: "HealthTech",
      anoCreacion: "2020",
      crecimiento: "+180%",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      id: 4,
      nombre: "SmartLogistics",
      descripcion:
        "Sistema de gestión logística que combina IoT, blockchain y análisis predictivo para optimizar rutas de entrega, reducir tiempos y minimizar la huella de carbono.",
      categoria: "Logística",
      subcategoria: "Supply Chain",
      anoCreacion: "2019",
      crecimiento: "+120%",
      icon: Globe,
      color: "bg-orange-500",
    },
    {
      id: 5,
      nombre: "EduVirtual",
      descripcion:
        "Plataforma educativa inmersiva que utiliza realidad virtual y aumentada para crear experiencias de aprendizaje interactivas en ciencias, historia y matemáticas.",
      categoria: "Educación",
      subcategoria: "EdTech",
      anoCreacion: "2021",
      crecimiento: "+300%",
      icon: Zap,
      color: "bg-indigo-500",
    },
    {
      id: 6,
      nombre: "FoodieApp",
      descripcion:
        "Marketplace que conecta productores locales con consumidores, promoviendo la agricultura sostenible y reduciendo la cadena de intermediarios en alimentos frescos.",
      categoria: "Alimentación",
      subcategoria: "FoodTech",
      anoCreacion: "2022",
      crecimiento: "+250%",
      icon: Smartphone,
      color: "bg-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cemse
            </h1>
          </div>
          <Link href="/login">
            <Button variant="outline" className="hover:bg-blue-50 bg-transparent">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🚀 Plataforma de Emprendimientos
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Descubre los
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Emprendimientos{" "}
            </span>
            del Futuro
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Explora una colección curada de startups innovadoras que están transformando industrias y creando el futuro.
            Únete a nuestra comunidad de emprendedores visionarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Ver Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Emprendimientos Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Emprendimientos Destacados</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Conoce las startups más prometedoras en diferentes sectores tecnológicos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emprendimientos.map((emprendimiento) => {
              const IconComponent = emprendimiento.icon
              return (
                <Card
                  key={emprendimiento.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-12 h-12 ${emprendimiento.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {emprendimiento.categoria}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {emprendimiento.nombre}
                    </CardTitle>
                    <CardDescription className="text-gray-600">{emprendimiento.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Categoría</p>
                          <p className="text-lg font-semibold text-gray-900">{emprendimiento.categoria}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">Subcategoría</p>
                          <p className="text-lg font-semibold text-blue-600">{emprendimiento.subcategoria}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Año de Creación</p>
                          <p className="text-lg font-semibold text-green-600">{emprendimiento.anoCreacion}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">Crecimiento</p>
                          <p className="text-lg font-semibold text-purple-600">{emprendimiento.crecimiento}</p>
                        </div>
                      </div>
                    </div>
                    <Link href="/login">
                      <Button className="w-full group-hover:bg-blue-600 transition-colors">
                        Ver Detalles
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para Emprender?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a nuestra plataforma y accede a herramientas exclusivas, networking y oportunidades de inversión.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="px-8 bg-white text-blue-600 hover:bg-gray-100">
                Acceder a la Plataforma
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">Cemse</h3>
          </div>
          <p className="text-gray-400 mb-6">Conectando emprendedores con el futuro de la innovación</p>
          <Link href="/login">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}
