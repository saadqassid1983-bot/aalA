import React, { useState } from 'react';
import { ComedyScript } from '../types/comedy';
import { X, Download, FileText, Youtube, Check, Copy, Film, Sparkles } from 'lucide-react';

interface VideoRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ComedyScript;
}

export const VideoRecorderModal: React.FC<VideoRecorderModalProps> = ({
  isOpen,
  onClose,
  script,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate YouTube chapters format (00:00 ...)
  const generateYoutubeChapters = () => {
    let out = `${script.title} - Vidéo Comique (5 minutes)\n${script.synopsis}\n\n📍 CHAPITRES & TIMESTAMPS :\n`;
    script.scenes.forEach((s) => {
      const m = Math.floor(s.startTime / 60);
      const sec = (s.startTime % 60).toString().padStart(2, '0');
      out += `${m.toString().padStart(2, '0')}:${sec} - ${s.title.replace(/^Scène \d+ : /, '')}\n`;
    });
    out += `\n🎭 Acteurs / Personnages :\n`;
    script.characters.forEach((c) => {
      out += `- ${c.name} : ${c.role}\n`;
    });
    out += `\n#Humour #Sketch #Comédie #Funny #ShortFilm #Comedy5Min`;
    return out;
  };

  // Generate complete formatted screenplay text
  const generateFormattedScreenplay = () => {
    let out = `=========================================================\n`;
    out += `TITRE : ${script.title.toUpperCase()}\n`;
    out += `GENRE : ${script.genre} | DURÉE : ~5 MINUTES (300 SECONDES)\n`;
    out += `PITCH : ${script.tagline}\n`;
    out += `=========================================================\n\n`;

    out += `PERSONNAGES :\n`;
    script.characters.forEach((c) => {
      out += `• ${c.name.toUpperCase()} : ${c.role} (Gimmick: "${c.catchphrase || 'N/A'}")\n`;
    });
    out += `\n---------------------------------------------------------\n\n`;

    script.scenes.forEach((s) => {
      const m = Math.floor(s.startTime / 60);
      const sec = (s.startTime % 60).toString().padStart(2, '0');
      out += `[${m.toString().padStart(2, '0')}:${sec}] ${s.title.toUpperCase()} - DÉCOR : ${s.location.toUpperCase()}\n`;
      if (s.visualGag) {
        out += `ACTION VISUELLE : ${s.visualGag}\n`;
      }
      out += `\n`;
      s.dialogues.forEach((d) => {
        out += `  ${d.speaker.toUpperCase()}`;
        if (d.actorDirection) out += ` ${d.actorDirection}`;
        if (d.soundFx) out += ` [FX: ${d.soundFx}]`;
        out += `\n`;
        out += `  "${d.text}"\n\n`;
      });
      out += `---------------------------------------------------------\n\n`;
    });

    out += `FIN DE LA VIDÉO (05:00)\n`;
    return out;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Export & Production de la Vidéo 5 Min
              </h3>
              <p className="text-xs text-slate-400">
                Téléchargez le scénario, les chapitres YouTube ou le dossier de tournage.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Card 1: Screenplay PDF / Text export */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Scénario Complet & Didascalies (Format Réalisateur)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                Structure 5:00 Prête
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Téléchargez le texte complet du sketch avec tous les repères de temps, indications
              d'acteurs, expressions faciales et bruitages comiques.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  downloadTextFile(
                    generateFormattedScreenplay(),
                    `${script.title.toLowerCase().replace(/\s+/g, '_')}_scenario_5min.txt`
                  )
                }
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger Scénario (.txt)</span>
              </button>

              <button
                onClick={() => copyToClipboard(generateFormattedScreenplay(), 'screenplay')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
              >
                {copiedType === 'screenplay' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier Tout</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: YouTube & Social Timestamps */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Description & Chapitres YouTube / Réseaux Sociaux
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Timestamps 00:00</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
              {generateYoutubeChapters()}
            </div>

            <div>
              <button
                onClick={() => copyToClipboard(generateYoutubeChapters(), 'youtube')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                {copiedType === 'youtube' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Description Copiée !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier pour Description YouTube / TikTok</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 3: Live Video Rehearsal & Capture Advice */}
          <div className="bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-800/60 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-black text-white">Astuce de Réalisation pour YouTube & TikTok :</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Utilisez l'onglet <strong className="text-amber-400">Prompteur & Répétition</strong> pour
                vous enregistrer face caméra avec la minuterie de 5 minutes et activer les bruitages
                instantanés (Ba-Dum Tss, Malaise, Boing) au moment exact de vos punchlines !
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
