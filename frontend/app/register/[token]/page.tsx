'use client';

import axios from 'axios';
import React, { use, useEffect, useState } from 'react';

export default function Page({ params }: { params: { token: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [userData, setUserData] = useState(null);
  const [senha, setSenha] = useState('');
  const [senhaConfirmada, setSenhaConfirmada] = useState('');
  const param = use(params);
  const token = param.token;
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setIsValid(false);
      return;
    }

    async function validateToken() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT + `intentions/validate/${token}`;
        const response = await axios.get(API_URL);

        console.log('Token válido! Dados:', response.data);
        setUserData(response.data);
        setIsValid(true);
      } catch (error) {
        console.error('Token inválido:', error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    }

    validateToken();
  }, [token]);

  async function enviaFormulario(event) {
    event.preventDefault();

    if (senha != senhaConfirmada) {
      alert('As senhas precisam ser iguais.');
    } else if (!senha || !senhaConfirmada) {
      alert('As senhas não podem ser vazias.');
    } else if (userData) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT + 'members';
        const data = {
          token: token,
          senha: senha
        }

        const promise = await axios.post(API_URL, data);
        console.log(promise.status);
        console.log(promise.data);
        alert('Conta criada com sucesso!');
      } catch (error) {
        console.error('Erro ao criar membro:', error);
        if (axios.isAxiosError(error) && error.response) {
          alert(`Erro: ${error.response.data.message}`);
        } else {
          alert('Não foi possível criar sua conta.');
        }
      }

      setSenha('');
      setSenhaConfirmada('');
    }
  }

  return (
    <div className='bg-neutral-900 p-10 flex flex-col items-center'>
      {
        isLoading ?
          <div>Validando seu convite...</div>
          : !isValid ?
            <div><h1>Convite Inválido</h1><p>Seu link pode ter expirado.</p></div>
            :
            <form className='bg-neutral-950 p-5 mt-5 rounded-lg flex flex-col items-center' onSubmit={enviaFormulario}>
              <strong>Olá, {userData.nome}!</strong>
              <strong>Convite validado com sucesso.</strong>
              <strong>Crie sua senha para completar o cadastro.</strong>
              <div className='truncate mt-5'>
                <input
                  className='bg-neutral-900 w-100 border border-black rounded-lg p-1'
                  type='password'
                  placeholder='Digite sua senha'
                  onChange={(event) => setSenha(event.target.value)}
                />
              </div>
              <div className='truncate mt-5'>
                <input className='bg-neutral-900 w-100 border border-black rounded-lg p-1'
                  type='password'
                  placeholder='Confirme sua senha'
                  onChange={(event) => setSenhaConfirmada(event.target.value)}
                />
              </div>
              <button className='bg-green-800 rounded-full p-2 mt-5'>Criar senha</button>
            </form>
      }
    </div >
  );
}