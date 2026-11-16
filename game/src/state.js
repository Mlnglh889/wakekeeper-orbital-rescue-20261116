export const W=1280,H=720;
export const PLANET={x:640,y:376,r:112};
export const SECTORS=[
 {name:'The Blue Verge',subtitle:'A quiet orbit. Three signals waiting.',pods:[[340,536],[270,310],[880,240]],rocks:[[930,495,29],[420,210,23]],time:300},
 {name:'Cinder Meridian',subtitle:'Moving debris. Take the long way home.',pods:[[350,490],[260,240],[740,160],[1000,430]],rocks:[[455,450,25],[900,300,34],[370,180,24]],time:165},
 {name:'The Quiet Maw',subtitle:'A stronger gravity well. Mind your approach.',pods:[[450,570],[220,390],[400,160],[860,180],[1040,520]],rocks:[[320,280,30],[960,440,35],[770,550,22],[930,140,23]],time:190},
 {name:'Dawn Relay',subtitle:'One final passage. Bring everyone home.',pods:[[450,560],[230,480],[250,200],[650,150],[980,250],[980,530]],rocks:[[360,400,30],[470,210,29],[860,410,34],[1070,380,22]],time:220}
];
export function freshRun(){return{screen:'title',sector:1,score:0,rescued:0,delivered:0,total:0,fuel:100,hull:4,maxHull:4,cargo:0,capacity:3,engine:1,magnet:38,elapsed:0,sectorTime:0,invincible:0,particles:[],trail:[],message:'',messageTime:0,pilot:{x:640,y:604,vx:0,vy:0,angle:-Math.PI/2},beacons:[],hazards:[],stars:seedStars(145),stats:{burn:0,damage:0,slings:0},sound:true,paused:false,gravityAssist:false}}
export function seedStars(n){let a=[];for(let i=0;i<n;i++)a.push({x:(i*277+71)%W,y:(i*149+19)%H,r:.5+(i%3)/2,a:.2+(i%5)/10});return a}
export function sectorData(s){return SECTORS[s-1]}
export function makeSector(run){let d=sectorData(run.sector);run.fuel=100;run.cargo=0;run.sectorTime=d.time;run.pilot={x:640,y:604,vx:0,vy:0,angle:-Math.PI/2};run.beacons=d.pods.map(([x,y],i)=>({x,y,r:12,phase:i*.7,rescued:false}));run.hazards=d.rocks.map(([x,y,r],i)=>({x,y,homeX:x,homeY:y,r,phase:i*1.8,orbit:run.sector>1?16+run.sector*5:0}));run.trail=[];run.particles=[];run.invincible=2;run.delivered=0;run.total=d.pods.length;run.message=d.subtitle;run.messageTime=5;return run}
export const UPGRADES=[{name:'Ion sail',desc:'30% stronger thrust; better fuel efficiency.',apply:r=>{r.engine*=1.3}}, {name:'Rescue cradle',desc:'Carry +2 passengers; wider rescue field.',apply:r=>{r.capacity+=2;r.magnet+=14}}, {name:'Hull weave',desc:'Repair all damage and add one armor layer.',apply:r=>{r.maxHull++;r.hull=r.maxHull}}];
export function nextSector(run){run.sector++;run.screen='upgrade'}
