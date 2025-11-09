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

    const URL = 'http://localhost:3001/intentions';

    try {
      const promise = await axios.post(URL, data);
      console.log(promise.statusText);
      alert('Dados enviados com sucesso!');
    } catch (error) {
      console.log(error.response.statusText);
      alert('Dados não enviados!');
    }

    setNome('');
    setEmail('');
    setEmpresa('');
    setMotivoParticipacao('');
  }

  return (
    <div
      className='bg-neutral-900 p-10 flex flex-col items-center'
    >
      <h1>
        Página de Intenção
      </h1>

      <div
        className='bg-neutral-950 p-5 mt-5 rounded-lg'
      >
        <form onSubmit={enviaFormulario}>
          <div
            className='mb-5'
          >
            <h1
              className='mr-5'
            >
              Nome:
            </h1>
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

          <div
            className='mb-5'
          >
            <h1
              className='mr-5'
            >
              E-mail:
            </h1>
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

          <div
            className='mb-5'
          >
            <h1
              className='mr-5'
            >
              Empresa:
            </h1>
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

          <div
            className='mb-5'
          >
            <h1
              className='mr-5'
            >
              Motivo de participação:
            </h1>
            <textarea
              id="motivo"
              className='bg-neutral-900 w-100 border border-black rounded-lg p-1'
              value={motivoParticipacao}
              placeholder='Digite o motivo da sua participação'
              onChange={(event) => setMotivoParticipacao(event.target.value)}
              required
            />
          </div>

          <button
            className='w-100 bg-green-950 p-5 rounded-full text-green-500'
            onClick={enviaFormulario}
          >
            Enviar Intenção
          </button>
        </form>
      </div>
    </div >
  );
}