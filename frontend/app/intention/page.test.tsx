import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import IntentionPage from './page';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IntentionPage', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear();
    window.alert = jest.fn();
  });

  it('should render the form correctly', () => {
    render(<IntentionPage />);

    expect(screen.getByText('Página de Intenção')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu e-mail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar Intenção/i })).toBeInTheDocument();
  });

  it('should submit the form with the correct data', async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 1 } });
    render(<IntentionPage />); 1

    const nomeInput = screen.getByPlaceholderText('Digite seu nome');
    const emailInput = screen.getByPlaceholderText('Digite seu e-mail');
    const motivoInput = screen.getByPlaceholderText('Digite o motivo da sua participação');
    const submitButton = screen.getByRole('button', { name: /Enviar Intenção/i });

    fireEvent.change(nomeInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'johndoe@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('Digite sua empresa'), { target: { value: 'John Doe Inc.' } });
    fireEvent.change(motivoInput, { target: { value: 'Motivo de teste' } });
    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        process.env.NEXT_PUBLIC_ENDPOINT + 'intentions',
        {
          nome: 'John Doe',
          email: 'johndoe@email.com',
          empresa: 'John Doe Inc.',
          motivoParticipacao: 'Motivo de teste',
        }
      );

      expect(window.alert).toHaveBeenCalledWith('Dados enviados com sucesso!');
      expect(nomeInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
    });
  });
});