// app/performance/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

type PerformanceStats = {
  totalMembros: number;
  totalIndicacoesMes: number;
  totalObrigadosMes: number;
};

export default function PerformancePage() {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT + 'dashboard';
        const response = await axios.get(API_URL);
        setStats(response.data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div>Carregando estatísticas...</div>;
  }

  if (!stats) {
    return <div>Não foi possível carregar os dados.</div>;
  }

  return (
    <div className='bg-neutral-900 p-10 flex flex-col items-center'>
      <strong>Dashboard de Performance</strong>
      <div className='w-full bg-neutral-950 p-5 mt-5 rounded-lg'>
        <div className='grid grid-cols-3 gap-4 border-1 border-stone-900 mb-1 items-center p-3 rounded'>
          <div className='truncate'>
            <strong>Membros Ativos Totais:</strong>
            {stats.totalMembros}
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4 border-1 border-stone-900 mb-1 items-center p-3 rounded'>
          <div className='truncate'>
            <strong>Total de Indicações no Mês:</strong>
            {Math.ceil(stats.totalIndicacoesMes)}
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4 border-1 border-stone-900 mb-1 items-center p-3 rounded'>
          <div className='truncate'>
            <strong>Total de Obrigados no Mês:</strong>
            {Math.ceil(stats.totalObrigadosMes)}
          </div>
        </div>
      </div>
    </div>
  );
}