import { useEffect, useState, type FC } from 'react'
import { Provider } from 'react-redux'
import { Header } from './components/header/header'
import { ShowList } from './components/show-list/show-list'
import { Title } from './components/title/title'
import { Toolbar } from './components/toolbar/toolbar'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { deleteShow, selectShows } from './store/shows-slice'
import { createAppStore, saveStateOnChange } from './store/store'
import type { Show } from './types/show'
import { formatShowCount } from './utils/format-show-count'
import './index.css'

/**
 * The page itself: header, title, toolbar, and the show list. Must be rendered inside the Redux
 * `Provider`, which {@link App} sets up.
 *
 * Deleting a show removes it from the store, which saves it. Editing, filtering, and adding only
 * announce the click, since those features aren't connected yet.
 *
 * @returns The page layout.
 */
const AppContent: FC = () => {
  const showCount = useAppSelector(selectShows).length
  const dispatch = useAppDispatch()
  // A temporary on-screen message about the last click, not app data, so it stays out of the store
  const [lastAction, setLastAction] = useState('')

  const handleEdit = (show: Show) => setLastAction(`Edit ${show.name} clicked`)
  const handleDelete = (show: Show) => {
    dispatch(deleteShow(show.id))
    setLastAction(`${show.name} deleted`)
  }

  return (
    <>
      <Header onAddShow={() => setLastAction('Add show clicked')} />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 tablet:px-8">
        {/* Mobile: title, then the toolbar below. Tablet and up: title left, toolbar right. */}
        <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
          <Title title="My Shows" description={formatShowCount(showCount)} />
          <Toolbar onFilter={() => setLastAction('Filter clicked')} />
        </div>
        <ShowList onEdit={handleEdit} onDelete={handleDelete} />
        <p aria-live="polite" className="text-sm text-neutral-600">
          {lastAction}
        </p>
      </main>
    </>
  )
}

/**
 * Root component of the Personal Show Tracker app. Creates the Redux store from the saved state
 * and provides it to the page.
 *
 * Loading happens during the first render (not before React starts), so an error boundary around
 * `App` can catch it: it throws if the saved data is invalid or the browser blocks storage.
 * Side effect: reads localStorage on the first render, and writes to it whenever the shows or the
 * sort choice change, until `App` unmounts.
 *
 * @returns The app, wrapped in the Redux `Provider`.
 */
export const App: FC = () => {
  // The lazy initializer runs only on the first render, so the saved state is loaded once
  const [store] = useState(() => createAppStore())
  // Returning the unsubscribe function stops saving when App unmounts
  useEffect(() => saveStateOnChange(store), [store])

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}
