'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardClient() {
  const [intencoes, setIntencoes] = useState([]);
  const URL = process.env.NEXT_PUBLIC_ENDPOINT + 'intentions';

  const fetchData = async () => {
    try {
      const promise = await axios.get(URL);
      setIntencoes(promise.data);
    } catch (error) {
    }
  }

  async function aprovarRecusarIntencao(boolean, id) {
    const confirmar = confirm('Deseja ' + (boolean ? 'aprovar ' : 'rejeitar ') + 'essa intenção?');
    if (confirmar) {
      const intencaoStatus = boolean ? 'APROVADO' : 'REJEITADO';

      try {
        await axios.patch(URL + '/' + id, { 'status': intencaoStatus });

        alert('A intenção foi ' + (boolean ? 'aprovada' : 'rejeitada') + '.');
      } catch (error) {
        console.log(error);
      }

      fetchData();
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='bg-neutral-900 p-10 flex flex-col items-center'>
      <strong>Visualizar Intenções</strong>
      <div className='w-full bg-neutral-950 p-5 mt-5 rounded-lg'>
        {
          intencoes.length > 0 ? (
            intencoes.map((intencao) => {
              return (
                <div key={intencao.id}>
                  <div className='grid grid-cols-4 gap-4 border-1 border-stone-900 mb-1 items-center p-3 rounded'>
                    <div className='truncate'><strong>Nome:</strong>{intencao.nome}</div>
                    <div className='truncate'><strong>Email:</strong> {intencao.email}</div>
                    <div className='truncate'><strong>Empresa:</strong>{intencao.empresa}</div>
                    <div className='truncate'><strong>Motivo:</strong>{intencao.motivoParticipacao}</div>
                  </div>

                  <div className="col-span-4 flex justify-center gap-2 mb-1">
                    <button
                      className='bg-green-800 w-[75] rounded-full p-2 mr-1'
                      onClick={() => aprovarRecusarIntencao(true, intencao.id)}>
                      Aprovar
                    </button>
                    <button
                      className='bg-red-800 w-[75] rounded-full p-2 ml-1'
                      onClick={() => aprovarRecusarIntencao(false, intencao.id)}>
                      Recusar
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className='flex justify-center'><strong>Nenhuma intenção pendente no momento.</strong></div>
          )
        }
      </div>
    </div>
  );
}