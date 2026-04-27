import { create } from "zustand";

export interface ProgressTask {
  id: string;
  label: string;
  /** Optional progress 0..1, undefined = indeterminate */
  progress?: number;
  /** Optional sub-label (e.g. "12/40 logements") */
  detail?: string;
  /** Status — "running" | "success" | "error" */
  status: "running" | "success" | "error";
  /** Auto-dismiss after success (ms). Default 1500 */
  successTimeout?: number;
  /** Optional onClick — e.g. expand details */
  onClick?: () => void;
}

interface Store {
  tasks: ProgressTask[];
  start: (task: Omit<ProgressTask, "status"> & { status?: ProgressTask["status"] }) => string;
  update: (id: string, patch: Partial<ProgressTask>) => void;
  succeed: (id: string, label?: string) => void;
  fail: (id: string, label?: string) => void;
  dismiss: (id: string) => void;
}

let counter = 0;
const nextId = () => `pt-${Date.now()}-${++counter}`;

export const useProgressTasks = create<Store>((set, get) => ({
  tasks: [],
  start: (task) => {
    const id = task.id ?? nextId();
    set((s) => ({
      tasks: [...s.tasks.filter((t) => t.id !== id), { ...task, id, status: task.status ?? "running" }],
    }));
    return id;
  },
  update: (id, patch) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
  succeed: (id, label) => {
    get().update(id, { status: "success", ...(label ? { label } : {}) });
    const timeout = get().tasks.find((t) => t.id === id)?.successTimeout ?? 1500;
    setTimeout(() => get().dismiss(id), timeout);
  },
  fail: (id, label) => {
    get().update(id, { status: "error", ...(label ? { label } : {}) });
    setTimeout(() => get().dismiss(id), 4000);
  },
  dismiss: (id) =>
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
    })),
}));
