import {
  AmountUnit,
  VolumeUnit,
  WeightUnit,
} from "monch-backend/build/types/unit";

// @@Todo: should be narrowed down by the unit type that is specified on the ingredient.
export const UNITS = [
  ...AmountUnit.options,
  ...WeightUnit.options,
  ...VolumeUnit.options,
] as const;
