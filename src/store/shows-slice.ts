import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Show, ShowInput } from '../types/show'

/** The `shows` slice: the list of shows the user is tracking, in the order they were added. */
export const showsSlice = createSlice({
  name: 'shows',
  // The real starting list comes from the store's preloaded state (saved shows or the samples)
  initialState: [] as Show[],
  reducers: {
    /** Adds a show to the end of the list, giving it a new unique ID. */
    addShow: {
      reducer: (shows, action: PayloadAction<Show>) => {
        shows.push(action.payload)
      },
      // The ID is generated here, not in the reducer, because reducers must not be random
      prepare: (showInput: ShowInput) => ({ payload: { ...showInput, id: crypto.randomUUID() } }),
    },
    /** Replaces the show that has the same ID. Does nothing if there's no such show. */
    updateShow: (shows, action: PayloadAction<Show>) => {
      const index = shows.findIndex((show) => show.id === action.payload.id)
      if (index !== -1) shows[index] = action.payload
    },
    /** Removes the show with the given ID. */
    deleteShow: (shows, action: PayloadAction<string>) => shows.filter((show) => show.id !== action.payload),
  },
  selectors: {
    /** All shows, in the order they were added. */
    selectShows: (shows) => shows,
  },
})

export const { addShow, updateShow, deleteShow } = showsSlice.actions
export const { selectShows } = showsSlice.selectors
