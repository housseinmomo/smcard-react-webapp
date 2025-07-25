import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, Key, FileText, CheckCircle, AlertCircle, Loader, Play, RefreshCw } from 'lucide-react';

const SmartCardInit = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);
  const [cardData, setCardData] = useState({
    cardId: '',
    issuer: 'CNSS Djibouti',
    cardType: 'CNSS_ID',
    securityLevel: 'HIGH',
    keySize: '2048'
  });
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);

  const initSteps = [
    {
      id: 'detect',
      title: 'Détection de la carte',
      description: 'Vérification de la présence et de l\'état de la carte',
      icon: CreditCard,
      duration: 2000
    },
    {
      id: 'format',
      title: 'Formatage de la carte',
      description: 'Effacement et préparation de l\'espace mémoire',
      icon: RefreshCw,
      duration: 3000
    },
    {
      id: 'filesystem',
      title: 'Création du système de fichiers',
      description: 'Initialisation de la structure de répertoires',
      icon: FileText,
      duration: 2500
    },
    {
      id: 'security',
      title: 'Configuration sécuritaire',
      description: 'Génération des clés de sécurité et certificats',
      icon: Shield,
      duration: 4000
    },
    {
      id: 'keys',
      title: 'Génération des clés',
      description: 'Création des clés de chiffrement et d\'authentification',
      icon: Key,
      duration: 3500
    },
    {
      id: 'structure',
      title: 'Structure des données',
      description: 'Création des fichiers de données personnelles',
      icon: FileText,
      duration: 2000
    },
    {
      id: 'validation',
      title: 'Validation finale',
      description: 'Vérification de l\'intégrité de l\'initialisation',
      icon: CheckCircle,
      duration: 1500
    }
  ];

  const generateCardId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CNSS${timestamp.toString().slice(-6)}${random}`;
  };

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const simulateStep = async (step, index) => {
    addLog(`Début: ${step.title}`, 'info');
    
    const stepDuration = step.duration;
    const updateInterval = 100;
    const totalUpdates = stepDuration / updateInterval;
    
    for (let i = 0; i <= totalUpdates; i++) {
      const stepProgress = (i / totalUpdates) * 100;
      const overallProgress = ((index + stepProgress / 100) / initSteps.length) * 100;
      setProgress(overallProgress);
      
      // Messages spécifiques par étape
      if (step.id === 'detect' && i === Math.floor(totalUpdates * 0.5)) {
        addLog('Carte détectée: Puce vierge compatible', 'success');
      } else if (step.id === 'format' && i === Math.floor(totalUpdates * 0.3)) {
        addLog('Effacement de la mémoire EEPROM...', 'info');
      } else if (step.id === 'filesystem' && i === Math.floor(totalUpdates * 0.4)) {
        addLog('Création des répertoires: /CNSS, /SECURITY, /DATA', 'info');
      } else if (step.id === 'security' && i === Math.floor(totalUpdates * 0.6)) {
        addLog('Génération du certificat racine...', 'info');
      } else if (step.id === 'keys' && i === Math.floor(totalUpdates * 0.7)) {
        addLog(`Génération de clés RSA ${cardData.keySize} bits`, 'info');
      }
      
      await new Promise(resolve => setTimeout(resolve, updateInterval));
    }
    
    setCompletedSteps(prev => [...prev, step.id]);
    addLog(`Terminé: ${step.title}`, 'success');
  };

  const startInitialization = async () => {
    if (!cardData.cardId) {
      setCardData(prev => ({ ...prev, cardId: generateCardId() }));
    }
    
    setIsInitializing(true);
    setProgress(0);
    setLogs([]);
    setCompletedSteps([]);
    setCurrentStep(0);
    
    addLog('Début de l\'initialisation de la carte à puce', 'info');
    addLog(`ID de carte: ${cardData.cardId}`, 'info');
    
    for (let i = 0; i < initSteps.length; i++) {
      setCurrentStep(i);
      await simulateStep(initSteps[i], i);
    }
    
    setProgress(100);
    addLog('Initialisation terminée avec succès!', 'success');
    setIsInitializing(false);
  };

  const resetInitialization = () => {
    setCurrentStep(0);
    setProgress(0);
    setLogs([]);
    setCompletedSteps([]);
    setIsInitializing(false);
    setCardData(prev => ({ ...prev, cardId: generateCardId() }));
  };

  useEffect(() => {
    setCardData(prev => ({ ...prev, cardId: generateCardId() }));
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* En-tête */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Initialisation de carte à puce
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Configuration et création des fichiers système pour nouvelle carte CNSS
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">ID de carte</div>
            <div className="font-mono text-sm font-medium">{cardData.cardId}</div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de carte
                  </label>
                  <select
                    value={cardData.cardType}
                    onChange={(e) => setCardData(prev => ({ ...prev, cardType: e.target.value }))}
                    disabled={isInitializing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="CNSS_ID">CNSS ID Card</option>
                    <option value="CNSS_EMPLOYEE">CNSS Employee</option>
                    <option value="CNSS_ADMIN">CNSS Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau de sécurité
                  </label>
                  <select
                    value={cardData.securityLevel}
                    onChange={(e) => setCardData(prev => ({ ...prev, securityLevel: e.target.value }))}
                    disabled={isInitializing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="HIGH">Élevé</option>
                    <option value="MAXIMUM">Maximum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille des clés
                  </label>
                  <select
                    value={cardData.keySize}
                    onChange={(e) => setCardData(prev => ({ ...prev, keySize: e.target.value }))}
                    disabled={isInitializing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="1024">1024 bits</option>
                    <option value="2048">2048 bits</option>
                    <option value="4096">4096 bits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Émetteur
                  </label>
                  <input
                    type="text"
                    value={cardData.issuer}
                    onChange={(e) => setCardData(prev => ({ ...prev, issuer: e.target.value }))}
                    disabled={isInitializing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="mt-6 space-y-3">
                {!isInitializing && completedSteps.length === 0 && (
                  <button
                    onClick={startInitialization}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <Play size={16} />
                    <span>Démarrer l'initialisation</span>
                  </button>
                )}

                {!isInitializing && completedSteps.length > 0 && completedSteps.length < initSteps.length && (
                  <button
                    onClick={startInitialization}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <Play size={16} />
                    <span>Reprendre</span>
                  </button>
                )}

                {completedSteps.length === initSteps.length && (
                  <button
                    onClick={resetInitialization}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    <RefreshCw size={16} />
                    <span>Nouvelle initialisation</span>
                  </button>
                )}

                <button
                  onClick={onCancel}
                  disabled={isInitializing}
                  className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>

          {/* Processus et logs */}
          <div className="lg:col-span-2">
            {/* Barre de progression */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900">Progression</h3>
                <span className="text-sm font-medium text-gray-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Étapes */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Étapes d'initialisation</h3>
              <div className="space-y-3">
                {initSteps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isCurrent = currentStep === index && isInitializing;
                  const isPending = index > currentStep;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg border ${
                        isCompleted
                          ? 'bg-green-50 border-green-200'
                          : isCurrent
                          ? 'bg-blue-50 border-blue-200'
                          : isPending
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isCurrent
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle size={20} />
                        ) : isCurrent ? (
                          <Loader size={20} className="animate-spin" />
                        ) : (
                          <step.icon size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isCompleted ? 'text-green-900' : isCurrent ? 'text-blue-900' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </div>
                        <div className={`text-sm ${
                          isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {step.description}
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircle size={20} className="text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logs */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Journal d'activité</h3>
              <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-500">En attente de démarrage...</div>
                ) : (
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                        <span className={
                          log.type === 'success' ? 'text-green-400' :
                          log.type === 'error' ? 'text-red-400' :
                          'text-gray-300'
                        }>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCardInit;