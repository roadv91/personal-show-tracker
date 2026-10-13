import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { defaultSortOption, type SortOption } from '../utils/sort-options'

/** The `sort` slice: how the user wants the shows sorted. Not applied to the list yet. */
export const sortSlice = createSlice({
  name: 'sort',
  initialState: defaultSortOption as SortOption,
  reducers: {
    /** Changes the sort choice. */
    setSort: (_currentSortOption, action: PayloadAction<SortOption>) => action.payload,
  },
  selectors: {
    /** The current sort choice. */
    selectSortOption: (sortOption) => sortOption,
  },
})

export const { setSort } = sortSlice.actions
export const { selectSortOption } = sortSlice.selectors
