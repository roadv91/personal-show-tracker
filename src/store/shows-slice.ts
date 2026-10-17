import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Show, ShowInput } from '../types/show'
import type { SortOption } from '../utils/sort-options'
import { sortShows } from '../utils/sort-shows'

/** The data the `shows` slice holds. */
export interface ShowsState {
  /** The shows the user is tracking, in the order they were added. */
  shows: Show[]
  /** How the user wants the shows sorted. Applied when reading, see `selectSortedShows`. */
  sortMethod: SortOption
}

/**
 * No shows until the user adds some, sorted newest first. This is the only place these defaults are
 * defined; saved data replaces them through the store's preloaded state.
 */
const initialState: ShowsState = {
  shows: [],
  sortMethod: 'date-newest',
}

/** The `shows` slice: the user's shows, plus how they want them sorted. */
export const showsSlice = createSlice({
  name: 'shows',
  initialState,
  reducers: {
    /** Adds a show to the end of the list, giving it a new unique ID. */
    addShow: {
      reducer: (state, action: PayloadAction<Show>) => {
        state.shows.push(action.payload)
      },
      // The ID is generated here, not in the reducer, because reducers must not be random
      prepare: (showInput: ShowInput) => ({ payload: { ...showInput, id: crypto.randomUUID() } }),
    },
    /** Replaces the show that has the same ID. Does nothing if there's no such show. */
    updateShow: (state, action: PayloadAction<Show>) => {
      const index = state.shows.findIndex((show) => show.id === action.payload.id)
      if (index !== -1) state.shows[index] = action.payload
    },
    /** Removes the show with the given ID. */
    deleteShow: (state, action: PayloadAction<string>) => {
      state.shows = state.shows.filter((show) => show.id !== action.payload)
    },
    /** Changes how the shows are sorted. */
    setSortMethod: (state, action: PayloadAction<SortOption>) => {
      state.sortMethod = action.payload
    },
  },
  selectors: {
    /** All shows, in the order they were added. */
    selectShows: (state) => state.shows,
    /** How the user wants the shows sorted. */
    selectSortMethod: (state) => state.sortMethod,
  },
})

export const { addShow, updateShow, deleteShow, setSortMethod } = showsSlice.actions
export const { selectShows, selectSortMethod } = showsSlice.selectors

/**
 * The shows sorted by the current sort method. Memoized, so it returns the same array until the
 * shows or the sort method change. The stored list is left in the order shows were added.
 */
export const selectSortedShows = createSelector([selectShows, selectSortMethod], sortShows)
