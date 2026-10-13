import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

/** `useDispatch`, typed for this app's actions. Use it instead of the plain hook. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

/** `useSelector`, typed for this app's state. Use it instead of the plain hook. */
export const useAppSelector = useSelector.withTypes<RootState>()
