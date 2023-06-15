import React from 'react';
import { render, screen } from '@testing-library/react';
import Todo from './Todo';

describe('Todo component', () => {
  it('renders the todo text', () => {
    const todo = {
      text: 'Sample Todo',
      done: false
    };

    render(<Todo todo={todo} />);
    const todoText = screen.getByText(/Sample Todo/i);

    expect(todoText).toBeInTheDocument();
  });
});
