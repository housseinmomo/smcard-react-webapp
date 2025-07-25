import React, { useState } from 'react';
import { User, Plus, Trash2, Upload, Save, ArrowLeft } from 'lucide-react';

const AddProfileForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numeroId: '',
    age: '',
    sexe: 'M',
    dateNaissance: '',
    camp: '',
    ville: '',
    pays: 'République de Djibouti',
    commune: '',
    arrondissement: '',
    dateEmission: '',
    numeroDocument: '',
    avatar: null,
    famille: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      famille: [...prev.famille, { Nom: '', Sexe: 'M', Date_Naissance: '' }]
    }));
  };

  const removeFamilyMember = (index) => {
    setFormData(prev => ({
      ...prev,
      famille: prev.famille.filter((_, i) => i !== index)
    }));
  };

  const updateFamilyMember = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      famille: prev.famille.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.numeroId.trim()) newErrors.numeroId = 'Le numéro ID est requis';
    if (!formData.age || formData.age < 1) newErrors.age = 'L\'âge doit être valide';
    if (!formData.dateNaissance) newErrors.dateNaissance = 'La date de naissance est requise';
    if (!formData.ville.trim()) newErrors.ville = 'La ville est requise';
    if (!formData.commune.trim()) newErrors.commune = 'La commune est requise';
    if (!formData.numeroDocument.trim()) newErrors.numeroDocument = 'Le numéro de document est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-2xl font-semibold text-gray-900">
              Ajouter un nouveau profil
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            Interface d'ajout de profil CNSS
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {/* Section Avatar */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Photo de profil</h3>
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <User size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <label className="block">
                <span className="sr-only">Choisir une photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Informations de base */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Informations personnelles</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.nom ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Entrer le nom"
                />
                {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.prenom ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Entrer le prénom"
                />
                {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro ID *
                </label>
                <input
                  type="text"
                  value={formData.numeroId}
                  onChange={(e) => handleInputChange('numeroId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.numeroId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Entrer le numéro ID"
                />
                {errors.numeroId && <p className="mt-1 text-sm text-red-600">{errors.numeroId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Âge *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.age ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Âge"
                    min="1"
                    max="120"
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexe
                  </label>
                  <select
                    value={formData.sexe}
                    onChange={(e) => handleInputChange('sexe', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance *
                </label>
                <input
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dateNaissance ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.dateNaissance && <p className="mt-1 text-sm text-red-600">{errors.dateNaissance}</p>}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Informations de localisation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Résidence/Camp
                </label>
                <input
                  type="text"
                  value={formData.camp}
                  onChange={(e) => handleInputChange('camp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrer la résidence"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  value={formData.ville}
                  onChange={(e) => handleInputChange('ville', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ville ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Entrer la ville"
                />
                {errors.ville && <p className="mt-1 text-sm text-red-600">{errors.ville}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <input
                  type="text"
                  value={formData.pays}
                  onChange={(e) => handleInputChange('pays', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commune *
                </label>
                <input
                  type="text"
                  value={formData.commune}
                  onChange={(e) => handleInputChange('commune', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.commune ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Entrer la commune"
                />
                {errors.commune && <p className="mt-1 text-sm text-red-600">{errors.commune}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arrondissement
                </label>
                <input
                  type="text"
                  value={formData.arrondissement}
                  onChange={(e) => handleInputChange('arrondissement', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrer l'arrondissement"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informations administratives */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Informations administratives</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'émission
              </label>
              <input
                type="date"
                value={formData.dateEmission}
                onChange={(e) => handleInputChange('dateEmission', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de document *
              </label>
              <input
                type="text"
                value={formData.numeroDocument}
                onChange={(e) => handleInputChange('numeroDocument', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
                  errors.numeroDocument ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Entrer le numéro de document"
              />
              {errors.numeroDocument && <p className="mt-1 text-sm text-red-600">{errors.numeroDocument}</p>}
            </div>
          </div>
        </div>

        {/* Section famille */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Informations familiales</h3>
            <button
              type="button"
              onClick={addFamilyMember}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>Ajouter un membre</span>
            </button>
          </div>

          {formData.famille.length > 0 && (
            <div className="space-y-3">
              {formData.famille.map((membre, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Nom complet"
                      value={membre.Nom}
                      onChange={(e) => updateFamilyMember(index, 'Nom', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      value={membre.Sexe}
                      onChange={(e) => updateFamilyMember(index, 'Sexe', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                    <input
                      type="date"
                      value={membre.Date_Naissance}
                      onChange={(e) => updateFamilyMember(index, 'Date_Naissance', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProfileForm;