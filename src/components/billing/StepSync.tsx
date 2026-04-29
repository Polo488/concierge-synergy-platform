import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, RefreshCw, FileUp, X, CheckCircle2, ArrowRight } from "lucide-react";
import { useSession } from "@/hooks/useFacturationSession";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function StepSync() {
  const { beds24SyncedAt, setBeds24SyncedAt, csvFiles, addCsv, removeCsv, syncDone, setSyncDone, setActiveStep } = useSession();
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const launchSync = async () => {
    setSyncing(true);
    const steps = ["Récupération des réservations…", "Analyse des invoiceItems…", "Liaison avec les logements…"];
    for (let i = 0; i < steps.length; i++) {
      setProgressLabel(steps[i]);
      for (let p = 0; p <= 100; p += 4) {
        setProgress(((i * 100 + p) / steps.length));
        await new Promise(r => setTimeout(r, 18));
      }
    }
    setBeds24SyncedAt(new Date().toISOString());
    setSyncing(false);
    setProgress(0);
    toast.success("Sync Noé API terminée — 78 réservations sur 41 logements");
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(f => {
      const lower = f.name.toLowerCase();
      const type: "booking" | "airbnb" | null = lower.includes("airbnb") ? "airbnb" : lower.includes("booking") ? "booking" : null;
      if (!type) {
        toast.error(`${f.name} : format non reconnu`);
        return;
      }
      addCsv({ name: f.name, rows: type === "airbnb" ? 31 : 47, type });
    });
  }, [addCsv]);

  const canContinue = (beds24SyncedAt || csvFiles.length > 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {/* Noé API */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="rounded-[20px] bg-white/[0.03] backdrop-blur-xl ring-1 ring-inset ring-white/[0.06] p-7 md:p-8 min-h-[280px] flex flex-col"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-[#6B7AE8]/15 flex items-center justify-center">
              <Cloud className="h-5 w-5 text-[#6B7AE8]" strokeWidth={1.6} />
            </div>
            <h3 className="text-[17px] font-semibold text-white">Noé API</h3>
          </div>
          <p className="text-[13.5px] text-white/55 mt-1 flex-1">
            Synchronisation automatique des réservations depuis ton compte Noé API.
          </p>

          {syncing ? (
            <div className="mt-5 space-y-2">
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full bg-[#FF5C1A]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <p className="text-[12px] text-white/55 tabular-nums">{progressLabel}</p>
            </div>
          ) : (
            <button
              onClick={launchSync}
              className="mt-5 w-full px-4 py-3 rounded-[12px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[14px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(255,92,26,0.30)]"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={1.8} />
              Synchroniser
            </button>
          )}

          <p className="mt-3 text-[11.5px] text-white/40">
            {beds24SyncedAt ? `Dernière sync : il y a 1h • 78 réservations sur 41 logements` : "Aucune synchronisation pour cette période"}
          </p>
        </motion.div>

        {/* CSV */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-[20px] bg-white/[0.03] backdrop-blur-xl ring-1 ring-inset ring-white/[0.06] p-7 md:p-8 min-h-[280px] flex flex-col"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-[#FF5C1A]/15 flex items-center justify-center">
              <FileUp className="h-5 w-5 text-[#FF5C1A]" strokeWidth={1.6} />
            </div>
            <h3 className="text-[17px] font-semibold text-white">Import CSV</h3>
          </div>
          <p className="text-[13.5px] text-white/55 mt-1">
            Glisse tes exports Booking ou Airbnb pour compléter les données API.
          </p>

          <button
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
            className={cn(
              "mt-5 rounded-[14px] border-2 border-dashed py-7 px-4 flex flex-col items-center justify-center gap-1.5 transition-all",
              drag ? "border-[#FF5C1A] bg-[#FF5C1A]/5" : "border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.04]"
            )}
          >
            <FileUp className="h-5 w-5 text-white/40 mb-1" strokeWidth={1.5} />
            <p className="text-[13px] text-white/65">Glissez vos fichiers ici</p>
            <p className="text-[11.5px] text-white/40">ou cliquez pour parcourir</p>
          </button>
          <input ref={inputRef} type="file" multiple accept=".csv" className="hidden" onChange={e => handleFiles(e.target.files)} />

          {csvFiles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {csvFiles.map(f => (
                <span key={f.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4ADE80]/10 text-[#4ADE80] text-[11px] font-medium">
                  <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                  {f.name} • {f.rows} lignes
                  <button onClick={() => removeCsv(f.name)} className="hover:opacity-70">
                    <X className="h-2.5 w-2.5" strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {canContinue && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center justify-between gap-4 rounded-[16px] bg-white/[0.025] ring-1 ring-inset ring-white/[0.06] px-5 py-4"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#4ADE80]" strokeWidth={2} />
              <p className="text-[13.5px] text-white/85">78 réservations sur 41 logements pour Mars 2026</p>
            </div>
            <button
              onClick={() => { setSyncDone(true); setActiveStep("ba"); toast.success("Étape Synchronisation validée"); }}
              className="px-4 py-2 rounded-[10px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[13px] font-semibold flex items-center gap-1.5 transition-all active:scale-[0.98]"
            >
              Continuer vers les BA
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
