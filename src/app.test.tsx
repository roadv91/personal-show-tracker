import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './app'
import { loadShows, saveShows, storageKeys } from './services/storage'
import type { Show } from './types/show'

const shows: Show[] = [
  { id: '1', name: 'Severance', status: 'ongoing', rating: 4.8 },
  { id: '2', name: 'Breaking Bad', status: 'completed', rating: 4.7 },
]

afterEach(() => vi.restoreAllMocks())

describe('App', () => {
  it('renders the heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'My Shows' })).toBeInTheDocument()
  })

  it('starts with no shows when nothing is saved', () => {
    render(<App />)
    expect(screen.getByText('0 shows')).toBeInTheDocument()
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

  it('opens and closes the Add show sheet, then opens Edit show in edit mode', async () => {
    saveShows(shows)
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Add show' }))
    expect(screen.getByRole('dialog', { name: 'Add show' })).toHaveTextContent('The add show form will go here.')

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // Both layouts are rendered in jsdom, so there are two edit buttons per show
    await userEvent.click(screen.getAllByRole('button', { name: 'Edit Severance' })[0])
    expect(screen.getByRole('dialog', { name: 'Edit show' })).toHaveTextContent(
      'The edit form for Severance will go here.',
    )
  })

  it('opens the Edit show sheet for whichever show was clicked, then Add show in add mode', async () => {
    saveShows(shows)
    render(<App />)
    // Both layouts are rendered in jsdom, so there are two edit buttons per show
    await userEvent.click(screen.getAllByRole('button', { name: 'Edit Severance' })[0])
    expect(screen.getByRole('dialog', { name: 'Edit show' })).toHaveTextContent(
      'The edit form for Severance will go here.',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await userEvent.click(screen.getAllByRole('button', { name: 'Edit Breaking Bad' })[0])
    const editDialog = screen.getByRole('dialog', { name: 'Edit show' })
    expect(editDialog).toHaveTextContent('The edit form for Breaking Bad will go here.')
    expect(editDialog).not.toHaveTextContent('Severance')
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await userEvent.click(screen.getByRole('button', { name: 'Add show' }))
    expect(screen.getByRole('dialog', { name: 'Add show' })).toHaveTextContent('The add show form will go here.')
  })

  it('throws while rendering when the saved data is broken, so an error boundary can catch it', () => {
    localStorage.setItem(storageKeys.shows, '{not json')
    // React logs caught render errors to the console; silence it to keep the test output clean
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<App />)).toThrow()
  })
})
