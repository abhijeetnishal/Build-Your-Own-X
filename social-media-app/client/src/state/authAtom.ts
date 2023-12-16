import { atom } from "recoil";

const authAtom = atom({
    key: "auth-atom",
    default: '',
});

export { authAtom };
