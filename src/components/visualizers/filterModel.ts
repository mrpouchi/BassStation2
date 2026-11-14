import { cutoffHz, resonanceQ } from '@/engine/visuals/calibration';
import type { FilterModel, FilterShape } from '@/engine/visuals/filter';
import { num, str } from '@/hooks/useSynthValues';

export function modelFromValues(v: Readonly<Record<string, unknown>>): FilterModel {
  const acid = v['filter.type'] === 'acid';
  return {
    cutoffHz: cutoffHz(num(v['filter.frequency'] as number, 255)),
    q: resonanceQ(num(v['filter.resonance'] as number)),
    // Acid = fixed 4-pole low-pass; Shape and Slope inoperative (p. 39).
    shape: acid ? 'lp' : (str(v['filter.shape'] as string, 'lp') as FilterShape),
    poles: acid || v['filter.slope'] === '24' ? 4 : 2,
  };
}
