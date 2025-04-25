// src/app/store/actions/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ localId: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const updateUsername = createAction(
  '[User] Update Username',
  props<{ username: string }>()
);

export const updateprofilepic = createAction(
  '[User] Update profilepic',
  props<{ profilepic: any }>()
);
