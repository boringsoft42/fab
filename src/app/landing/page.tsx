import Link from &ldquo;next/link&rdquo;
import { Button } from &ldquo;@/components/ui/button&rdquo;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;
import { ArrowRight, Users, TrendingUp, Zap, Globe, Smartphone, Leaf } from &ldquo;lucide-react&rdquo;

export default function LandingPage() {
  const emprendimientos = [
    {
      id: 1,
      nombre: &ldquo;EcoTech Solutions&rdquo;,
      descripcion:
        &ldquo;Plataforma tecnológica que integra sensores IoT y algoritmos de machine learning para optimizar el consumo energético en edificios comerciales, reduciendo hasta un 40% los costos operativos.&rdquo;,
      categoria: &ldquo;Tecnología&rdquo;,
      subcategoria: &ldquo;Sostenibilidad&rdquo;,
      anoCreacion: &ldquo;2021&rdquo;,
      crecimiento: &ldquo;+150%&rdquo;,
      icon: Leaf,
      color: &ldquo;bg-green-500&rdquo;,
    },
    {
      id: 2,
      nombre: &ldquo;FinanceAI&rdquo;,
      descripcion:
        &ldquo;Aplicación móvil que utiliza inteligencia artificial para analizar patrones de gasto, predecir flujos de efectivo y ofrecer recomendaciones personalizadas de ahorro e inversión.&rdquo;,
      categoria: &ldquo;Finanzas&rdquo;,
      subcategoria: &ldquo;FinTech&rdquo;,
      anoCreacion: &ldquo;2022&rdquo;,
      crecimiento: &ldquo;+200%&rdquo;,
      icon: TrendingUp,
      color: &ldquo;bg-blue-500&rdquo;,
    },
    {
      id: 3,
      nombre: &ldquo;HealthConnect&rdquo;,
      descripcion:
        &ldquo;Ecosistema digital de telemedicina que conecta pacientes con especialistas, incluye monitoreo remoto de signos vitales y gestión integral de historiales médicos.&rdquo;,
      categoria: &ldquo;Salud&rdquo;,
      subcategoria: &ldquo;HealthTech&rdquo;,
      anoCreacion: &ldquo;2020&rdquo;,
      crecimiento: &ldquo;+180%&rdquo;,
      icon: Users,
      color: &ldquo;bg-purple-500&rdquo;,
    },
    {
      id: 4,
      nombre: &ldquo;SmartLogistics&rdquo;,
      descripcion:
        &ldquo;Sistema de gestión logística que combina IoT, blockchain y análisis predictivo para optimizar rutas de entrega, reducir tiempos y minimizar la huella de carbono.&rdquo;,
      categoria: &ldquo;Logística&rdquo;,
      subcategoria: &ldquo;Supply Chain&rdquo;,
      anoCreacion: &ldquo;2019&rdquo;,
      crecimiento: &ldquo;+120%&rdquo;,
      icon: Globe,
      color: &ldquo;bg-orange-500&rdquo;,
    },
    {
      id: 5,
      nombre: &ldquo;EduVirtual&rdquo;,
      descripcion:
        &ldquo;Plataforma educativa inmersiva que utiliza realidad virtual y aumentada para crear experiencias de aprendizaje interactivas en ciencias, historia y matemáticas.&rdquo;,
      categoria: &ldquo;Educación&rdquo;,
      subcategoria: &ldquo;EdTech&rdquo;,
      anoCreacion: &ldquo;2021&rdquo;,
      crecimiento: &ldquo;+300%&rdquo;,
      icon: Zap,
      color: &ldquo;bg-indigo-500&rdquo;,
    },
    {
      id: 6,
      nombre: &ldquo;FoodieApp&rdquo;,
      descripcion:
        &ldquo;Marketplace que conecta productores locales con consumidores, promoviendo la agricultura sostenible y reduciendo la cadena de intermediarios en alimentos frescos.&rdquo;,
      categoria: &ldquo;Alimentación&rdquo;,
      subcategoria: &ldquo;FoodTech&rdquo;,
      anoCreacion: &ldquo;2022&rdquo;,
      crecimiento: &ldquo;+250%&rdquo;,
      icon: Smartphone,
      color: &ldquo;bg-red-500&rdquo;,
    },
  ]

  return (
    <div className=&ldquo;min-h-screen bg-gradient-to-br from-slate-50 to-slate-100&rdquo;>
      {/* Header */}
      <header className=&ldquo;border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50&rdquo;>
        <div className=&ldquo;container mx-auto px-4 py-4 flex justify-between items-center&rdquo;>
          <div className=&ldquo;flex items-center space-x-2&rdquo;>
            <div className=&ldquo;w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center&rdquo;>
              <Zap className=&ldquo;w-5 h-5 text-white&rdquo; />
            </div>
            <h1 className=&ldquo;text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent&rdquo;>
              Cemse
            </h1>
          </div>
          <Link href=&ldquo;/login&rdquo;>
            <Button variant=&ldquo;outline&rdquo; className=&ldquo;hover:bg-blue-50 bg-transparent&rdquo;>
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className=&ldquo;py-20 px-4&rdquo;>
        <div className=&ldquo;container mx-auto text-center max-w-4xl&rdquo;>
          <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;mb-4&rdquo;>
            🚀 Plataforma de Emprendimientos
          </Badge>
          <h1 className=&ldquo;text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent&rdquo;>
            Descubre los
            <span className=&ldquo;bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent&rdquo;>
              {&ldquo; &rdquo;}
              Emprendimientos{&ldquo; &rdquo;}
            </span>
            del Futuro
          </h1>
          <p className=&ldquo;text-xl text-gray-600 mb-8 leading-relaxed&rdquo;>
            Explora una colección curada de startups innovadoras que están transformando industrias y creando el futuro.
            Únete a nuestra comunidad de emprendedores visionarios.
          </p>
          <div className=&ldquo;flex flex-col sm:flex-row gap-4 justify-center&rdquo;>
            <Link href=&ldquo;/login&rdquo;>
              <Button
                size=&ldquo;lg&rdquo;
                className=&ldquo;bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8&rdquo;
              >
                Comenzar Ahora
                <ArrowRight className=&ldquo;ml-2 w-4 h-4&rdquo; />
              </Button>
            </Link>
            <Link href=&ldquo;/login&rdquo;>
              <Button size=&ldquo;lg&rdquo; variant=&ldquo;outline&rdquo; className=&ldquo;px-8 bg-transparent&rdquo;>
                Ver Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Emprendimientos Grid */}
      <section className=&ldquo;py-16 px-4&rdquo;>
        <div className=&ldquo;container mx-auto max-w-7xl&rdquo;>
          <div className=&ldquo;text-center mb-12&rdquo;>
            <h2 className=&ldquo;text-3xl md:text-4xl font-bold mb-4&rdquo;>Emprendimientos Destacados</h2>
            <p className=&ldquo;text-gray-600 text-lg max-w-2xl mx-auto&rdquo;>
              Conoce las startups más prometedoras en diferentes sectores tecnológicos
            </p>
          </div>

          <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
            {emprendimientos.map((emprendimiento) => {
              const IconComponent = emprendimiento.icon
              return (
                <Card
                  key={emprendimiento.id}
                  className=&ldquo;group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md&rdquo;
                >
                  <CardHeader className=&ldquo;pb-3&rdquo;>
                    <div className=&ldquo;flex items-center justify-between mb-2&rdquo;>
                      <div
                        className={`w-12 h-12 ${emprendimiento.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className=&ldquo;w-6 h-6 text-white&rdquo; />
                      </div>
                      <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                        {emprendimiento.categoria}
                      </Badge>
                    </div>
                    <CardTitle className=&ldquo;text-xl group-hover:text-blue-600 transition-colors&rdquo;>
                      {emprendimiento.nombre}
                    </CardTitle>
                    <CardDescription className=&ldquo;text-gray-600&rdquo;>{emprendimiento.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className=&ldquo;space-y-3 mb-4&rdquo;>
                      <div className=&ldquo;flex justify-between items-center&rdquo;>
                        <div>
                          <p className=&ldquo;text-sm font-medium text-gray-700&rdquo;>Categoría</p>
                          <p className=&ldquo;text-lg font-semibold text-gray-900&rdquo;>{emprendimiento.categoria}</p>
                        </div>
                        <div className=&ldquo;text-right&rdquo;>
                          <p className=&ldquo;text-sm font-medium text-gray-700&rdquo;>Subcategoría</p>
                          <p className=&ldquo;text-lg font-semibold text-blue-600&rdquo;>{emprendimiento.subcategoria}</p>
                        </div>
                      </div>
                      <div className=&ldquo;flex justify-between items-center&rdquo;>
                        <div>
                          <p className=&ldquo;text-sm font-medium text-gray-700&rdquo;>Año de Creación</p>
                          <p className=&ldquo;text-lg font-semibold text-green-600&rdquo;>{emprendimiento.anoCreacion}</p>
                        </div>
                        <div className=&ldquo;text-right&rdquo;>
                          <p className=&ldquo;text-sm font-medium text-gray-700&rdquo;>Crecimiento</p>
                          <p className=&ldquo;text-lg font-semibold text-purple-600&rdquo;>{emprendimiento.crecimiento}</p>
                        </div>
                      </div>
                    </div>
                    <Link href=&ldquo;/login&rdquo;>
                      <Button className=&ldquo;w-full group-hover:bg-blue-600 transition-colors&rdquo;>
                        Ver Detalles
                        <ArrowRight className=&ldquo;ml-2 w-4 h-4&rdquo; />
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
      <section className=&ldquo;py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600&rdquo;>
        <div className=&ldquo;container mx-auto text-center max-w-4xl&rdquo;>
          <h2 className=&ldquo;text-3xl md:text-4xl font-bold text-white mb-6&rdquo;>¿Listo para Emprender?</h2>
          <p className=&ldquo;text-xl text-blue-100 mb-8&rdquo;>
            Únete a nuestra plataforma y accede a herramientas exclusivas, networking y oportunidades de inversión.
          </p>
          <div className=&ldquo;flex flex-col sm:flex-row gap-4 justify-center&rdquo;>
            <Link href=&ldquo;/login&rdquo;>
              <Button size=&ldquo;lg&rdquo; variant=&ldquo;secondary&rdquo; className=&ldquo;px-8 bg-white text-blue-600 hover:bg-gray-100&rdquo;>
                Acceder a la Plataforma
                <ArrowRight className=&ldquo;ml-2 w-4 h-4&rdquo; />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=&ldquo;bg-gray-900 text-white py-12 px-4&rdquo;>
        <div className=&ldquo;container mx-auto text-center&rdquo;>
          <div className=&ldquo;flex items-center justify-center space-x-2 mb-4&rdquo;>
            <div className=&ldquo;w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center&rdquo;>
              <Zap className=&ldquo;w-5 h-5 text-white&rdquo; />
            </div>
            <h3 className=&ldquo;text-xl font-bold&rdquo;>Cemse</h3>
          </div>
          <p className=&ldquo;text-gray-400 mb-6&rdquo;>Conectando emprendedores con el futuro de la innovación</p>
          <Link href=&ldquo;/login&rdquo;>
            <Button variant=&ldquo;outline&rdquo; className=&ldquo;border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent&rdquo;>
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}
