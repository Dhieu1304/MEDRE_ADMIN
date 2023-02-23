import { useAppConfigStore } from "../../store/AppConfigStore/hooks";
import "../../config/i18n";

function HomePage() {
  const { mode, locale } = useAppConfigStore();

  return (
    <div>
      HomePage
      <p>mode: {mode}</p>
      <p>locale: {locale}</p>
    </div>
  );
}

export default HomePage;
