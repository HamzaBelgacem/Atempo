
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronRight, MapPin, Type, AlignLeft, Clock, Video, CheckCircle2, Sparkles, Star, Map as MapIcon, Calendar, Search, UserPlus, Trash2 } from 'lucide-react';
import { CATEGORIES, User, EventCollaborator, ContributorRole } from '../types';

const CONTRIBUTOR_ROLES: ContributorRole[] = [
  'Event Host',
  'Performing Artist',
  'Visual Artist',
  'Curator',
  'Sponsor',
  'Co-organizer'
];

interface CreateEventModalProps {
  user: User;
  onClose: () => void;
  onCreate: (eventData: any) => void;
  onUpdateUser: (updatedUser: User) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ user, onClose, onCreate, onUpdateUser }) => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Visual Arts',
    description: '',
    location: user.favoriteAddress?.label || '',
    lat: user.favoriteAddress?.lat || 39.4699,
    lng: user.favoriteAddress?.lng || -0.3763,
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    price: 0,
    minGroupSize: 2,
    maxGroupSize: 10,
    capacity: 50,
    videoFile: null as File | null,
    imageFile: null as File | null,
    saveAsFavorite: false,
    collaborators: [] as EventCollaborator[]
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<ContributorRole>('Performing Artist');

  useEffect(() => {
    if (step === 2 && addressInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'es' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          setFormData(prev => ({
            ...prev,
            location: place.formatted_address || place.name || '',
            lat: place.geometry!.location!.lat(),
            lng: place.geometry!.location!.lng()
          }));
        }
      });
    }
  }, [step]);

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
    else {
      if (formData.saveAsFavorite) {
        onUpdateUser({
          ...user,
          favoriteAddress: {
            label: formData.location,
            lat: formData.lat,
            lng: formData.lng
          }
        });
      }
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-white/40 backdrop-blur-xl animate-fade-in">
      <div className="bg-paper w-full max-w-sm rounded-3xl shadow-watercolor overflow-hidden flex flex-col items-center text-center p-10 animate-scale-in border border-black/10">
          <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mb-8 shadow-glow-sunset animate-bounce">
              <CheckCircle2 size={50} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary mb-4 tracking-tight">¡Evento Publicado!</h2>
          <p className="text-primary/60 text-sm font-bold leading-relaxed mb-10 px-4 text-left">
            Tu experiencia ha sido guardada. Te notificaremos 24 horas antes del inicio del evento para confirmar preparativos.
          </p>
          <div className="w-full space-y-4">
            <button 
                onClick={() => onCreate(formData)}
                className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-glow-sunset active:scale-95 transition-all flex items-center justify-center gap-3"
            >
                Ver en el Mapa <MapIcon size={18} />
            </button>
            <button 
                onClick={onClose}
                className="text-[10px] font-bold text-primary/40 uppercase tracking-widest"
            >
                Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[700] flex flex-col bg-[#FDFCF8] animate-fade-in overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 opacity-40" style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(252, 231, 243, 0.6) 0, transparent 70%),
            radial-gradient(at 100% 100%, rgba(243, 232, 255, 0.5) 0, transparent 70%),
            radial-gradient(at 50% 50%, rgba(220, 252, 231, 0.3) 0, transparent 70%)
          `
      }} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="p-8 pt-12 pb-6 flex items-center justify-between border-b border-black/5">
            <div>
                <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">Lanzar Evento</span>
                <h2 className="text-2xl font-serif font-bold text-primary tracking-tight mt-1">Paso {step} de 6</h2>
            </div>
            <button onClick={onClose} className="p-3 bg-white/60 backdrop-blur-md rounded-2xl text-primary/40 border border-white/40 shadow-sm active:scale-95 transition-all"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8">
            <div className="max-w-md mx-auto w-full">
                {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Nombre del Evento</label>
                        <div className="relative">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                            <input 
                                type="text" 
                                className="w-full pl-12 pr-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none focus:border-primary/20"
                                placeholder="Ej: Velvet Jazz Night"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Categoría</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setFormData({...formData, category: cat})}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${formData.category === cat ? 'bg-primary text-white border-primary shadow-glow-sunset' : 'bg-white/40 text-primary/40 border-white/40'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Ubicación Real</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                            <input 
                                ref={addressInputRef}
                                type="text" 
                                className="w-full pl-12 pr-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none"
                                placeholder="Escribe dirección o local..."
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Descripción</label>
                        <textarea 
                            className="w-full p-6 bg-white/40 backdrop-blur-md rounded-3xl border border-white/40 text-sm font-bold italic outline-none h-24"
                            placeholder="Describe el ambiente..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Fecha del Evento</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                            <input 
                                type="date" 
                                className="w-full pl-12 pr-4 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none" 
                                value={formData.date} 
                                onChange={e => setFormData({...formData, date: e.target.value})} 
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Horario</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                                <input type="time" className="w-full pl-12 pr-4 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Precio (€)</label>
                            <input 
                                type="number" 
                                className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none" 
                                placeholder="0 = Gratis"
                                value={formData.price} 
                                onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} 
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Filtros de Grupo</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 text-left">
                                <label className="text-[9px] font-bold text-primary/30 uppercase tracking-widest ml-1">Mín. Personas</label>
                                <input 
                                    type="number" 
                                    className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none" 
                                    value={formData.minGroupSize} 
                                    onChange={e => setFormData({...formData, minGroupSize: parseInt(e.target.value) || 1})} 
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-[9px] font-bold text-primary/30 uppercase tracking-widest ml-1">Máx. Personas</label>
                                <input 
                                    type="number" 
                                    className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none" 
                                    value={formData.maxGroupSize} 
                                    onChange={e => setFormData({...formData, maxGroupSize: parseInt(e.target.value) || 1})} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Aforo Total</label>
                        <input 
                            type="number" 
                            className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none" 
                            value={formData.capacity} 
                            onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 1})} 
                        />
                    </div>
                </div>
            )}

            {step === 5 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Tag Creatives & Contributors</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                                <input 
                                    type="text" 
                                    className="w-full pl-12 pr-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none focus:border-primary/20"
                                    placeholder="Search by username..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    if (!searchQuery) return;
                                    const newCollab: EventCollaborator = {
                                        id: `collab-${Date.now()}`,
                                        name: searchQuery,
                                        role: selectedRole,
                                        avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${searchQuery}`,
                                        eventsCount: Math.floor(Math.random() * 20),
                                        followersCount: Math.floor(Math.random() * 1000),
                                        collaborationsCount: Math.floor(Math.random() * 10)
                                    };
                                    setFormData({
                                        ...formData,
                                        collaborators: [...formData.collaborators, newCollab]
                                    });
                                    setSearchQuery('');
                                }}
                                className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-glow-sunset active:scale-95 transition-all"
                            >
                                <UserPlus size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Assign Role</label>
                        <div className="flex flex-wrap gap-2">
                            {CONTRIBUTOR_ROLES.map(role => (
                                <button 
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${selectedRole === role ? 'bg-primary text-white border-primary' : 'bg-white/40 text-primary/40 border-white/40'}`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 mt-8">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Tagged ({formData.collaborators.length})</label>
                        <div className="space-y-3">
                            {formData.collaborators.map(collab => (
                                <div key={collab.id} className="flex items-center gap-4 p-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 animate-scale-in">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-black/5 bg-white">
                                        <img src={collab.avatarUrl} className="w-full h-full object-cover" alt={collab.name} referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-primary leading-none">{collab.name}</p>
                                        <p className="text-[8px] font-bold text-primary/30 uppercase tracking-widest mt-1">{collab.role}</p>
                                    </div>
                                    <button 
                                        onClick={() => setFormData({
                                            ...formData,
                                            collaborators: formData.collaborators.filter(c => c.id !== collab.id)
                                        })}
                                        className="p-2 text-rose-500/40 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {formData.collaborators.length === 0 && (
                                <div className="py-8 text-center border-2 border-dashed border-primary/5 rounded-3xl">
                                    <p className="text-[10px] font-bold text-primary/20 uppercase tracking-widest">No contributors tagged yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {step === 6 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 gap-4">
                        <label className="w-full aspect-video bg-primary/5 border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer group transition-all">
                            <div className="w-12 h-12 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform border border-white/40"><Video size={20}/></div>
                            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Video del Ambiente</span>
                            <input type="file" className="hidden" accept="video/*" onChange={e => setFormData({...formData, videoFile: e.target.files?.[0] || null})} />
                        </label>
                        <label className="w-full aspect-video bg-primary/5 border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer group transition-all">
                            <div className="w-12 h-12 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform border border-white/40"><Sparkles size={20}/></div>
                            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Imagen de Portada</span>
                            <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({...formData, imageFile: e.target.files?.[0] || null})} />
                        </label>
                    </div>
                    <div className="flex flex-col gap-1">
                        {formData.videoFile && <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Video: {formData.videoFile.name}</span>}
                        {formData.imageFile && <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Imagen: {formData.imageFile.name}</span>}
                    </div>
                </div>
            )}
            </div>
        </div>

        <div className="p-8 pb-12 border-t border-black/5 bg-white/20 backdrop-blur-md">
            <div className="max-w-md mx-auto w-full flex gap-3">
                {step > 1 && (
                    <button 
                        onClick={() => setStep(step - 1)}
                        className="flex-1 py-5 bg-white/60 text-primary/40 border border-white/40 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all"
                    >
                        Atrás
                    </button>
                )}
                <button 
                    onClick={handleNext}
                    className="flex-[2] py-5 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-glow-sunset active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {step === 6 ? 'Publicar Ahora' : 'Siguiente'}
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
