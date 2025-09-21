import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorScreen from '../demo/ErrorSreen';

describe('ErrorScreen Component', () => {
  const defaultProps = {
    error: 'Test error message'
  };

  it('should render error message', () => {
    render(<ErrorScreen {...defaultProps} />);
    
    expect(screen.getByText('⚠️ Error')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should render without retry button when onRetry is not provided', () => {
    render(<ErrorScreen {...defaultProps} />);
    
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should render with retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorScreen {...defaultProps} onRetry={onRetry} />);
    
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<ErrorScreen {...defaultProps} onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should handle different error messages', () => {
    const customError = 'Network connection failed';
    render(<ErrorScreen error={customError} />);
    
    expect(screen.getByText(customError)).toBeInTheDocument();
  });

  it('should handle empty error message', () => {
    render(<ErrorScreen error="" />);
    
    expect(screen.getByText('⚠️ Error')).toBeInTheDocument();
    // Check for empty paragraph instead of searching for empty text
    const paragraph = screen.getByRole('heading').nextElementSibling;
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe('');
  });

  it('should maintain accessibility structure', () => {
    const onRetry = jest.fn();
    render(<ErrorScreen {...defaultProps} onRetry={onRetry} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('⚠️ Error');
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Try Again');
  });
});