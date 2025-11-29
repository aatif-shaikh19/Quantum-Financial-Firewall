import React from "react";
type ExplainMap = {[k:string]:number};
export default function AIResultPanel({aiResult}:{aiResult:any|null}){
  if(!aiResult) return <div className="card"><div style={{color:'#94a3b8'}}>Waiting for analysis...</div></div>;
  const explain:ExplainMap = aiResult.explainability || {};
  const max = Math.max(...Object.values(explain),1);
  return (
    <div className="card" style={{marginTop:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:12,color:'#94a3b8'}}>Safety Score</div>
          <div style={{fontSize:28,fontWeight:700,color: aiResult.score>80? '#68d391': aiResult.score>60? '#f6e05e':'#f56565'}}>{aiResult.score}<span style={{fontSize:12,color:'#94a3b8'}}>/100</span></div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:12,color:'#94a3b8'}}>Risk</div>
          <div style={{padding:'6px 10px',borderRadius:6,background:'#062f2f',color:'#66f6f6',fontWeight:600}}>{aiResult.riskLevel}</div>
          <div style={{fontSize:12,color:'#94a3b8'}}>Rec</div>
          <div style={{
            padding:'6px 10px',borderRadius:6,fontWeight:600,marginTop:4,
            background: aiResult.recommendation==='BLOCK'?'#742a2a': aiResult.recommendation==='FLAG'?'#744210':'#22543d',
            color: aiResult.recommendation==='BLOCK'?'#feb2b2': aiResult.recommendation==='FLAG'?'#fbd38d':'#9ae6b4'
          }}>
            {aiResult.recommendation}
          </div>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <div style={{fontSize:12,color:'#94a3b8'}}>AI Narrative</div>
        <div style={{marginTop:6}}>{aiResult.narrative}</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
        <div>
          <div style={{fontSize:12,color:'#94a3b8'}}>Top Factors</div>
          <ul style={{marginTop:8}}>
            {aiResult.factors.map((f:string,i:number)=><li key={i} style={{color:'#e6eef6'}}>{f}</li>)}
          </ul>
        </div>
        <div>
          <div style={{fontSize:12,color:'#94a3b8'}}>Explainability (Top 3)</div>
          <div style={{marginTop:8}}>
            {Object.entries(explain).length===0 && <div style={{color:'#94a3b8'}}>No data</div>}
            {Object.entries(explain)
              .sort(([,a],[,b])=>b-a)
              .slice(0,3)
              .map(([k,v])=>{
              const pct = Math.round((v/max)*100);
              return (
                <div key={k} style={{marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><div style={{color:'#e6eef6'}}>{k}</div><div style={{color:'#9aa6b2'}}>{v}</div></div>
                  <div style={{height:10,background:'#071827',borderRadius:6,overflow:'hidden'}}><div style={{width:`${pct}%`,height:'100%',background: pct>66? '#f56565': pct>33? '#f6e05e':'#68d391'}}></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
