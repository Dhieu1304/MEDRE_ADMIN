import { Navigate } from "react-router-dom";
import routeConfig from "../../config/routeConfig";
import { useAuthStore } from "../../store/AuthStore/hooks";
import defineAbilityFor from "../../config/defineAbility";
import { AbilityContext, Can } from "../../store/AbilityStore";
import { Payment } from "../../entities";
import { NotHaveAccess } from "../../features/auth";

const payment = new Payment({ id: 1 });

function PaymentPage() {
  const authStore = useAuthStore();
  const ability = defineAbilityFor(authStore.user);

  return authStore.isLogin ? (
    <AbilityContext.Provider value={ability}>
      <div className="payment">
        <Can not I="manage" a={payment}>
          <NotHaveAccess />
        </Can>
      </div>
    </AbilityContext.Provider>
  ) : (
    <Navigate to={routeConfig.auth} />
  );
}

export default PaymentPage;
