// import { createFeatureSelector, createSelector } from '@ngrx/store';
// import { AuthState } from './auth.reducer';

// export const selectAuthState = createFeatureSelector<AuthState>('auth');

// export const selectLocalId = createSelector(
//   selectAuthState,
//   (state: AuthState) => state.localId
// );


import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectLocalId = createSelector(
  selectAuthState,
  (state: AuthState) => state.localId
);

const selectLikedData = createFeatureSelector<any>('likedData');

export const isPostLiked = (postId: string) =>
  createSelector(selectLikedData, selectLocalId, (likedData, localId) =>
    likedData[postId]?.likeusersdata?.includes(localId)
  );
