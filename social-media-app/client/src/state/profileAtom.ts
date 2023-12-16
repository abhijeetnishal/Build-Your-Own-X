import { atom } from 'recoil';

const profileAtom = atom({
    key: 'profile-atom',
    default: {
        userId: '',
        userName: ''
    },
});

export { profileAtom };