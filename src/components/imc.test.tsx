import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

import IMC from './imc';

describe('IMC component', () => {
  it('renders inputs and button', () => {
    render(<IMC />);

    expect(screen.getByText('Calculadora de IMC')).toBeInTheDocument();
    expect(screen.getByLabelText(/Peso \(kg\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Altura \(m\):/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calcular IMC/i })).toBeInTheDocument();
  });

  it('shows "Abaixo do peso" for IMC < 18.5 and formats to two decimals', async () => {
    const user = userEvent.setup();
    render(<IMC />);

    const pesoInput = screen.getByLabelText(/Peso \(kg\):/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\):/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await user.type(pesoInput, '50');
    await user.type(alturaInput, '1.70');
    await user.click(button);

    expect(screen.getByText(/Seu IMC é 17\.30 - Abaixo do peso/i)).toBeInTheDocument();
  });

  it('classifies Peso normal, Sobrepeso and Obesidade categories correctly', async () => {
    const user = userEvent.setup();

    // Teste Peso normal (IMC = 22)
    const { unmount } = render(<IMC />);
    let pesoInput = screen.getByLabelText(/Peso \(kg\):/i);
    let alturaInput = screen.getByLabelText(/Altura \(m\):/i);
    let button = screen.getByRole('button', { name: /Calcular IMC/i });

    await user.type(pesoInput, '70');
    await user.type(alturaInput, '1.78');
    await user.click(button);

    expect(screen.getByText(/Peso normal/i)).toBeInTheDocument();
    unmount();

    // Teste Sobrepeso (IMC = 27)
    render(<IMC />);
    pesoInput = screen.getByLabelText(/Peso \(kg\):/i);
    alturaInput = screen.getByLabelText(/Altura \(m\):/i);
    button = screen.getByRole('button', { name: /Calcular IMC/i });

    await user.clear(pesoInput);
    await user.clear(alturaInput);
    await user.type(pesoInput, '85');
    await user.type(alturaInput, '1.78');
    await user.click(button);

    expect(screen.getByText(/Sobrepeso/i)).toBeInTheDocument();
  });

  it('shows Obesidade grau III for very high IMC', async () => {
    const user = userEvent.setup();
    render(<IMC />);

    const pesoInput = screen.getByLabelText(/Peso \(kg\):/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\):/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await user.type(pesoInput, '120');
    await user.type(alturaInput, '1.70');
    await user.click(button);

    expect(screen.getByText(/Obesidade grau III/i)).toBeInTheDocument();
  });

  it('shows error when peso is non-positive', async () => {
    const user = userEvent.setup();
    render(<IMC />);

    const pesoInput = screen.getByLabelText(/Peso \(kg\):/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\):/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await user.type(pesoInput, '-5');
    await user.type(alturaInput, '1.70');
    await user.click(button);

    expect(screen.getByText(/O peso deve ser um valor positivo/i)).toBeInTheDocument();
  });

  it('shows error when altura is non-positive', async () => {
    const user = userEvent.setup();
    render(<IMC />);

    const pesoInput = screen.getByLabelText(/Peso \(kg\):/i);
    const alturaInput = screen.getByLabelText(/Altura \(m\):/i);
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await user.type(pesoInput, '70');
    await user.type(alturaInput, '-1.70');
    await user.click(button);

    expect(screen.getByText(/A altura deve ser um valor positivo/i)).toBeInTheDocument();
  });
});
