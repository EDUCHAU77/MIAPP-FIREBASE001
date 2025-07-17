import React, { useState } from 'react';
import { Globe, Palette, Wifi, Shield, Download, User, Bell, HelpCircle } from 'lucide-react';

interface SettingsProps {
  onNavigate: (screen: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const [language, setLanguage] = useState('es');
  const [theme, setTheme] = useState('dark');
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const settingsSections = [
    {
      title: 'Apariencia',
      icon: Palette,
      settings: [
        {
          id: 'theme',
          label: 'Tema',
          type: 'select',
          value: theme,
          options: [
            { value: 'dark', label: 'Oscuro' },
            { value: 'light', label: 'Claro' },
            { value: 'auto', label: 'Automático' }
          ],
          onChange: setTheme
        },
        {
          id: 'language',
          label: 'Idioma',
          type: 'select',
          value: language,
          options: [
            { value: 'es', label: 'Español' },
            { value: 'en', label: 'English' },
            { value: 'pt', label: 'Português' }
          ],
          onChange: setLanguage
        }
      ]
    },
    {
      title: 'Funcionalidad',
      icon: Download,
      settings: [
        {
          id: 'autoSave',
          label: 'Guardado automático',
          type: 'toggle',
          value: autoSave,
          onChange: setAutoSave,
          description: 'Guarda automáticamente tu trabajo cada 30 segundos'
        },
        {
          id: 'offlineMode',
          label: 'Modo sin conexión',
          type: 'toggle',
          value: offlineMode,
          onChange: setOfflineMode,
          description: 'Permite trabajar sin conexión a internet'
        }
      ]
    },
    {
      title: 'Notificaciones',
      icon: Bell,
      settings: [
        {
          id: 'notifications',
          label: 'Notificaciones',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
          description: 'Recibe notificaciones sobre actualizaciones y tips'
        }
      ]
    },
    {
      title: 'Privacidad',
      icon: Shield,
      settings: [
        {
          id: 'analytics',
          label: 'Análisis de uso',
          type: 'toggle',
          value: false,
          onChange: () => {},
          description: 'Ayuda a mejorar la aplicación compartiendo datos anónimos'
        },
        {
          id: 'crashReports',
          label: 'Reportes de errores',
          type: 'toggle',
          value: true,
          onChange: () => {},
          description: 'Envía reportes automáticos de errores para mejorar la estabilidad'
        }
      ]
    }
  ];

  const renderSetting = (setting: any) => {
    switch (setting.type) {
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => setting.onChange(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
          >
            {setting.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={setting.value}
              onChange={(e) => setting.onChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
          </label>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          Configuración
        </h1>
        <p className="text-lg text-gray-400">
          Personaliza tu experiencia con ThumbCrafter
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <section.icon className="h-6 w-6 text-pink-500" />
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              </div>
              
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <label className="text-white font-medium">{setting.label}</label>
                        {renderSetting(setting)}
                      </div>
                      {setting.description && (
                        <p className="text-sm text-gray-400 mt-1">{setting.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Acciones rápidas</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <Download className="h-5 w-5 text-cyan-400" />
                <span className="text-white">Exportar configuración</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <User className="h-5 w-5 text-green-400" />
                <span className="text-white">Gestionar cuenta</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <HelpCircle className="h-5 w-5 text-blue-400" />
                <span className="text-white">Ayuda y soporte</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Información</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Versión:</span>
                <span className="text-white">2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Almacenamiento:</span>
                <span className="text-white">2.5 GB / 5 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Plantillas:</span>
                <span className="text-white">15 guardadas</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500/20 to-cyan-400/20 rounded-xl p-6 border border-pink-500/30">
            <h3 className="text-lg font-semibold text-white mb-2">🚀 Actualización disponible</h3>
            <p className="text-sm text-gray-300 mb-4">
              Nueva versión con mejoras de rendimiento y características adicionales.
            </p>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg font-medium hover:shadow-lg transition-all">
              Actualizar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};