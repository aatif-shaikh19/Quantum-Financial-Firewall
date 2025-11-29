const API_BASE = (import.meta.env.VITE_API_BASE) || "http://localhost:8000";
async function call(path:string, opts:RequestInit={}){
  const res = await fetch(API_BASE + path, opts);
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
export const Api = {
  getBalance: (userId="user-1") => call(`/balance?userId=${userId}`),
  analyze: (tx:any) => call("/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(tx)}),
  quote: (tx:any) => call("/quote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(tx)}),
  route: (tx:any) => call("/route",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(tx)}),
  establishKey: (opts?:any) => call(`/establish-key?${opts?new URLSearchParams(opts):""}`,{method:"POST"}),
  execute: (tx:any,key?:string,risk_score?:number) => call(`/execute?risk_score=${risk_score||100}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(tx)}),
  history: () => call("/history")
};
