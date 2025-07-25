import React, { useState } from 'react';
import { User, Plus, Trash2, Save, ArrowLeft, Users } from 'lucide-react';

const AddFamilyMemberForm = ({ onSave, onCancel, profileOwner }) => {
  const [members, setMembers] = useState([
    { Nom: '', Sexe: 'M', Date_Naissance: '' }
  ]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMember = () => {
    setMembers(prev => [...prev, { Nom: '', Sexe: 'M', Date_Naissance: '' }]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      setMembers(prev => prev.filter((_, i) => i !== index));
      // Clear errors for removed member
      const newErrors = { ...errors };
      delete newErrors[`member_${index}_nom`];
      delete newErrors[`member_${index}_date`];
      setErrors(newErrors);
    }
  };

  const updateMember = (index, field, value) => {
    setMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ));
    
    // Clear specific error when user starts typing
    const errorKey = `member_${index}_${field === 'Nom' ? 'nom' : field === 'Date_Naissance' ? 'date' : ''}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    members.forEach((member, index) => {
      if (!member.Nom.trim()) {
        newErrors[`member_${index}_nom`] = 'Le nom est requis';
      }
      if (!member.Date_Naissance) {
        newErrors[`member_${index}_date`] = 'La date de naissance est requise';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Filter out empty members
    const validMembers = members.filter(member => 
      member.Nom.trim() && member.Date_Naissance
    );

    if (validMembers.length === 0) {
      setErrors({ general: 'Au moins un membre valide est requis' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(validMembers);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ general: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 0 ? `${age} ans` : '';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* En-tête */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Ajouter des membres de famille
              </h1>
              {profileOwner && (
                <p className="text-sm text-gray-600 mt-1">
                  Pour le profil de <span className="font-medium">{profileOwner}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users size={16} />
            <span>{members.length} membre{members.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Message d'information */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Users size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Informations sur les membres de famille</h3>
              <p className="text-sm text-blue-700 mt-1">
                Ajoutez les membres de la famille en remplissant leurs informations personnelles. 
                Vous pouvez ajouter plusieurs membres à la fois.
              </p>
            </div>
          </div>
        </div>

        {/* Erreur générale */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}

        {/* Liste des membres */}
        <div className="space-y-6">
          {members.map((member, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Membre {index + 1}
                </h3>
                {members.length > 1 && (
                  <button
                    onClick={() => removeMember(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Supprimer ce membre"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Nom complet */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={member.Nom}
                    onChange={(e) => updateMember(index, 'Nom', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`member_${index}_nom`] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Entrer le nom complet"
                  />
                  {errors[`member_${index}_nom`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`member_${index}_nom`]}</p>
                  )}
                </div>

                {/* Sexe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexe
                  </label>
                  <select
                    value={member.Sexe}
                    onChange={(e) => updateMember(index, 'Sexe', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>

                {/* Date de naissance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    value={member.Date_Naissance}
                    onChange={(e) => updateMember(index, 'Date_Naissance', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`member_${index}_date`] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                  />
                  {errors[`member_${index}_date`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`member_${index}_date`]}</p>
                  )}
                  {member.Date_Naissance && (
                    <p className="mt-1 text-xs text-gray-500">
                      Âge: {calculateAge(member.Date_Naissance)}
                    </p>
                  )}
                </div>
              </div>

              {/* Aperçu du membre */}
              {member.Nom && member.Date_Naissance && (
                <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{member.Nom}</span>
                        <span className="text-gray-500 ml-2">
                          ({member.Sexe === 'M' ? 'Masculin' : 'Féminin'})
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-600">
                      {calculateAge(member.Date_Naissance)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bouton d'ajout */}
        <div className="mt-6">
          <button
            onClick={addMember}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus size={16} />
            <span>Ajouter un autre membre</span>
          </button>
        </div>

        {/* Résumé */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Résumé</h3>
          <p className="text-sm text-gray-600">
            {members.filter(m => m.Nom.trim() && m.Date_Naissance).length} membre(s) valide(s) 
            sur {members.length} membre(s) total
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="border-t border-gray-100 pt-6 mt-8">
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || members.filter(m => m.Nom.trim() && m.Date_Naissance).length === 0}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={16} />
              <span>
                {isSubmitting ? 'Enregistrement...' : 
                 `Enregistrer ${members.filter(m => m.Nom.trim() && m.Date_Naissance).length} membre(s)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFamilyMemberForm;