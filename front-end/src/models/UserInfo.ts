interface UserInfo {
  nom: string;
  prenom: string;
  email: string;
  pathPhoto: string | undefined | null;
  groups: string[];
  misc: Object | undefined;
}

export default UserInfo;
