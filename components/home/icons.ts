import type { Icon } from "@phosphor-icons/react";
import { Barbell, Bed, BookOpen, Buildings, Calculator, Car, Coffee, Confetti, CurrencyInr, FileText, ForkKnife, GraduationCap, Pill, RocketLaunch, Scales, Scissors, Storefront, Toolbox, Tooth, Wrench } from "@phosphor-icons/react/dist/ssr";
import type { HomeIconKey } from "@/content/home";

/** Phosphor icons for the keys in content/home.ts (they replace the mock's Material Symbols). */
export const HOME_ICONS: Readonly<Record<HomeIconKey, Icon>> = {
  CurrencyInr, RocketLaunch, Wrench, FileText, Tooth, Scissors, ForkKnife, Barbell, GraduationCap, Storefront, Toolbox, Buildings,
  Bed, Coffee, Pill, BookOpen, Scales, Calculator, Car, Confetti,
};
