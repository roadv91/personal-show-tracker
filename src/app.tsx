import { useState, type FC } from 'react'
import { ShowList } from './components/show-list'
import { ShowListHeader } from './components/show-list-header'
import type { Show } from './types/show'
import './index.css'

// TODO: Remove the sample shows once shows can be added and stored.
/** Sample shows to display until shows can be added and stored. */
const sampleShows: Show[] = [
  {
    id: '1',
    name: 'Avatar: The Last Airbender',
    status: 'completed',
    rating: 5,
    dateCompleted: '2026-09-05',
    notes: 'Seasons 2 & 3 were PEAK',
  },
  { id: '2', name: 'Severance', status: 'ongoing', rating: 4.8, notes: "Mind-bending. Can't wait for S2!" },
  {
    id: '3',
    name: 'Succession',
    status: 'completed',
    rating: 4.9,
    dateCompleted: '2025-05-28',
    notes: 'Roman Roy is incredibly written.',
  },
  {
    id: '4',
    name: 'Breaking Bad',
    status: 'completed',
    rating: 4.7,
    dateCompleted: '2024-08-12',
    notes: 'Classic. Masterpiece pacing.',
  },
  { id: '5', name: 'The Witcher', status: 'dropped', rating: 2.5, notes: 'S3 lost me completely.' },
  {
    id: '6',
    name: 'Ted Lasso',
    status: 'completed',
    rating: 4.3,
    dateCompleted: '2025-10-15',
    notes: 'Pure wholesome comfort food.',
  },
  { id: '7', name: 'House of the Dragon', status: 'ongoing', rating: 4.1 },
  {
    id: '8',
    name: 'The Extraordinarily Long-Winded Chronicles of Supercalifragilisticexpialidocious Adventures in the Land of Neverending Season Finales',
    status: 'completed',
    rating: 3.9,
    dateCompleted: '2026-01-31',
    // 250 characters, the notes limit, including a long URL with no spaces
    notes:
      'Started strong but every episode ends on a cliffhanger. Full recap here: https://www.example.com/reviews/the-extraordinarily-long-winded-chronicles-season-one-finale-breakdown-and-theories so I would not forget. Worth it all for the soundtrack alone!',
  },
]

/**
 * Root component of the Personal Show Tracker app.
 *
 * Currently lists sample shows. Deleting removes a show until the page reloads; editing, filtering,
 * and adding only announce the click, since those features don't exist yet.
 *
 * @returns The top-level page layout.
 */
export const App: FC = () => {
  const [shows, setShows] = useState(sampleShows)
  const [lastAction, setLastAction] = useState('')

  const handleEdit = (show: Show) => setLastAction(`Edit ${show.name} clicked`)
  const handleDelete = (show: Show) => {
    setShows((currentShows) => currentShows.filter((currentShow) => currentShow.id !== show.id))
    setLastAction(`${show.name} deleted`)
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 tablet:px-8">
      <ShowListHeader
        showCount={shows.length}
        onFilter={() => setLastAction('Filter clicked')}
        onAddShow={() => setLastAction('Add show clicked')}
      />
      <ShowList shows={shows} onEdit={handleEdit} onDelete={handleDelete} />
      <p aria-live="polite" className="text-sm text-neutral-600">
        {lastAction}
      </p>
    </main>
  )
}
