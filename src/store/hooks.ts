import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store.ts'

// Typed versions of react-redux's hooks, so components get RootState and AppDispatch without repeating the types
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
