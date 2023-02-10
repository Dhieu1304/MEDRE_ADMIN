import logo from "./logo.svg";
import "./App.css";
import defineAbilityFor from "./config/defineAbility";
import { AbilityContext, Can } from "./store/AbilityStore";
import { Booking, Patient, Report } from "./entities";

const user = { roleId: 1 };
const ability = defineAbilityFor(user);

const patient = new Patient({ id: 1 });
const report = new Report({ id: 1 });
const booking = new Booking({ id: 1 });

function App() {
    return (
        <AbilityContext.Provider value={ability}>
            <div className="booking">
                roleId = {user?.roleId} - Booking:
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
                roleId = {user?.roleId} - Patient:
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
                roleId = {user?.roleId} - Report:
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
        </AbilityContext.Provider>
    );
}

export default App;
