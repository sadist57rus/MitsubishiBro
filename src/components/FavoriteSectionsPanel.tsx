import { Star, Trash2, ArrowRight } from 'lucide-react';
import { TabId } from './Header';
export interface FavoriteSection { id: TabId; title: string; savedAt: number; }
interface Props { favorites: FavoriteSection[]; onNavigate: (tab: TabId) => void; onRemove: (tab: TabId) => void; }
export default function FavoriteSectionsPanel({ favorites, onNavigate, onRemove }: Props) {
  return <section className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-white dark:bg-slate-900 p-5 space-y-3">
    <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Star className="w-5 h-5 fill-amber-400 text-amber-500" /><h2 className="text-lg font-black">Избранное</h2></div><span className="text-xs text-slate-500">{favorites.length} разделов</span></div>
    {favorites.length === 0 ? <p className="text-sm text-slate-500">Здесь будут разделы, которые вы отметите кнопкой «Добавить в избранное».</p> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">{favorites.map(item => <div key={item.id} className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 p-3"><button onClick={() => onNavigate(item.id)} className="flex-1 min-w-0 text-left"><div className="font-bold text-sm truncate">{item.title}</div><div className="text-xs text-slate-500 flex items-center gap-1 mt-1">Открыть раздел <ArrowRight className="w-3 h-3" /></div></button><button onClick={() => onRemove(item.id)} aria-label="Убрать из избранного" title="Убрать из избранного" className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="w-4 h-4" /></button></div>)}</div>}
  </section>;
}
