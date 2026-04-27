import { useEffect, useState } from "react";

export interface ProgressTask {
  id: string;
  label: string;
  /** Optional progress 0..1, undefined = indeterminate */
  progress?: number;
  /** Optional sub-label (e.g. "12/40 logements") */
  detail?: string;
  /** Status */
  status: "running" | "success" | "error";
  successTimeout?: number;
  onClick?: () => void;
}

type Listener = (tasks: ProgressTask[]) => void;

let tasks: ProgressTask[] = [];
const listeners = new Set<Listener>();
let counter = 0;

const emit = () => {
  // shallow-copy to trigger re-renders
  const snap = [...tasks];
  listeners.forEach((l) => l(snap));
};

const nextId = () => `pt-${Date.now()}-${++counter}`;

export const progressTasks = {
  start(task: Omit<ProgressTask, "status" | "id"> & { id?: string; status?: ProgressTask["status"] }): string {
    const id = task.id ?? nextId();
    tasks = [...tasks.filter((t) => t.id !== id), { ...task, id, status: task.status ?? "running" }];
    emit();
    return id;
  },
  update(id: string, patch: Partial<ProgressTask>) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
    emit();
  },
  succeed(id: string, label?: string) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    progressTasks.update(id, { status: "success", ...(label ? { label } : {}) });
    setTimeout(() => progressTasks.dismiss(id), t.successTimeout ?? 1500);
  },
  fail(id: string, label?: string) {
    progressTasks.update(id, { status: "error", ...(label ? { label } : {}) });
    setTimeout(() => progressTasks.dismiss(id), 4000);
  },
  dismiss(id: string) {
    tasks = tasks.filter((t) => t.id !== id);
    emit();
  },
};

export function useProgressTasks(): ProgressTask[] {
  const [snapshot, setSnapshot] = useState<ProgressTask[]>(tasks);
  useEffect(() => {
    listeners.add(setSnapshot);
    return () => {
      listeners.delete(setSnapshot);
    };
  }, []);
  return snapshot;
}
