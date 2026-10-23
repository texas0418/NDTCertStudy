// lib/bundles.ts
//
// Method bundles: one product that grants Level I and Level II of a method
// within one scheme, e.g. ASNT MT I + ASNT MT II in a single purchase. The
// rest of the app keeps thinking in module ids; this is the only place a
// bundle product is expanded into the modules it grants, so the store, the
// shelf and the session screens never learn that bundles exist.
//
// Product ids follow `unlock_<scheme>_<method>_bundle`, e.g.
// unlock_asnt_mt_bundle. UT (conventional) and PAUT are separate bundles
// because they are separate tickets in the field.
import { MODULES, type ModuleDef, type SchemeId } from "./bank";

export interface BundleDef {
  id: string; // `${scheme}-${method}-bundle`: module-id shaped, never a module
  productId: string; // unlock_<scheme>_<method>_bundle
  scheme: SchemeId;
  method: string; // "MT" | "PT" | "RT" | "UT" | "PAUT"
  title: string; // "MT Levels I and II"
  subtitle: string; // "Magnetic Particle"
  moduleIds: string[]; // the modules this bundle unlocks, Level I first
}

const BUNDLE_SUFFIX = "_bundle";

export const BUNDLES: BundleDef[] = (() => {
  const groups = new Map<string, ModuleDef[]>();
  for (const m of MODULES) {
    const key = `${m.scheme}-${m.method.toLowerCase()}`;
    groups.set(key, [...(groups.get(key) ?? []), m]);
  }
  const out: BundleDef[] = [];
  for (const [key, mods] of groups) {
    // A bundle only makes sense where there is more than one level to bundle.
    if (mods.length < 2) continue;
    const method = mods[0].method;
    out.push({
      id: `${key}-bundle`,
      productId: `unlock_${mods[0].scheme}_${method.toLowerCase()}${BUNDLE_SUFFIX}`,
      scheme: mods[0].scheme,
      method,
      title: `${method} Levels I and II`,
      subtitle: mods[0].subtitle,
      moduleIds: mods.map((m) => m.id),
    });
  }
  return out;
})();

export function isBundleProduct(productId: string): boolean {
  return productId.endsWith(BUNDLE_SUFFIX);
}

export function bundleForProduct(productId: string): BundleDef | undefined {
  return BUNDLES.find((b) => b.productId === productId);
}

// The bundle that would unlock this module, if one exists.
export function bundleForModule(moduleId: string): BundleDef | undefined {
  return BUNDLES.find((b) => b.moduleIds.includes(moduleId));
}
