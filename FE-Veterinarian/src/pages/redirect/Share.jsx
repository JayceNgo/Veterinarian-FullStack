import { Navigate, useParams } from "react-router-dom";
import { Helpers, Urls } from "utils";
import { useApp } from "contexts";
import { PetService } from "services";

export const Share = () => {
  const { isVeterinarian, user } = useApp();
  const { qrcode } = useParams();

  if (Helpers.hasValue(qrcode) && isVeterinarian) {
    PetService.share(user.id, qrcode);
  }

  return <Navigate to={Urls.Path.Page.Home} replace />;
};
