import React from 'react';
import { Play, Sparkles, Zap, Target, Users, Clock } from 'lucide-react';

interface HomePageProps {
  onNavigate: (screen: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'IA Avanzada',
      description: 'Genera miniaturas profesionales desde texto, imágenes o videos'
    },
    {
      icon: Target,
      title: 'Optimización Automática',
      description: 'Detecta automáticamente tu nicho y ajusta el diseño'
    },
    {
      icon: Clock,
      title: 'Resultados Rápidos',
      description: 'Crea miniaturas impactantes en minutos, no horas'
    },
    {
      icon: Users,
      title: 'Para Creadores',
      description: 'Perfecto para YouTubers, TikTokers y marketers'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-400 blur-3xl opacity-30"></div>
          <Zap className="relative h-20 w-20 text-pink-500 mx-auto" />
        </div>
        
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          ThumbCrafter
        </h1>
        
        <p className="text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Tu creatividad, potenciada por IA
        </p>
        
        <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
          Transforma tus ideas en miniaturas impactantes para videos, gracias a la inteligencia artificial. 
          Sin necesidad de experiencia en diseño, crea, edita y exporta miniaturas personalizadas en minutos.
        </p>

        <button
          onClick={() => onNavigate('input')}
          className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Crear nueva miniatura</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></div>
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="group relative p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-cyan-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <feature.icon className="h-12 w-12 text-pink-500 mb-4 group-hover:text-cyan-400 transition-colors" />
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Section */}
      <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          Flujo de Trabajo Simple
        </h2>
        
        <div className="grid md:grid-cols-5 gap-6">
          {[
            { step: '1', icon: '✍️', title: 'Describe tu idea' },
            { step: '2', icon: '🤖', title: 'La IA genera opciones' },
            { step: '3', icon: '🛠️', title: 'Edita los detalles' },
            { step: '4', icon: '📁', title: 'Exporta para tu plataforma' },
            { step: '5', icon: '💾', title: 'Guarda como plantilla' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-black">
                {item.step}
              </div>
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="text-sm font-medium text-gray-300">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold mb-6 text-white">
          ¿Listo para potenciar tu contenido?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Con ThumbCrafter, tus miniaturas no solo captarán miradas, sino que engancharán desde el primer segundo.
        </p>
        <button
          onClick={() => onNavigate('input')}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
        >
          ¡Prueba ThumbCrafter hoy!
        </button>
      </div>
    </div>
  );
};