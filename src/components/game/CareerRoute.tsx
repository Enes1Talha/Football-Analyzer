import type {CareerStage} from '@/lib/career';
export default function CareerRoute({stages,total}:{stages:CareerStage[];total:number}) {
 return <ol aria-label="Kariyer rotası" className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
  {Array.from({length:total},(_,index)=>{const stage=stages[index];return <li key={index} className="flex flex-col sm:flex-row items-center gap-2">
   {index>0&&<span aria-hidden="true" className="text-neon-cyan"><span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span></span>}
   <div className={`w-full sm:w-36 min-h-20 rounded-xl border p-3 text-center ${stage?'border-neon-green/30 bg-neon-green/5':'border-dashed border-pitch-border bg-pitch-dark'}`}>
    <span className="block text-[10px] text-zinc-500 mb-1">{index+1}. kulüp dönemi</span><strong className={stage?'text-white':'text-zinc-500'}>{stage?.club||'?'}</strong>
    {stage&&<><span className="block text-xs text-zinc-400 mt-1">{stage.startYear}–{stage.endYear}</span>{stage.loan&&<span className="block text-xs text-neon-cyan">Kiralık</span>}</>}
   </div>
  </li>;})}
 </ol>;
}
