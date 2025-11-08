import { DEFAULTS } from "@/config/defaults";

export default function getAvatarForGender(gender) {
  switch (gender) {
    case "MALE":
      return DEFAULTS.illustrations.guyAvatar;
    case "FEMALE":
      return DEFAULTS.illustrations.girlAvatar;
    default:
      return DEFAULTS.illustrations.defaultAvatar;
  }
}
