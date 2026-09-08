import type { Equipment } from '@/lib/incident_engine'
export function filterEquipment(equipment:Equipment[],query:string){const q=query.toLowerCase();if(!q)return [];if(q.includes('router'))return equipment.filter(e=>e.tipo==='router');if(q.includes('olt'))return equipment.filter(e=>e.tipo==='olt');return equipment.filter(e=>`${e.nombre} ${e.ip} ${e.tipo}`.toLowerCase().includes(q))}
