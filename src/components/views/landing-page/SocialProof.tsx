&ldquo;use client&rdquo;

import React from &ldquo;react&rdquo;

import { useEffect, useState } from &ldquo;react&rdquo;
import { motion, useAnimation } from &ldquo;framer-motion&rdquo;
import { Building, Briefcase, Globe, Laptop, Lightbulb, Rocket, Target, Zap, Brain, Heart } from &ldquo;lucide-react&rdquo;

const companies = [
  { name: &ldquo;TechCorp&rdquo;, icon: Building },
  { name: &ldquo;InnovateLabs&rdquo;, icon: Lightbulb },
  { name: &ldquo;MindfulCo&rdquo;, icon: Brain },
  { name: &ldquo;FutureWorks&rdquo;, icon: Rocket },
  { name: &ldquo;ZenithHealth&rdquo;, icon: Heart },
  { name: &ldquo;GlobalTech&rdquo;, icon: Globe },
  { name: &ldquo;SmartSolutions&rdquo;, icon: Laptop },
  { name: &ldquo;PowerInnovate&rdquo;, icon: Zap },
  { name: &ldquo;TargetAchievers&rdquo;, icon: Target },
  { name: &ldquo;BizPro&rdquo;, icon: Briefcase },
]

export default function SocialProof() {
  const controls = useAnimation()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % companies.length)
    }, 3000) // Change company every 3 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    controls.start({
      opacity: [0, 1, 1, 0],
      y: [20, 0, 0, -20],
      transition: { duration: 2.5, times: [0, 0.1, 0.9, 1] },
    })
  }, [controls])

  return (
    <section className=&ldquo;py-16 bg-secondary overflow-hidden&rdquo;>
      <div className=&ldquo;container mx-auto px-4 sm:px-6 lg:px-8&rdquo;>
        <h2 className=&ldquo;text-2xl md:text-3xl font-bold text-center text-foreground mb-8&rdquo;>
          Trusted by Leading Organizations
        </h2>
        <div className=&ldquo;flex justify-center items-center h-24&rdquo;>
          <motion.div key={currentIndex} animate={controls} className=&ldquo;flex flex-col items-center&rdquo;>
            {React.createElement(companies[currentIndex].icon, {
              size: 48,
              className: &ldquo;text-primary mb-2&rdquo;,
            })}
            <span className=&ldquo;text-lg font-semibold text-foreground&rdquo;>{companies[currentIndex].name}</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

