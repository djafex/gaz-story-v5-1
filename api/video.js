export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST only"});
  if(!process.env.AGNES_API_KEY) return res.status(500).json({error:"AGNES_API_KEY is missing"});
  try{
    const b=req.body||{};
    const model=b.model||'agnes-video-2.5-flash';
    const seconds=String(Math.min(12,Math.max(4,Number(b.seconds||5))));
    const payload={model,prompt:String(b.prompt||''),mode:b.mode||'text',seconds,n:1};
    if(model==='agnes-video-2.5-flash') payload.size='720P';
    else if(b.size) payload.size=b.size;
    if(b.aspect_ratio) payload.aspect_ratio=b.aspect_ratio;
    if(b.first_frame) payload.first_frame=b.first_frame;
    if(b.last_frame) payload.last_frame=b.last_frame;
    if(Array.isArray(b.images)&&b.images.length) payload.images=b.images.slice(0,5);
    const r=await fetch('https://apihub.agnes-ai.com/v1/videos',{method:'POST',headers:{Authorization:`Bearer ${process.env.AGNES_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:data?.error?.message||data?.error||'Agnes video API error',raw:data});
    return res.status(200).json(data);
  }catch(e){return res.status(500).json({error:e.message});}
      }
