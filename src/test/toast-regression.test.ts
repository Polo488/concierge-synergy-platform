/**
 * Régression toasts — vérifie que :
 *  1. Les durées standardisées sont appliquées par variante
 *  2. Le wrapper appelle sonner avec la bonne signature
 *  3. Le catalogue de libellés est complet pour chaque module ciblé
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock sonner AVANT d'importer notre wrapper
vi.mock("sonner", () => {
  const calls: Array<{ method: string; message: string; opts?: any }> = [];
  const make = (method: string) =>
    vi.fn((message: string, opts?: any) => {
      calls.push({ method, message, opts });
    });
  const toast: any = make("default");
  toast.success = make("success");
  toast.error = make("error");
  toast.warning = make("warning");
  toast.info = make("info");
  toast.loading = make("loading");
  toast.message = make("message");
  toast.promise = vi.fn();
  toast.dismiss = vi.fn();
  toast.custom = vi.fn();
  return { toast, __calls: calls, Toaster: () => null };
});

import { toast, TOAST_DURATIONS } from "@/lib/toast";
import { TOAST_MESSAGES as M } from "@/lib/toastMessages";
import * as sonnerMock from "sonner";

const getCalls = () => (sonnerMock as any).__calls as Array<{
  method: string;
  message: string;
  opts?: any;
}>;

beforeEach(() => {
  getCalls().length = 0;
});

describe("toast wrapper — durées standardisées", () => {
  it("success → 3500ms", () => {
    toast.success("ok");
    const call = getCalls().at(-1)!;
    expect(call.method).toBe("success");
    expect(call.opts?.duration).toBe(TOAST_DURATIONS.success);
    expect(TOAST_DURATIONS.success).toBe(3500);
  });

  it("error → 5500ms", () => {
    toast.error("boom");
    const call = getCalls().at(-1)!;
    expect(call.method).toBe("error");
    expect(call.opts?.duration).toBe(TOAST_DURATIONS.error);
    expect(TOAST_DURATIONS.error).toBe(5500);
  });

  it("warning → 4500ms", () => {
    toast.warning("attention");
    expect(getCalls().at(-1)!.opts?.duration).toBe(4500);
  });

  it("info → 3500ms", () => {
    toast.info("note");
    expect(getCalls().at(-1)!.opts?.duration).toBe(3500);
  });

  it("override custom duration is preserved", () => {
    toast.success("custom", { duration: 9999 });
    expect(getCalls().at(-1)!.opts?.duration).toBe(9999);
  });

  it("loading → Infinity (jusqu'à dismiss explicite)", () => {
    toast.loading("...");
    expect(getCalls().at(-1)!.opts?.duration).toBe(Infinity);
  });

  it("description (sous-titre) est transmise telle quelle", () => {
    toast.success("Titre", { description: "Détail" });
    expect(getCalls().at(-1)!.opts?.description).toBe("Détail");
  });
});

describe("Catalogue de libellés (TOAST_MESSAGES) — couverture par module", () => {
  it("Entrepôt expose les libellés de stock + articles + lien", () => {
    expect(M.inventory.stockUpdated(3, true)).toMatch(/augmenté de 3 unités/);
    expect(M.inventory.stockUpdated(1, false)).toMatch(/diminué de 1 unité$/);
    expect(M.inventory.itemAdded("Savon")).toContain("Savon");
    expect(typeof M.inventory.orderLinkUpdated).toBe("string");
    expect(typeof M.inventory.orderLinkMissing).toBe("string");
  });

  it("Maintenance expose création/assignation/clôture + technicianRequired", () => {
    expect(M.maintenance.interventionCreated).toBeTruthy();
    expect(M.maintenance.interventionScheduled("2026-05-01")).toContain("2026-05-01");
    expect(M.maintenance.interventionAssigned("Paul")).toContain("Paul");
    expect(M.maintenance.interventionAssigned("Paul", "2026-05-01")).toContain("2026-05-01");
    expect(M.maintenance.interventionCompleted).toBeTruthy();
    expect(M.maintenance.technicianRequired).toBeTruthy();
    expect(M.maintenance.exportStarted).toBeTruthy();
    expect(M.maintenance.calendarSynced).toBeTruthy();
  });

  it("Ménage expose problème/résolution/repasse", () => {
    expect(M.cleaning.issueReported).toBeTruthy();
    expect(M.cleaning.issueResolved).toBeTruthy();
    expect(M.cleaning.repassScheduled).toBeTruthy();
    expect(M.cleaning.cleaningCompleted).toBeTruthy();
    expect(M.cleaning.cleaningAssigned("Marie")).toContain("Marie");
  });

  it("Logements expose CRUD basique", () => {
    expect(M.properties.created).toBeTruthy();
    expect(M.properties.updated).toBeTruthy();
    expect(M.properties.deleted).toBeTruthy();
    expect(M.properties.detailsSaved).toBeTruthy();
  });

  it("Facturation expose import success/partial/error + datesRequired", () => {
    expect(M.billing.importSuccess(5)).toMatch(/5 réservations/);
    expect(M.billing.importSuccess(1)).toMatch(/1 réservation$/);
    expect(M.billing.importPartial(2)).toMatch(/2 entrées non assignées/);
    expect(M.billing.importError("timeout")).toContain("timeout");
    expect(M.billing.importError()).toBeTruthy();
    expect(M.billing.datesRequired).toBeTruthy();
  });

  it("Convention de style — pas de point final sur les libellés courts", () => {
    const samples = [
      M.maintenance.interventionCreated,
      M.maintenance.interventionCompleted,
      M.cleaning.issueResolved,
      M.cleaning.repassScheduled,
      M.properties.created,
      M.properties.updated,
      M.inventory.orderLinkUpdated,
    ];
    samples.forEach((s) => {
      expect(s.endsWith(".")).toBe(false);
    });
  });
});

describe("Bout-en-bout — un libellé du catalogue émis via le wrapper", () => {
  it("toast.success(M.inventory.itemAdded) → durée success + bon message", () => {
    toast.success(M.inventory.itemAdded("Drap blanc"));
    const call = getCalls().at(-1)!;
    expect(call.method).toBe("success");
    expect(call.message).toContain("Drap blanc");
    expect(call.opts?.duration).toBe(3500);
  });

  it("toast.error(M.maintenance.technicianRequired) → durée error", () => {
    toast.error(M.maintenance.technicianRequired);
    const call = getCalls().at(-1)!;
    expect(call.method).toBe("error");
    expect(call.opts?.duration).toBe(5500);
  });

  it("toast.warning(M.billing.importPartial) → durée warning", () => {
    toast.warning(M.billing.importPartial(3));
    const call = getCalls().at(-1)!;
    expect(call.method).toBe("warning");
    expect(call.opts?.duration).toBe(4500);
  });
});
