import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './app'
import { loadShows, saveShows, storageKeys } from './services/storage'
import { sampleShows } from './store/sample-shows'
import type { Show } from './types/show'
import { formatShowCount } from './utils/format-show-count'

const shows: Show[] = [
  { id: '1', name: 'Severance', status: 'ongoing', rating: 4.8 },
  { id: '2', name: 'Breaking Bad', status: 'completed', rating: 4.7 },
]

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('App', () => {
  it('renders the heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'My Shows' })).toBeInTheDocument()
  })

  it('starts with the sample shows when nothing is saved', () => {
    render(<App />)
    expect(screen.getByText(formatShowCount(sampleShows.length))).toBeInTheDocument()
  })

  it('deletes a show, updates the count, and saves the change', async () => {
    saveShows(shows)
    render(<App />)
    expect(screen.getByText('2 shows')).toBeInTheDocument()

    // Both layouts are rendered in jsdom, so there are two delete buttons per show
    await userEvent.click(screen.getAllByRole('button', { name: 'Delete Severance' })[0])

    expect(screen.getByText('1 show')).toBeInTheDocument()
    expect(screen.getByText('Severance deleted')).toBeInTheDocument()
    expect(loadShows()).toEqual([shows[1]])
  })

  it('throws while rendering when the saved data is broken, so an error boundary can catch it', () => {
    localStorage.setItem(storageKeys.shows, '{not json')
    // React logs caught render errors to the console; silence it to keep the test output clean
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<App />)).toThrow()
  })
})
