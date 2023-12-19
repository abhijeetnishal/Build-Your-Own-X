import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { redirect } from 'next/navigation';
import useApi from './useApi';
import { deleteCookie, getCookie } from 'cookies-next';
import ProfileService from '@/httpService/ProfileService';
import { authAtom } from '@/state/authAtom';
import { profileAtom } from '@/state/profileAtom';
import { useCookies } from 'next-client-cookies';

export default function useUser({ redirectTo = '', token = '' } = {}) {
  const [isAuth, setIsAuth] = useRecoilState(authAtom);
  const [profile, setProfile] = useRecoilState(profileAtom);
  const cookies = useCookies();

  let [{ data: user, isLoading, isError }, getProfileDetails] = useApi(null);

  useEffect(() => {
    // if no redirect needed, just return
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!user) return;

    if (user && user.code) {
      const { data: userDetails, code } = user;
      if (code === 200) {
        setProfile(userDetails);
      } else {
        cookies.remove('token');
        if (redirectTo !== '') {
          redirect(redirectTo);
        }
        setIsAuth('');
      }
    } else if (isError) {
      // If the token was fraud we first remove it from cookie and then redirect to "/"
      cookies.remove('token');
      if (redirectTo !== '') {
        redirect(redirectTo);
      }
      setIsAuth('');
    }
  }, [user, isError, redirectTo]);

  useEffect(() => {
    if (!token && redirectTo !== '') {
      redirect(redirectTo);
    } else {
      if (!isAuth && token) {
        setIsAuth(token);
      }

      // we call the api that verifies the token.
      if (!profile) {
        getProfileDetails(() => () => ProfileService.getDetails(token));
      }
    }
  }, []);
}
