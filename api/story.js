export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST only"});
  if(!process.env.AGNES_API_KEY) return res.status(500).json({error:"AGNES_API_KEY is missing"});
  try{
    const {idea,format="Episode anime",style="Cinematic",duration=60,plans=10,characters=[]}=req.body||{};
    const system=`You are the story director for G@z Story Studio. Return ONLY valid JSON. Create a production bible and a storyboard. The final video is built from short AI video clips, so each plan must be visually concrete and independently generatable while preserving character identity. Use English for prompts. JSON shape: {title,logline,visualBible:{style,lighting,palette,camera,continuity},characters:[{name,description}],plans:[{number,title,durationSeconds,visualPrompt,negativePrompt,camera,action,dialogue,continuityNote}]}. Exactly ${plans} plans. Total target duration about ${duration} seconds. Never claim a single generation can create the whole duration.`;
    const user=`Idea: ${idea}\nFormat: ${format}\nStyle: ${style}\nTarget duration: ${duration}s\nNumber of plans: ${plans}\nReference characters: ${JSON.stringify(characters)}`;
    const r=await fetch('https://apihub.agnes-ai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${process.env.AGNES_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:'agnes-2.5-flash',messages:[{role:'system',content:system},{role:'user',content:user}],temperature:0.7})});
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:data?.error?.message||data?.error||'Agnes text API error',raw:data});
    let content=data?.choices?.[0]?.message?.content||'';
    content=content.replace(/^```json\s*/,'').replace(/\s*```$/,'').trim();
    const json=JSON.parse(content);
    return res.status(200).json(json);
  }catch(e){return res.status(500).json({error:e.message});}
}
