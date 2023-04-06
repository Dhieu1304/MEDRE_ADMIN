import { Can } from "../../store/AbilityStore";
import { Payment } from "../../entities";
import { NotHaveAccess } from "../../features/auth";

const payment = new Payment({ id: 1 });

function PaymentPage() {
  return (
    <div className="payment">
      <Can not I="manage" a={payment}>
        <NotHaveAccess />
      </Can>
      <Can I="manage" a={payment}>
        Tôi có quyền
      </Can>
    </div>
  );
}

export default PaymentPage;
