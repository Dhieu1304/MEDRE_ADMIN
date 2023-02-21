import { Navigate } from "react-router-dom";
import routeConfig from "../../config/routeConfig";
import { useAuthStore } from "../../store/AuthStore/hooks";
import defineAbilityFor from "../../config/defineAbility";
import { AbilityContext, Can } from "../../store/AbilityStore";
import { Patient, Report, Booking, Payment } from "../../entities";

const user = { roleId: 1 };
const ability = defineAbilityFor(user);

const patient = new Patient({ id: 1 });
const report = new Report({ id: 1 });
const booking = new Booking({ id: 1 });
const payment = new Payment({ id: 1 });

function HomePage() {
  const authStore = useAuthStore();

  return authStore.isLogin ? (
    <AbilityContext.Provider value={ability}>
      <div className="booking">
        roleId = {user?.roleId} - Chức năng Booking:
        <Can I="create" a={booking}>
          <li>Create</li>
        </Can>
        <Can I="read" a={booking}>
          <li>read</li>
        </Can>
        <Can I="write" a={booking}>
          <li>write</li>
        </Can>
        <Can I="update" a={booking}>
          <li>update</li>
        </Can>
      </div>
      <div className="patient">
        roleId = {user?.roleId} - Chức năng Patient:
        <Can I="create" a={patient}>
          <li>Create</li>
        </Can>
        <Can I="read" a={patient}>
          <li>read</li>
        </Can>
        <Can I="write" a={patient}>
          <li>write</li>
        </Can>
        <Can I="update" a={patient}>
          <li>update</li>
        </Can>
      </div>
      <div className="report">
        roleId = {user?.roleId} - Chức năng Report:
        <Can I="create" a={report}>
          <li>Create</li>
        </Can>
        <Can I="read" a={report}>
          <li>read</li>
        </Can>
        <Can I="write" a={report}>
          <li>write</li>
        </Can>
        <Can I="update" a={report}>
          <li>update</li>
        </Can>
      </div>
      <div className="payment">
        roleId = {user?.roleId} - Chức năng Report:
        <Can I="create" a={payment}>
          <li>Create</li>
        </Can>
        <Can I="read" a={payment}>
          <li>read</li>
        </Can>
        <Can I="write" a={payment}>
          <li>write</li>
        </Can>
        <Can I="update" a={payment}>
          <li>update</li>
        </Can>
      </div>
    </AbilityContext.Provider>
  ) : (
    <Navigate to={routeConfig.auth} />
  );
}

export default HomePage;
