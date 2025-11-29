import React, { useState } from "react";
import { Api } from "../lib/api";

export default function QKDFlow({ txPayload, aiResult, onSuccess, autoProtect }: { txPayload: any, aiResult: any, onSuccess?: Function, autoProtect: boolean }) {
  const [status, setStatus] = useState<'IDLE' | 'KEY' | 'INTERCEPTED' | 'EXEC' | 'DONE' | 'ERROR'>('IDLE');
  const [key, setKey] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const isBlocked = autoProtect && aiResult.recommendation === 'BLOCK';

  const start = async () => {
    setStatus('KEY'); setErr(null);
    try {
      const resp = await Api.establishKey();
      if (resp.status === "INTERCEPTED") { setStatus('INTERCEPTED'); return; }
      setKey(resp.key); setStatus('KEY');
    } catch (e: any) { setErr(e.message); setStatus('ERROR'); }
  };
  const exec = async () => {
    if (isBlocked) return;
    setStatus('EXEC');
    try {
      const resp = await Api.execute(txPayload, key || undefined, aiResult?.score || 100);
      setStatus('DONE');
      if (onSuccess) onSuccess(resp);
    } catch (e: any) { setErr(e.message); setStatus('ERROR'); }
  };
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Quantum Security Layer</div>
          <div style={{ fontSize: 14 }}>{status}</div>
        </div>
        <div>
          {status === 'IDLE' && <button className="btn" onClick={start}>Establish Quantum Key</button>}
          {status === 'KEY' && key && !isBlocked && <button className="btn" onClick={exec}>Encrypt & Execute</button>}
          {status === 'KEY' && isBlocked && <div style={{ color: '#f56565', fontWeight: 600 }}>BLOCKED BY AUTO-PROTECT</div>}
          {status === 'INTERCEPTED' && <div style={{ color: '#f56565' }}>Interception detected — session aborted</div>}
          {status === 'DONE' && <div style={{ color: '#68d391' }}>Transaction executed</div>}
          {status === 'ERROR' && <div style={{ color: '#f56565' }}>{err}</div>}
        </div>
      </div>
      {key && <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 12 }}>SESSION KEY: {key}</div>}
    </div>
  );
}
