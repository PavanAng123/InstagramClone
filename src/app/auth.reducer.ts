import { createReducer, on } from '@ngrx/store';
import { loginSuccess, loginFailure } from './auth.actions';
import { updateUsername, updateprofilepic } from './auth.actions';

export interface AuthState {
  localId: string | null;
  error: any;
  username: string | null;
  details: any;
}

export const initialState: AuthState = {
  localId: null,
  error: null,
  username: null,
  details: null,
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { localId }) => ({
    ...state,
    localId,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({ ...state, error }))
);

export const userReducer = createReducer(
  initialState,
  on(updateUsername, (state, { username }) => ({ ...state, username })),
  on(updateprofilepic, (state, { profilepic }) => ({ ...state, profilepic }))
);
