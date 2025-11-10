'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function IntentionPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [motivoParticipacao, setMotivoParticipacao] = useState('');

  async function enviaFormulario(event) {
    event.preventDefault();
    const data = {
      'nome': nome,
      'email': email,
      'empresa': empresa,
      'motivoParticipacao': motivoParticipacao
    }

    const URL = process.env.NEXT_PUBLIC_ENDPOINT + 'intentions';

    try {
      await axios.post(URL, data);
      alert('Dados enviados com sucesso!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 409) {
          alert(`Erro: ${message || 'Email já existente.'}`);
        } else if (status === 400) {
          alert(`Erro de validação: ${message}`);
        } else if (status === 404) {
          alert('Recurso não encontrado!');
        }

        console.error('Detalhes do erro:', error.response?.data);
      }
    }

    setNome('');
    setEmail('');
    setEmpresa('');
    setMotivoParticipacao('');
  }

  return (
    <div className='bg-neutral-900 p-10 flex flex-col items-center'>
      <strong> Página de Intenção </strong>
      <div className='bg-neutral-950 p-5 mt-5 rounded-lg'>
        <form onSubmit={enviaFormulario}>
          <div className='mb-5'>
            <h1 className='mr-5'>Nome:</h1>
            <input
              className='bg-neutral-900 w-100 border border-black rounded-lg p-1'
              type="text"
              id="nome"
              value={nome}
              placeholder='Digite seu nome'
              onChange={(event) => setNome(event.target.value)}
              required
            />
          </div>

          <div className='mb-5'>
            <h1 className='mr-5'>E-mail:</h1>
            <input
              className='bg-neutral-900 w-100 border border-black rounded-lg p-1'
              type="email"
              id="email"
              value={email}
              placeholder='Digite seu e-mail'
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className='mb-5'>
            <h1 className='mr-5'>Empresa:</h1>
            <input
              className='bg-neutral-900 w-100 border border-black rounded-lg p-1'
              type="text"
              id="empresa"
              value={empresa}
              placeholder='Digite sua empresa'
              onChange={(event) => setEmpresa(event.target.value)}
              required
            />
          </div>

          <div className='mb-5'>
            <h1 className='mr-5'>Motivo de participação:</h1>
            <textarea
              id="motivo"
              className='bg-neutral-900 w-100 border border-black rounded-lg p-1'
              value={motivoParticipacao}
              placeholder='Digite o motivo da sua participação'
              onChange={(event) => setMotivoParticipacao(event.target.value)}
              required
            />
          </div>

          <button className='w-full bg-green-800 p-2 rounded-full'>Enviar Intenção</button>
        </form>
      </div>
    </div >
  );
}