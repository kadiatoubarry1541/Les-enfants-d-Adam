import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface ProAccount {
  id: string;
  type: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  services: string[];
  specialties: string[];
  status: string;
  ownerNumeroH: string;
}

interface Appointment {
  id: string;
  patientNumeroH: string;
  patientName: string;
  type: "written" | "video";
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  videoUrl: string | null;
  status: string;
  responseMessage: string | null;
  responseVideoUrl: string | null;
  created_at: string;
}

const TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  clinic: { label: "Clinique / Hôpital", icon: "🏥" },
  security_agency: { label: "Agence de sécurité", icon: "🛡️" },
  journalist: { label: "Journaliste", icon: "📰" },
  enterprise: { label: "Entreprise", icon: "🏢" },
  school: { label: "École / Professeur", icon: "🎓" },
  supplier: { label: "Fournisseur", icon: "📦" },
};

export default function EspacePro() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<ProAccount | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<"rdv" | "info">("rdv");
  const [loading, setLoading] = useState(true);
  const [responseVideoId, setResponseVideoId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => { loadAccount(); }, [id]);

  const loadAccount = async () => {
    try {
      const res = await fetch(`http://localhost:5002/api/professionals/detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAccount(data.account);
        loadAppointments(data.account.id);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async (proId: string) => {
    try {
      const res = await fetch(`http://localhost:5002/api/appointments/professional/${proId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Erreur RDV:", error);
    }
  };

  const handleAccept = async (aptId: string, withVideo = false) => {
    if (withVideo) {
      setResponseVideoId(aptId);
      startVideoRecording();
      return;
    }
    try {
      const res = await fetch(`http://localhost:5002/api/appointments/accept/${aptId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ responseMessage: "Rendez-vous confirmé" })
      });
      const data = await res.json();
      if (data.success && account) loadAppointments(account.id);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleReject = async (aptId: string) => {
    try {
      const res = await fetch(`http://localhost:5002/api/appointments/reject/${aptId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ responseMessage: "Rendez-vous refusé" })
      });
      const data = await res.json();
      if (data.success && account) loadAppointments(account.id);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // === Enregistrement vidéo 30 secondes ===
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setRecording(false);
        // Convertir en base64 et envoyer
        const reader = new FileReader();
        reader.onloadend = async () => {
          if (responseVideoId) {
            await fetch(`http://localhost:5002/api/appointments/accept/${responseVideoId}`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({ responseVideoUrl: reader.result, responseMessage: "Réponse vidéo" })
            });
            if (account) loadAppointments(account.id);
            setResponseVideoId(null);
            setRecordedVideoUrl(null);
          }
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      setRecording(true);
      setCountdown(30);
      const interval = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            recorder.stop();
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Erreur caméra:", error);
      alert("Impossible d'accéder à la caméra");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="text-gray-500">Chargement...</div></div>;
  if (!account) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="text-red-500">Compte non trouvé</div></div>;

  const typeInfo = TYPE_LABELS[account.type] || { label: account.type, icon: "📄" };
  const pendingApts = appointments.filter(a => a.status === "pending");
  const handledApts = appointments.filter(a => a.status !== "pending");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/compte")} className="min-h-[44px] px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition-colors">
            ← Retour
          </button>
          <span className="text-3xl">{typeInfo.icon}</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{account.name}</h1>
            <p className="text-sm text-gray-500">{typeInfo.label} • {account.city}</p>
          </div>
        </div>

        {/* Modal vidéo */}
        {responseVideoId && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                {recording ? `Enregistrement... ${countdown}s` : "Vidéo envoyée !"}
              </h3>
              <video ref={videoRef} className="w-full rounded-lg bg-black mb-4" muted playsInline />
              {!recording && (
                <button onClick={() => { setResponseVideoId(null); setRecordedVideoUrl(null); }}
                  className="w-full min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                  Fermer
                </button>
              )}
            </div>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("rdv")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] ${tab === "rdv" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>
            Rendez-vous {pendingApts.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingApts.length}</span>}
          </button>
          <button onClick={() => setTab("info")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] ${tab === "info" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}>
            Informations
          </button>
        </div>

        {tab === "rdv" ? (
          <div>
            {/* Rendez-vous en attente */}
            {pendingApts.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">En attente ({pendingApts.length})</h2>
                <div className="space-y-3">
                  {pendingApts.map((apt) => (
                    <div key={apt.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm ring-1 ring-orange-200 dark:ring-orange-800 p-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 dark:text-gray-100">{apt.patientName}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {apt.type === "video" ? (
                              <span className="text-purple-600 font-medium">📹 Rendez-vous vidéo</span>
                            ) : (
                              <>📅 {apt.appointmentDate} à {apt.appointmentTime} • {apt.service}</>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">NuméroH: {apt.patientNumeroH} • {new Date(apt.created_at).toLocaleDateString("fr-FR")}</div>
                          {apt.type === "video" && apt.videoUrl && (
                            <video src={apt.videoUrl} controls className="mt-2 w-full max-w-sm rounded-lg" />
                          )}
                        </div>
                        <div className="flex flex-col gap-2 sm:self-center">
                          <button onClick={() => handleAccept(apt.id)}
                            className="min-h-[40px] px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">
                            ✅ Accepter
                          </button>
                          <button onClick={() => handleAccept(apt.id, true)}
                            className="min-h-[40px] px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">
                            📹 Accepter + Vidéo
                          </button>
                          <button onClick={() => handleReject(apt.id)}
                            className="min-h-[40px] px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
                            ❌ Refuser
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historique */}
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Historique</h2>
            {handledApts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Aucun rendez-vous traité</div>
            ) : (
              <div className="space-y-2">
                {handledApts.map((apt) => (
                  <div key={apt.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-3 flex items-center gap-3">
                    <span className={`text-lg ${apt.status === "accepted" ? "text-green-500" : "text-red-500"}`}>
                      {apt.status === "accepted" ? "✅" : "❌"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{apt.patientName}</div>
                      <div className="text-xs text-gray-500">{apt.appointmentDate} {apt.appointmentTime} • {apt.service}</div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${apt.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {apt.status === "accepted" ? "Accepté" : "Refusé"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Onglet Informations */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><span className="text-sm text-gray-500">Adresse</span><p className="font-medium text-gray-900 dark:text-gray-100">{account.address || "Non renseigné"}</p></div>
              <div><span className="text-sm text-gray-500">Ville</span><p className="font-medium text-gray-900 dark:text-gray-100">{account.city || "Non renseigné"}</p></div>
              <div><span className="text-sm text-gray-500">Pays</span><p className="font-medium text-gray-900 dark:text-gray-100">{account.country || "Non renseigné"}</p></div>
              <div><span className="text-sm text-gray-500">Téléphone</span><p className="font-medium text-gray-900 dark:text-gray-100">{account.phone || "Non renseigné"}</p></div>
              <div><span className="text-sm text-gray-500">Email</span><p className="font-medium text-gray-900 dark:text-gray-100">{account.email || "Non renseigné"}</p></div>
              <div className="sm:col-span-2"><span className="text-sm text-gray-500">Description</span><p className="font-medium text-gray-900 dark:text-gray-100">{account.description || "Non renseigné"}</p></div>
              {account.services?.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-sm text-gray-500">Services</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {account.services.map((s, i) => <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">{s}</span>)}
                  </div>
                </div>
              )}
              {account.specialties?.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-sm text-gray-500">Spécialités</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {account.specialties.map((s, i) => <span key={i} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
