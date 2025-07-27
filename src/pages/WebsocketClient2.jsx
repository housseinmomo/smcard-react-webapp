import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

function WebsocketClient2() {
  const [data, setData] = useState(null)
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


    // Traitement des données réelles de l'API
    const formatDate = (dateStr) => {
        if (!dateStr) return "Non spécifié";
        if (dateStr.includes('/')) return dateStr;
        if (dateStr.length >= 8) {
            const day = dateStr.substring(0, 2);
            const month = dateStr.substring(3, 5);
            const year = dateStr.substring(6, 8) + dateStr.substring(9, 11);
            return `${day}/${month}/${year}`;
        }
        return dateStr;
    };

    // Calcul de l'age
    const calculateAge = (dateStr) => {
    if (!dateStr) return "Non calculé";

    let day, month, year;

    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        day = parseInt(parts[0]);
        month = parseInt(parts[1]);
        year = parseInt(parts[2]);
    } else if (dateStr.length >= 8) {
        day = parseInt(dateStr.substring(0, 2));
        month = parseInt(dateStr.substring(3, 5));
        year = parseInt(dateStr.substring(6, 8) + dateStr.substring(9, 11));
    } else {
        return "Non calculé";
    }

    const today = new Date();
    const birthDate = new Date(year, month - 1, day); // month - 1 car les mois commencent à 0

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Si on n'a pas encore atteint l'anniversaire cette année
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
    };


  const getInfos = async () => {
    try {
        setLoading(true);

        setError(null);
        
        console.log("Récupération en cours....");

        const host_ip = "192.168.56.1"
        
        const socket = new WebSocket(`ws://${host_ip}:8081/read-card`);

        socket.onopen = () => {
        console.log("WebSocket connection established");
        //   socket.send("Le client souhaite recuperer les informations de la puce...")
        };

        socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
        console.log("WebSocket connection closed");
        };

        // socket.onmessage ne bloque pas l’exécution.
        socket.onmessage =  (event) => {
            const data = JSON.parse(event.data)
            setData(data)
            console.log(data)

            const processedProfile = {
                numeroId: data.result?.E004?.[0] || "Non spécifié",
                nom: data.result?.E004?.[1] || "Non spécifié", 
                prenom: data.result?.E004?.[2] || "Non spécifié",
                dateNaissance: formatDate(data.result?.E004?.[3]),
                sexe: data.result?.E004?.[4] === "M" ? "Masculin" : data.result?.E004?.[4] === "F" ? "Féminin" : "Non spécifié",
                // Séparation des informations géographiques
                camp: data.result?.E004?.[6] || "Non spécifié",
                ville: data.result?.E004?.[7] || "Non spécifié",
                pays: data.result?.E004?.[8] || "Non spécifié",
                codePostal: data.result?.E004?.[9] || "Non spécifié",
                dateEmission: formatDate(data.result?.E004?.[10]),
                numeroDocument: data.result?.E004?.[11] || "Non spécifié",
                arrondissement: data.result?.E004?.[13] || "Non spécifié",
                commune: data.result?.E004?.[15] || "Non spécifié",
                famille: data.result?.E006 || [],
                avatar: data.result?.E007 || null,
                age: calculateAge(data.result?.E004?.[3]),
                tempsDeTravail: data.time_taken || "Non spécifié"
            };

            setProfileData(processedProfile);

            console.log(processedProfile)
            

        };

    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ProfileCard = ({ profile }) => (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* En-tête simple */}
      <div className="border-b border-gray-100 p-8">
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile.avatar ? (
              <img
                src={profile.avatar.startsWith('data:') ? profile.avatar : `data:image/png;base64,${profile.avatar}`}
                alt="Photo de profil"
                className="w-24 h-24 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                <User size={32} className="text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Informations principales */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {profile.nom} {profile.prenom} 
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>ID: {profile.numeroId}</span>
              <span>•</span>
              <span>{profile.age} ans</span>
              <span>•</span>
              <span>{profile.sexe}</span>
            </div>
          </div>
          
          {/* Bouton d'actualisation */}
          <button 
            onClick={getInfos}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-8">
        {/* Informations personnelles */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Informations personnelles</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-600 w-24">Naissance:</span>
                <span className="text-gray-900">{profile.dateNaissance}</span>
              </div>
              <div className="flex items-start text-sm">
                <MapPin size={16} className="text-gray-400 mr-3 mt-0.5" />
                <div className="flex-1">
                  <div className="flex mb-1">
                    <span className="text-gray-600 w-24">Résidence:</span>
                    <span className="text-gray-900">{profile.camp}</span>
                  </div>
                  <div className="flex mb-1">
                    <span className="text-gray-600 w-24">Ville:</span>
                    <span className="text-gray-900">{profile.ville}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-24">Pays:</span>
                    <span className="text-gray-900">{profile.pays.replace("�", "é")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Informations administratives</h3>
            <div className="space-y-3">
              <div className="flex text-sm">
                <span className="text-gray-600 w-26">Commune: </span>
                <span className="text-gray-900">{profile.commune}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-600 w-26">Arrondissement: </span>
                <span className="text-gray-900">{profile.arrondissement}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-600 w-26">Émission: </span>
                <span className="text-gray-900">{profile.dateEmission}</span>
              </div>
              <div className="flex text-sm">
                <span className="text-gray-600 w-26">Document:</span>
                <span className="text-gray-900 font-mono">{profile.numeroDocument}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section famille */}
        {profile.famille && profile.famille.length > 0 && (
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Informations familiales</h3>
            <div className="space-y-3">
              {profile.famille.map((membre, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{membre.Nom}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {membre.Sexe === 'M' ? 'M' : 'F'} • {membre.Date_Naissance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-6 mt-6">
          <div className="text-xs text-gray-500 text-center">
            Données récupérées en {profile.tempsDeTravail}
          </div>
        </div>
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-center space-x-3">
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        <span className="text-gray-600">Récupération des données...</span>
      </div>
    </div>
  );

  const ErrorState = ({ message }) => (
    <div className="max-w-4xl mx-auto bg-white border border-red-200 rounded-lg shadow-sm p-8">
      <div className="flex items-center space-x-3 text-red-600 mb-4">
        <AlertCircle size={20} />
        <span className="font-medium">Erreur de chargement</span>
      </div>
      <p className="text-gray-600 mb-4">{message}</p>
      <button 
        onClick={getInfos}
        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
      >
        Réessayer
      </button>
    </div>
  );

  const EmptyState = () => (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-12">
      <div className="text-center">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun profil chargé
        </h3>
        <p className="text-gray-600 mb-6">
          Cliquez sur le bouton ci-dessous pour récupérer les informations
        </p>
        <button 
          onClick={getInfos}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Récupérer les informations
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Lecteur en ligne pour les cartes CNSS 
          </h1>
          <p className="text-gray-600">
            Interface de consultation de profil
          </p>
        </div>

        {/* Contenu */}
        {loading && <LoadingState />}
        {error && !loading && <ErrorState message={error} />}
        {!loading && !error && !profileData && <EmptyState />}
        {profileData && !loading && !error && <ProfileCard profile={profileData} />}
      </div>
    </div>
  );
}

export default WebsocketClient2;
